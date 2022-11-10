def imagenet_preprocessing(input_image):
    img = Image.open(input_image)
    normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                     std=[0.229, 0.224, 0.225])
    preprocess = transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            normalize])

    return preprocess(img).numpy()

'''
Must to import this library in AI pipeline(main.py)
import numpy as np
from torchvision import transforms
from PIL import Image
'''