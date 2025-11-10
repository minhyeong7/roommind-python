from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from ai.recommender import build_embedding_index
from ai.hybrid_recommender import hybrid_recommend
from ai.user_behavior import save_user_action

app = Flask(__name__)
CORS(app)

# 초기 임베딩 캐시 없으면 생성
if not os.path.exists("backend/data/embeddings.npy"):
    build_embedding_index()

@app.route("/recommend", methods=["POST"])
def recommend_route():
    user_id = request.form.get("user_id", "guest")
    image = request.files["image"]

    temp_path = "backend/temp_input.jpg"
    image.save(temp_path)

    results = hybrid_recommend(user_id, temp_path)
    if results:
        save_user_action(user_id, results[0])  # 첫 추천 결과를 기록
    return jsonify({"recommendations": results})

if __name__ == "__main__":
    app.run(debug=True)
