from django import forms
from django.contrib.auth.models import User
from .models import UserProfile, StudyGroup, Course, ChatMessage, StudyMaterial

class UserSignupForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'})
    )
    username = forms.CharField(
        widget=forms.TextInput(attrs={'placeholder': 'Username'})
    )

    class Meta:
        model = User
        fields = ['username', 'password']

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['bio', 'year', 'department', 'subjects']
        widgets = {
            'subjects': forms.CheckboxSelectMultiple,  # Enables multi-select with checkboxes
        }


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['name']

class StudyGroupForm(forms.ModelForm):
    class Meta:
        model = StudyGroup
        fields = ['name', 'description', 'courses', 'is_public', 'year']
        widgets = {
            'courses': forms.CheckboxSelectMultiple()
        }

class ChatMessageForm(forms.ModelForm):
    class Meta:
        model = ChatMessage
        fields = ['message']

class StudyMaterialForm(forms.ModelForm):
    class Meta:
        model = StudyMaterial
        fields = ['file']
from django import forms
from .models import Course

class CreateCourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['name']
