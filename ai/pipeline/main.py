import torch
import torchvision.transforms as transforms
from torch.autograd import Variable
import cv2
from model import Net


class ImageClassifier:
    def __init__(self):
        # Class module from AI team
        self.classifiers = Net(num_classes=11)
        # Model path with pth file
        model_path = "ModelAug2.pth"
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

    def predict(self, image):
        count_final = 2
        image = cv2.imread(image, 3)
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
                with open("class.txt", "r") as f:
                    to_label = eval(f.read())
                # Get result final and return it
                result_final = to_label[index]
                lists.append(result_final)
            c = Counter(lists)
            highest_freq = max(c.values())
            mod = [n for n, freq in sorted(c.items()) if freq == highest_freq]
            count_final = len(mod)
        result_final = mod[0]
        return result_final
