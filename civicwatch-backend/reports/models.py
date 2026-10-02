from django.db import models
from django.conf import settings
from decimal import Decimal

class Report(models.Model):
    CATEGORY_CHOICES = (
        ('parking', 'No-Parking Violation'),
        ('air_pollution', 'Air Pollution'),
        ('water_pollution', 'Water Pollution'),
        ('land_dumping', 'Land / Dumping'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Awaiting Confirmation'),
        ('unassigned', 'Unassigned'),
        ('accepted', 'Accepted by Officer'),
        ('dispatched', 'Officer En Route'),
        ('resolved', 'Resolved / Challan Issued'),
        ('rejected', 'Rejected / Invalid'),
    )

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submitted_reports')
    assigned_officer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Geolocation mapping
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_category_display()} at {self.street_address} - {self.status}"

class Capture(models.Model):
    """
    Parking violation mein 2 captures (10 min gap) aur pollution mein live video.
    Isliye media ko ek alag table mein rakha gaya hai.
    """
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='captures')
    media_file = models.FileField(upload_to='evidence_media/')
    capture_sequence = models.IntegerField(default=1, help_text="1 for first photo, 2 for 10-min confirmation")
    detected_plate = models.CharField(max_length=20, blank=True, null=True) # AI Plate recognition field
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Capture {self.capture_sequence} for Report #{self.report.id}"

class Challan(models.Model):
    VEHICLE_CHOICES = (
        ('two_wheeler', 'Two-wheeler - ₹500'),
        ('car_suv', 'Car / SUV - ₹1,000'),
        ('commercial', 'Truck / Commercial - ₹2,000'),
    )

    report = models.OneToOneField(Report, on_delete=models.CASCADE, related_name='challan')
    vehicle_class = models.CharField(max_length=20, choices=VEHICLE_CHOICES)
    fine_amount = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Reward tracking
    reporter_reward = models.DecimalField(max_digits=8, decimal_places=2, help_text="15% of fine amount")
    officer_reward = models.DecimalField(max_digits=8, decimal_places=2, help_text="15% of fine amount")
    
    is_paid = models.BooleanField(default=False)
    issued_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Automatically calculate 15% reward splits before saving
        if self.fine_amount:
            self.reporter_reward = float(self.fine_amount) * Decimal(0.15)
            self.officer_reward = float(self.fine_amount) * Decimal(0.15)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Challan for {self.report.street_address} - ₹{self.fine_amount}"