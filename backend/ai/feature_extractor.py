import torch
from torchvision import transforms
from PIL import Image
import numpy as np
from .model_loader import load_model

# 모델 로드 (전역 1회)
model = load_model()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def extract_feature(image_path):
    """이미지 → 2048차원 임베딩 벡터 추출"""
    img = Image.open(image_path).convert("RGB")
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        features = model(tensor).squeeze().numpy()
    return features / np.linalg.norm(features)
