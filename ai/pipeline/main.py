import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms

class ImageClassifier:
    def __init__(self):        
        self.classifier = Classifier()
        model_path = MODEL_PATH               
        self.classifier.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))

    def predict(self, image): 
        # Preprocessing image      
        normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                         std=[0.229, 0.224, 0.225])
        preprocess = transforms.Compose([transforms.RandomResizedCrop(224),
                                         transforms.RandomHorizontalFlip(),
                                         transforms.ToTensor(),
                                         normalize])
        image = preprocess(image) 
        image = image.unsqueeze(0)
        # Predict image from classifier
        preds = F.softmax(self.classifier(image), dim=1)
        # Get a results with tensor value
        results = torch.topk(preds.cpu().data, k=3, dim=1)
        # Get tensor classes and convert it to list 
        classes = results[1][0]
        classes = classes.tolist()
        # Get tensor values and convert it to list
        value = results[0][0]
        v = value.tolist()
        # To dictionary
        res = {classes[i]: v[i] for i in range(len(classes))}
        # Get key of max value from dictionary
        max_value = max(res, key = res.get)
        # Open class txt for know what the predicted value from the model
        with open('class.txt', 'r') as f:
          to_label = eval(f.read())
        # Get result final and return it
        result_final = to_label[max_value]
        return result_final