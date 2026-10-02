from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CustomUser
from .serializers import UserRegistrationSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,) # Registration koi bhi kar sakta hai
    serializer_class = UserRegistrationSerializer