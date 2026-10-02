from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, CaptureViewSet

router = DefaultRouter()
router.register(r'incidents', ReportViewSet, basename='report')
router.register(r'captures', CaptureViewSet, basename='capture')

urlpatterns = [
    path('', include(router.urls)),
]