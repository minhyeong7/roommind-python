import json
import os
from collections import Counter

LOG_PATH = "backend/data/user_logs.json"

def load_user_logs():
    if not os.path.exists(LOG_PATH):
        return {}
    with open(LOG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def save_user_action(user_id, item_id):
    """사용자 행동 로그 저장"""
    logs = load_user_logs()
    logs.setdefault(user_id, []).append(item_id)
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(logs, f, ensure_ascii=False, indent=2)

def recommend_by_behavior(user_id):
    """사용자 기록 기반 추천 (가장 많이 본/좋아한 아이템)"""
    logs = load_user_logs()
    user_items = logs.get(user_id, [])
    if not user_items:
        return []
    freq = Counter(user_items)
    ranked = [item for item, _ in freq.most_common(5)]
    return ranked
