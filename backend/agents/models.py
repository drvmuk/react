from django.db import models

class Agent(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    ICON_CHOICES = [
        ("MagnifyingGlassIcon", "MagnifyingGlassIcon"),
        ("CubeIcon", "CubeIcon"),
        ("DocumentDuplicateIcon", "DocumentDuplicateIcon"),
        ("ArrowDownTrayIcon", "ArrowDownTrayIcon"),
        ("ShieldCheckIcon", "ShieldCheckIcon"),
        ("ArrowsRightLeftIcon", "ArrowsRightLeftIcon"),
        ("DocumentArrowUpIcon", "DocumentArrowUpIcon"),
        ("TableCellsIcon", "TableCellsIcon"),
    ]

    title = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    icon = models.CharField(max_length=50, choices=ICON_CHOICES)

    def __str__(self):
        return f"{self.title} ({self.status})"
