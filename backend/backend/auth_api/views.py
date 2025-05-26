from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import UserPreferences
from .serializers import UserPreferencesSerializer

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key,
            "message": "User registered successfully",
            
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
       
        try:
           
            user = User.objects.filter(email=serializer.validated_data['email']).first()
            if user and user.check_password(serializer.validated_data['password']):
                token, created = Token.objects.get_or_create(user=user)
                preferences, created = UserPreferences.objects.get_or_create(user=user)
                return Response({
                    "user": UserSerializer(user).data,
                    "token": token.key,
                    "message": "Login successful",
                    "preferences": UserPreferencesSerializer(preferences).data
                })
            else:
                return Response({
                    "message": "Invalid email or password"
                }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({
                "message": "Invalid email or password"
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
    
        request.user.auth_token.delete()
        return Response({
            "message": "Logged out successfully"
        }, status=status.HTTP_200_OK)

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=True)  # Changed from username to email
#     password = serializers.CharField(required=True, write_only=True)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

class UserPreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preferences, _ = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(preferences)
        return Response(serializer.data)

    def put(self, request):
        print("here1")
        preferences, _ = UserPreferences.objects.get_or_create(user=request.user)
        serializer = UserPreferencesSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            print("here2")
            serializer.save()
            print(serializer.data)
            return Response(serializer.data)
        print("here3")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

