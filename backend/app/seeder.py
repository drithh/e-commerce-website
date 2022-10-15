from faker import Faker
from models.user import User

fake = Faker()
for _ in range(100):
    user = User.seed(fake)
    print(user.name)
