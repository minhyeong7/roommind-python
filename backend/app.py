import os
import uuid
import torch
import clip
from PIL import Image
from flask import Flask, request, jsonify, render_template, send_file, session
from ultralytics import YOLO
from google.generativeai import GenerativeModel, configure

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

# ===================== Seed 임베딩 =====================
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
                    "relative_url": f"/list_image/{class_name}/{file}".replace("\\", "/"),
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
            "url": item["relative_url"]
        })

    return sorted(sims, key=lambda x: x["similarity"], reverse=True)[:3]


# ===================== Flask + CORS =====================
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.secret_key = "abcd1234"

# ★★★ 전역 CORS (React 3000 허용 + 쿠키 전송 허용) ★★★
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)


# ===================== Gemini 설정 =====================
configure(api_key=os.getenv("GOOGLE_API_KEY"))
gemini_model = GenerativeModel("models/gemini-2.5-flash")


# ===================== 라우트 =====================
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/localfile/<path:filepath>")
def localfile(filepath):
    return send_file(filepath)


# ===================== 이미지 감지 =====================
@app.route("/detect", methods=["POST"])
@cross_origin(origin="http://localhost:3000", supports_credentials=True)
def detect():
    if "image" not in request.files:
        return jsonify({"error": "이미지가 필요합니다."}), 400

    file = request.files["image"]
    img_id = f"{uuid.uuid4()}.jpg"
    save_path = os.path.join(UPLOAD_DIR, img_id)
    file.save(save_path)

    results = yolo_model(save_path)[0]
    results.save(filename=os.path.join(OUTPUT_DIR, img_id))

    class_counter = {}
    detected_objects = []
    detected_classes = set()

    for box in results.boxes:
        cls_id = int(box.cls.item())
        cls_name = results.names[cls_id]

        detected_classes.add(cls_name)
        class_counter[cls_name] = class_counter.get(cls_name, 0) + 1

        detected_objects.append({
            "id": f"{cls_name}_{class_counter[cls_name]}",
            "class": cls_name,
            "bbox": [int(x) for x in box.xyxy.tolist()[0]]
        })

    session["detected_classes"] = list(detected_classes)
    session["last_step"] = "AFTER_DETECT"

    return jsonify({
        "upload_image": f"/localfile/{save_path}".replace("\\", "/"),
        "detected": detected_objects,
        "classes": list(detected_classes)
    })


# ===================== Top3 =====================
@app.route("/top3", methods=["GET"])
@cross_origin(origin="http://localhost:3000", supports_credentials=True)
def top3():
    cls = request.args.get("class")
    if not cls:
        return jsonify({"error": "class 필요"}), 400

    target_emb = None
    for item in seed_embeddings:
        if item["class"] == cls:
            target_emb = item["embedding"]
            break

    if target_emb is None:
        return jsonify({"error": "해당 클래스 없음"}), 400

    return jsonify({"top3": find_top3(target_emb, cls)})


# ===================== 챗봇 =====================
@app.route("/chat", methods=["POST"])
@cross_origin(origin="http://localhost:3000", supports_credentials=True)
def chat():
    user_text = request.json.get("message", "").strip()
    last_step = session.get("last_step", "WAIT_IMAGE")
    detected_classes = session.get("detected_classes", [])

    normalized = user_text.lower().replace(" ", "_")

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
        target_emb = next((i["embedding"] for i in seed_embeddings if i["class"] == normalized), None)

        if target_emb is None:
            return jsonify({"reply": "임베딩을 찾을 수 없습니다."})

        return jsonify({
            "reply": f"{normalized} 유사 가구 Top3입니다!",
            "top3": find_top3(target_emb, normalized)
        })

    system_prompt = f"""
너는 인테리어 추천 챗봇이야.
현재 상태: {last_step}
감지된 객체: {detected_classes}
"""

    response = gemini_model.generate_content(f"{system_prompt}\n사용자: {user_text}")
    return jsonify({"reply": response.text})


@app.route("/list_image/<cls>/<filename>")
def list_image(cls, filename):
    return send_file(os.path.join(SEED_BASE, cls, filename))


# ===================== 실행 =====================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
