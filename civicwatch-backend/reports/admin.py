from django.contrib import admin
from .models import Report, Capture, Challan

admin.site.register(Report)
admin.site.register(Capture)
admin.site.register(Challan)