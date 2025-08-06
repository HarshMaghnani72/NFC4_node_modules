from django.contrib.auth.models import User
from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField()
    year = models.CharField(max_length=10)
    department = models.CharField(max_length=50)
    subjects = models.ManyToManyField(Course, blank=True)

    def __str__(self):
        return self.user.username

class StudyGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    courses = models.ManyToManyField(Course, blank=True)
    is_public = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups')
    year = models.CharField(max_length=10, blank=True)
    members = models.ManyToManyField(User, related_name='study_groups', blank=True)

    def __str__(self):
        return self.name

class GroupMembership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)  # 🔥 Add this field

    def __str__(self):
        return f"{self.user.username} in {self.group.name}"


class JoinRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class StudyMaterial(models.Model):
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    file = models.FileField(upload_to='materials/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class JoinRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(StudyGroup, on_delete=models.CASCADE)
    requested_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'group')

    def __str__(self):
        return f"{self.user.username} requests to join {self.group.name}"