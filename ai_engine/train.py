import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
import time

# Configuration
DATASET_PATH = r"c:\Users\Dell\OneDrive\Desktop\Drone ai crop\ai_engine\archive\Train"
MODEL_SAVE_PATH = r"c:\Users\Dell\OneDrive\Desktop\Drone ai crop\ai_engine\plant_disease_resnet18.onnx"
CLASSES_SAVE_PATH = r"c:\Users\Dell\OneDrive\Desktop\Drone ai crop\ai_engine\classes.txt"
BATCH_SIZE = 32
EPOCHS = 1
LEARNING_RATE = 0.001

def train_model():
    print("🚀 Starting AI Model Training Pipeline...")
    
    # 1. Data Preprocessing
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    dataset = datasets.ImageFolder(DATASET_PATH, transform=transform)
    
    # Use a subset of 400 images for lightning-fast training
    subset_indices = torch.randperm(len(dataset))[:400]
    train_subset = torch.utils.data.Subset(dataset, subset_indices)
    train_loader = DataLoader(train_subset, BATCH_SIZE, shuffle=True)
    
    classes = dataset.classes
    num_classes = len(classes)
    
    # Save classes
    with open(CLASSES_SAVE_PATH, "w") as f:
        for cls in classes:
            f.write(f"{cls}\n")
    print(f"✅ Found {num_classes} classes. Classes saved to {CLASSES_SAVE_PATH}")
    
    # 2. Model Initialization (ResNet-18)
    print("📦 Fetching pre-trained ResNet-18 weights...")
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    
    # Fine-tuning: Replace final layer
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    
    # 3. Training Loop (Condensed)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)
    
    print(f"🔥 Training on {device} for {EPOCHS} epochs...")
    model.train()
    
    for epoch in range(EPOCHS):
        running_loss = 0.0
        start_time = time.time()
        
        for i, (images, labels) in enumerate(train_loader):
            images, labels = images.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            if (i + 1) % 10 == 0:
                print(f"Batch {i + 1}/{len(train_loader)} - Loss: {loss.item():.4f}")
            
        print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {running_loss/len(train_loader):.4f} - Time: {time.time()-start_time:.2f}s")
    
    # 4. Export to ONNX
    print("📤 Exporting model to ONNX format for AMD Ryzen AI...")
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224).to(device)
    
    torch.onnx.export(
        model, 
        dummy_input, 
        MODEL_SAVE_PATH,
        export_params=True,
        opset_version=12,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    
    print(f"✨ Success! AMD AI Model saved to: {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train_model()
