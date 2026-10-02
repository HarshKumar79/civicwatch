from rest_framework import viewsets, permissions
from .models import Report, Capture
from .serializers import ReportSerializer, CaptureSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by('-created_at')
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated] # Sirf logged-in users ke liye

    # Jab naya report create ho, toh logged-in user ko as 'reporter' assign karein
    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

class CaptureViewSet(viewsets.ModelViewSet):
    queryset = Capture.objects.all().order_by('capture_sequence')
    serializer_class = CaptureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Frontend se report_id URL param ya payload mein aayega
        report_id = self.request.data.get('report')
        report = Report.objects.get(id=report_id)
        serializer.save(report=report)