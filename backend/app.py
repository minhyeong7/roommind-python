import os
import uuid
import torch
import clip
from PIL import Image
from flask import Flask, request, jsonify, render_template, send_file, session
from ultralytics import YOLO
from google.generativeai import GenerativeModel, configure
from dotenv import load_dotenv

# 🔥 CORS 추가
from flask_cors import CORS

# ===================== .env 로드 =====================
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# ===================== 경로 =====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
SEED_BASE = os.path.join(BASE_DIR, "list_image")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ===================== Gemini 설정 =====================
if not GOOGLE_API_KEY:
    raise ValueError(" GOOGLE_API_KEY가 .env 에 없습니다!")

configure(api_key=GOOGLE_API_KEY)
gemini_model = GenerativeModel("gemini-2.5-flash")

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

                seed_embeddings.append(
                    {
                        "class": class_name,
                        "filename": file,
                        "path": full_path,
                        "relative_url": f"/list_image/{class_name}/{file}".replace("\\", "/"),
                        "embedding": emb,
                    }
                )
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

        sims.append(
            {
                "filename": item["filename"],
                "similarity": sim,
                "url": item["relative_url"],
            }
        )

    sims = sorted(sims, key=lambda x: x["similarity"], reverse=True)
    return sims[:3]


# ===================== Flask 앱 =====================
app = Flask(__name__)
app.secret_key = "abcd1234"

# 🔥🔥 CORS 설정 (React 3000 허용)
CORS(
    app,
    supports_credentials=True,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ]
        }
    },
)

# ===================== 클래스 매핑 =====================
class_map = {
    "bed": "bed",
    "chair": "chair",
    "couch": "couch",
    "dining table": "dining_table",
    "dining_table": "dining_table",
    "tv": "tv",
    "microwave": "microwave",
    "microwave": "range",
    "refrigerator": "refrigerator",
    "fridge": "refrigerator",
    "refrigerator": "fridge",
    "sofa": "couch",
    "sofa chair": "couch",
    "ibul": "bed",
    "blanket": "bed",
    "drawer": "bed",
    "cabinet": "bed",
    "table": "dining_table",
    "stand": "dining_table",
    "tree": "potted plant",
    "전자레인지": "range",
    "전자레인지": "microwave",
    "침대": "bed",
    "이불": "bed",
    "담요": "bed",
    "의자": "chair",
    "체어": "chair",
    "소파": "couch",
    "쇼파": "couch",
    "식탁": "dining_table",
    "테이블": "dining_table",
    "냉장고": "refrigerator",
    "냉장고": "fridge",
    "티비": "tv",
    "스탠드": "dining_table",
    "화분": "potted plant",
    "나무": "potted plant",
    "트리": "potted plant",
}

# 내부 클래스명 → 한글 표시
class_display = {
    "bed": "침대",
    "chair": "의자",
    "couch": "소파",
    "dining_table": "식탁",
    "tv": "티비",
    "potted_plant": "화분",
    "refrigerator": "냉장고",
    "microwave": "전자레인지",
    "fridge": "냉장고",
    "range": "전자레인지",
}

# ===================== 라우트 =====================


@app.route("/")
def index():
    return jsonify({"message": "Flask API Server is running"})

# ✅ React에서 쓸 health 체크
@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/localfile/<path:filepath>")
def localfile(filepath):
    return send_file(filepath)


@app.route("/list_image/<cls>/<filename>")
def list_image(cls, filename):
    return send_file(os.path.join(SEED_BASE, cls, filename))


# ===================== 이미지 감지 =====================
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

        detected_objects.append(
            {
                "id": f"{cls_name}_{class_counter[cls_name]}",
                "class": cls_name,
                "bbox": [int(x) for x in box.xyxy.tolist()[0]],
            }
        )

    # YOLO 감지명 → class_map 적용
    normalized_detected = []
    for cls in detected_classes:
        key = cls.lower().replace(" ", "_")
        normalized_detected.append(class_map.get(key, key))

    session["detected_classes"] = normalized_detected
    session["last_step"] = "AFTER_DETECT"

    # 감지 클래스 한글 표시
    detected_display = [class_display.get(cls, cls) for cls in normalized_detected]

    return jsonify(
        {
            "upload_image": f"/localfile/{save_path}".replace("\\", "/"),
            "detected": detected_objects,
            "classes": normalized_detected,
            "classes_display": detected_display,
        }
    )


# ===================== 챗봇 =====================
@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message", "").strip()
    detected_classes = session.get("detected_classes", [])
    last_step = session.get("last_step", "WAIT_IMAGE")

    # ===========================
    # 클래스 매핑 처리
    # ===========================
    key = user_text.lower().replace(" ", "_")
    normalized = class_map.get(key, key)

    # ===========================
    # 추천 아이템 추출
    # ===========================
    top3_items = []
    if normalized in detected_classes:
        target_emb = None
        for item in seed_embeddings:
            if item["class"] == normalized:
                target_emb = item["embedding"]
                break

        if target_emb is not None:
            top3_items = find_top3(target_emb, normalized)
            for item in top3_items:
                item["display_name"] = class_display.get(normalized, normalized)

    # ===========================
    # SYSTEM PROMPT 구성
    # ===========================
    system_prompt = """
너는 인테리어 가구 추천 챗봇이다.

규칙:
1. 사용자가 넣은 이미지에서 나온 가구를 알려주기.
2. 반드시 다음 중 하나의 질문을 이어서 하라:
   - '이 추천이 마음에 드시나요?'
   - '다른 제품도 추천해드릴까요?'
   - '비슷한 스타일도 보여드릴까요?'
3. 추천 후에 질문 없이 대화를 끝내는 형태로 답변하지 말 것. 단, 3문장을 넘기지 말 것.
"""

    # top3 추천이 있을 경우 → AI에게 전달
    recommendations_text = ""
    if top3_items:
        recommendations_text += "\n추천할 가구 이미지 목록:\n"
        for idx, item in enumerate(top3_items, 1):
            recommendations_text += f"- {idx}. {item['display_name']} (파일: {item['filename']})\n"

    # ===========================
    # AI 프롬프트 생성
    # ===========================
    prompt = f"""
{system_prompt}

사용자 입력: {user_text}

{recommendations_text}
"""

    # ===========================
    # Gemini 호출
    # ===========================
    response = gemini_model.generate_content(prompt)
    reply = response.text

    # ===========================
    # JSON 응답
    # ===========================
    result = {"reply": reply}
    if top3_items:
        result["top3"] = top3_items

    return jsonify(result)


# ===================== 앱 실행 =====================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
