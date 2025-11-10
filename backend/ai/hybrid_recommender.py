from .recommender import recommend as image_based
from .user_behavior import recommend_by_behavior

def hybrid_recommend(user_id, image_path):
    """
    하이브리드 추천: 이미지 기반 + 행동 기반
    이미지 기반 70%, 행동 기반 30% 가중치로 단순 병합
    """
    img_results = image_based(image_path)
    user_results = recommend_by_behavior(user_id)

    final = []
    for r in img_results:
        if r not in final:
            final.append(r)
    for r in user_results:
        if r not in final:
            final.append(r)

    return final[:5]
