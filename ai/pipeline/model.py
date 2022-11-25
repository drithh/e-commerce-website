import torch.nn as nn

class Net(nn.Module):
      def __init__(self, num_classes=11):
          super(Net, self).__init__()
          self.features   = nn.Sequential(
                                nn.Conv2d(1, 32, kernel_size=3, stride=1, padding='same'), 
                                nn.BatchNorm2d(32),
                                nn.ReLU(inplace=True),
                                nn.MaxPool2d(kernel_size=2, stride=1), 
                                nn.Conv2d(32, 64, kernel_size=3, padding='same'),
                                nn.BatchNorm2d(64),
                                nn.ReLU(inplace=True), 
                                nn.Conv2d(64, 128, kernel_size=3, padding='same'), 
                                nn.BatchNorm2d(128),
                                nn.ReLU(inplace=True),
                                nn.Conv2d(128, 128, kernel_size=3, padding='same'), 
                                nn.BatchNorm2d(128),
                                nn.ReLU(inplace=True),
                                nn.MaxPool2d(kernel_size=2, stride=1),)
          
          self.avgpool    = nn.AdaptiveAvgPool2d((7, 7))

          self.classifier = nn.Sequential(
                                nn.Dropout(0.2), 
                                nn.Linear(128 * 7 * 7, 4096), 
                                nn.ReLU(inplace=True),
                                nn.Linear(4096, 4096), 
                                nn.ReLU(inplace=True), 
                                nn.Linear(4096, num_classes),)
          
      def forward(self, x):
          x = self.features(x)
          x = self.avgpool(x)
          x = x.view(-1, 128*7*7)
          x = self.classifier(x)
          return x