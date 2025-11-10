import torch
import torch.nn as nn
import torchvision.models as models

def load_model():
    """사전 학습된 ResNet50을 feature extractor로 사용"""
    model = models.resnet50(pretrained=True)
    model = nn.Sequential(*list(model.children())[:-1])  # 분류층 제거
    model.eval()
    return model
