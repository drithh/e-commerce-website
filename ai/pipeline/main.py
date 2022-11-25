import torch
import torchvision.transforms as transforms
from torch.autograd import Variable
import cv2
from model import Net

class ImageClassifier:
    def __init__(self):
        # Class module from model.py        
        self.classifier = Net()
        # Model path with pth file
        model_path = 'ModelAug.pth'               
        self.classifier.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))

    def preprocessing(self, image):
      transform =transforms.Compose([transforms.Resize((128,128)),
                                     transforms.RandomHorizontalFlip(),
                                     transforms.ToTensor(), 
                                     transforms.Normalize([0.5,], [0.5,]),
                                     transforms.Grayscale(1)
                                    ])
      
      image = transform(image).float()
      return image

    def predict(self, image):
        # Preprocessing image
        image = cv2.imread(image, 3)
        image = Image.fromarray(image)
        image_tensor = self.preprocessing(image).float()
        image_tensor = image_tensor.unsqueeze_(0)
        image = Variable(image_tensor)    
        # Predict image from classifier
        output = self.classifier(image)
        index = output.data.numpy().argmax()
        with open('class.txt', 'r') as f:
          to_label = eval(f.read())
        # Get result final and return it
        result_final = to_label[index]
        # Will return string value
        return result_final
