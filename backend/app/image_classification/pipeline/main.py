import os
from collections import Counter

import cv2
import numpy as np
import torch
import torchvision.transforms as transforms
from fastapi import HTTPException
from PIL import Image
from torch.autograd import Variable

from app.image_classification.pipeline.model import Net

CURRENT_PATH = os.path.dirname(os.path.abspath(__file__))
PRODUCT_CATEGORY = {
    0: "t-shirts",
    1: "trousers",
    2: "hats",
    3: "pullovers",
    4: "dresses",
    5: "coats",
    6: "sandals",
    7: "shirts",
    8: "sneakers",
    9: "bags",
    10: "ankle-boots",
}


class ImageClassifier:
    def __init__(self):
        # Class module from AI team
        self.classifiers = Net(num_classes=11)
        # Model path with pth file
        model_path = f"{CURRENT_PATH}/model.pth"
        self.classifiers.load_state_dict(
            torch.load(model_path, map_location=torch.device("cpu"))
        )

    def preprocessing(self, image):
        transform = transforms.Compose(
            [
                transforms.Resize((128, 128)),
                transforms.RandomHorizontalFlip(),
                transforms.ToTensor(),
                transforms.Normalize(
                    [
                        0.5,
                    ],
                    [
                        0.5,
                    ],
                ),
                transforms.Grayscale(1),
            ]
        )
        image = transform(image).float()
        return image

    def threshold(self, image):
        img = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        _, th1 = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)
        img = cv2.cvtColor(th1, cv2.COLOR_GRAY2RGB)
        return img

    def edges(self, image):
        edges = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(edges, 100, 200)
        edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2RGB)
        return edges

    def augmentation(self, image):
        list_image = []
        list_image.extend(
            (
                cv2.rotate(image, cv2.ROTATE_180),
                cv2.flip(image, 1),
                cv2.flip(image, 0),
                cv2.flip(image, -1),
                self.threshold(image),
                self.edges(image),
            )
        )
        return list_image

    def read_byte(self, byte_image):
        image = cv2.imdecode(np.frombuffer(byte_image, np.uint8), 3)
        return image

    def predict(self, byte_image):
        count_final = 2
        try:
            image = self.read_byte(byte_image)
            list_image = self.augmentation(image)
            list_image.append(image)

            while count_final > 1:
                lists = []
                for i in range(len(list_image)):
                    image = Image.fromarray(list_image[i])
                    image_tensor = self.preprocessing(image).float()
                    image_tensor = image_tensor.unsqueeze_(0)
                    image = Variable(image_tensor)
                    # Predict image from classifier
                    output = self.classifiers(image)
                    self.classifiers.eval()
                    index = output.data.numpy().argmax()

                    # Get result final and return it
                    result_final = PRODUCT_CATEGORY[index]
                    lists.append(result_final)
                c = Counter(lists)
                highest_freq = max(c.values())
                mod = [n for n, freq in sorted(c.items()) if freq == highest_freq]
                count_final = len(mod)
            result_final = mod[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        return result_final
