from rest_framework import serializers
from .models import Report, Capture, Challan

class CaptureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capture
        fields = '__all__'
        read_only_fields = ['report']

class ChallanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challan
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    # Reverse relationships (related_name) se nested data fetch karna
    captures = CaptureSerializer(many=True, read_only=True)
    challan = ChallanSerializer(read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'reporter', 'assigned_officer', 'category', 'status', 
            'latitude', 'longitude', 'street_address', 'created_at', 
            'updated_at', 'captures', 'challan'
        ]
        # Reporter API request se automatically set hoga, isliye read-only
        read_only_fields = ['reporter', 'status', 'assigned_officer']