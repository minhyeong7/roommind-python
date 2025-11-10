import os
import numpy as np
from .feature_extractor import extract_feature

DATA_DIR = "backend/data/images"
EMB_PATH = "backend/data/embeddings.npy"

def build_embedding_index():
    """모든 이미지 임베딩을 미리 계산하고 저장"""
    embeddings = []
    paths = []
    for fname in os.listdir(DATA_DIR):
        path = os.path.join(DATA_DIR, fname)
        if fname.lower().endswith((".jpg", ".png", ".jpeg")):
            emb = extract_feature(path)
            embeddings.append(emb)
            paths.append(fname)
    np.save(EMB_PATH, {"paths": paths, "embeddings": embeddings})
    print(f" Embedding index built with {len(paths)} images.")

def recommend(image_path):
    """입력 이미지 기반으로 유사 이미지 추천"""
    query_vec = extract_feature(image_path)
    data = np.load(EMB_PATH, allow_pickle=True).item()
    paths, embeddings = data["paths"], np.array(data["embeddings"])
    sims = embeddings @ query_vec  # cosine similarity
    top_idx = np.argsort(-sims)[:5]
    return [paths[i] for i in top_idx]
