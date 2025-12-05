import os
import uuid
import torch
import clip
from PIL import Image
from flask import Flask, request, jsonify, render_template, send_file, session
from ultralytics import YOLO
from google.generativeai import GenerativeModel, configure
from flask_cors import CORS 

# ===================== 경로 =====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
SEED_BASE = os.path.join(BASE_DIR, "list_image")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ===================== 모델 =====================
yolo_model = YOLO(os.path.join(BASE_DIR, "yolov8n.pt"))
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)


# Seed 임베딩
seed_embeddings = []

def load_seed_embeddings():
    for class_name in os.listdir(SEED_BASE):
        class_path = os.path.join(SEED_BASE, class_name)
        if not os.path.isdir(class_path):
            continue

        for file in os.listdir(class_path):
            full_path = os.path.join(class_path, file)
            try:
                img = preprocess(Image.open(full_path)).unsqueeze(0).to(device)
                with torch.no_grad():
                    emb = clip_model.encode_image(img)
                emb = emb / emb.norm()

                seed_embeddings.append({
                    "class": class_name,
                    "filename": file,
                    "path": full_path,
                    "relative_url": f"/list_image/{class_name}/{file}".replace("\\","/"),
                    "embedding": emb
                })

            except:
                continue


load_seed_embeddings()

def find_top3(target_embedding, target_class):
    sims = []
    for item in seed_embeddings:
        if item["class"] != target_class:
            continue

        emb = item["embedding"]
        emb = emb / emb.norm()
        sim = float((target_embedding @ emb.T).item())

        sims.append({
            "filename": item["filename"],
            "similarity": sim,
            "url": item["relative_url"]    # ★ 핵심
        })

    sims = sorted(sims, key=lambda x: x["similarity"], reverse=True)
    return sims[:3]


# ===================== Flask 앱 =====================
app = Flask(__name__)
CORS(app)
app.secret_key = "abcd1234"

# ===================== AI 챗봇 설정 =====================
from google.generativeai import GenerativeModel, configure
import os

configure(api_key=os.getenv("GOOGLE_API_KEY"))

# 반드시 공식 모델 ID 사용
gemini_model = GenerativeModel("models/gemini-2.5-flash")
# ===================== 라우트 =====================
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/localfile/<path:filepath>")
def localfile(filepath):
    return send_file(filepath)

# 이미지 감지
@app.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "이미지가 필요합니다."}), 400

    file = request.files["image"]
    img_id = f"{uuid.uuid4()}.jpg"
    save_path = os.path.join(UPLOAD_DIR, img_id)
    file.save(save_path)

    results = yolo_model(save_path)[0]
    results.save(filename=os.path.join(OUTPUT_DIR, img_id))
    img_pil = Image.open(save_path).convert("RGB")

    class_counter = {}
    detected_objects = []
    detected_classes = set()

    for idx, box in enumerate(results.boxes):
        cls_id = int(box.cls.item())
        cls_name = results.names[cls_id]
        detected_classes.add(cls_name)

        if cls_name not in class_counter:
            class_counter[cls_name] = 1
        else:
            class_counter[cls_name] += 1

        detected_objects.append({
            "id": f"{cls_name}_{class_counter[cls_name]}",
            "class": cls_name,
            "bbox": [int(x) for x in box.xyxy.tolist()[0]],
        })

    session["detected_classes"] = list(detected_classes)
    session["last_step"] = "AFTER_DETECT"
    return jsonify({
        "upload_image": f"/localfile/{save_path}".replace("\\","/"),
        "detected": detected_objects,
        "classes": list(detected_classes)
    })

# Top3 추천
@app.route("/top3", methods=["GET"])
def top3():
    cls = request.args.get("class")
    if not cls:
        return jsonify({"error":"class 필요"}),400

    for item in seed_embeddings:
        if item["class"] == cls:
            emb = item["embedding"]
            break
    else:
        return jsonify({"error":"해당 클래스 없음"}),400

    top3_items = find_top3(emb, cls)
    return jsonify({"top3": top3_items})

# AI 챗봇
@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message", "").strip()
    last_step = session.get("last_step", "WAIT_IMAGE")
    detected_classes = session.get("detected_classes", [])

    # 사용자가 감지된 클래스(예: bed, chair, couch)를 채팅창에 입력했다면
    normalized = user_text.lower().replace(" ", "_")

    # 클래스명 매핑 (YOLO → seed 폴더명)
    class_map = {
        "sofa": "couch",
        "couch": "couch",
        "소파": "couch",
        "베드": "bed",
        "침대": "bed",
        "의자": "chair",
        "체어": "chair"
}

    if normalized in class_map:
        normalized = class_map[normalized]


    if normalized in detected_classes:
        # seed 중 첫번째 embedding 가져오기
        target_emb = None
        for item in seed_embeddings:
            if item["class"] == normalized:
                target_emb = item["embedding"]
                break

        if target_emb is None:
            return jsonify({"reply": "해당 클래스의 임베딩을 찾을 수 없습니다."})

        # Top3 가져오기
        top3_items = find_top3(target_emb, normalized)

        return jsonify({
            "reply": f"{normalized} 유사 가구 Top3를 보여드릴게요!",
            "top3": top3_items
        })

    # ===== 기존 AI 응답 =====
    system_prompt = f"""
너는 인테리어 추천 챗봇이야.
현재 상태: {last_step}
감지된 객체 목록: {detected_classes}

규칙:
1) 사용자의 입력을 이해하고 자연스러운 문장으로 답변
2) 감지된 가구 중 선택 안내 가능
3) 새 이미지 업로드 유도 가능
4) 이해 못하면 정중히 다시 요청
"""

    full_prompt = f"{system_prompt}\n\n사용자: {user_text}"

    response = gemini_model.generate_content(full_prompt)
    reply = response.text

    return jsonify({"reply": reply})

@app.route("/list_image/<cls>/<filename>")
def list_image(cls, filename):
    return send_file(os.path.join(SEED_BASE, cls, filename))



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
