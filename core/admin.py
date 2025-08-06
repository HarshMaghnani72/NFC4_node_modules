from django.contrib import admin
from .models import *

admin.site.register(Course)
admin.site.register(UserProfile)
admin.site.register(StudyGroup)
admin.site.register(GroupMembership)
admin.site.register(JoinRequest)
admin.site.register(ChatMessage)
admin.site.register(StudyMaterial)
