from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),

    # Profile
    path('create-profile/', views.create_profile, name='create_profile'),
    path('edit-profile/', views.edit_profile, name='edit_profile'),

    # Dashboard
    path('dashboard/', views.dashboard, name='dashboard'),

    # Study Groups
    path('groups/', views.study_groups, name='study_groups'),
    path('groups/create/', views.create_group, name='create_group'),
    path('groups/<int:group_id>/join/', views.join_group, name='join_group'),
   
    

    # Chat & Materials
    path('groups/<int:group_id>/chat/', views.group_chat, name='group_chat'),
    path('groups/<int:group_id>/upload/', views.upload_material, name='upload_material'),
    path('groups/<int:group_id>/join/', views.join_group, name='join_group'),
    path('groups/<int:group_id>/requests/', views.pending_requests, name='pending_requests'),
    path('requests/<int:request_id>/approve/', views.approve_request, name='approve_request'),
    path('requests/<int:request_id>/reject/', views.reject_request, name='reject_request'),

    # Match Finder
    path('match-finder/', views.match_finder, name='match_finder'),
    path('courses/create/', views.create_course, name='create_course'),
    path('groups/<int:group_id>/leave/', views.leave_group, name='leave_group'),
    path('groups/<int:group_id>/members/', views.view_members, name='view_members'),



           path('groups/admin/', views.admin_groups, name='admin_groups'),
path('groups/<int:group_id>/edit/', views.edit_group, name='edit_group'),
path('groups/<int:group_id>/delete/', views.delete_group, name='delete_group'),
path('groups/<int:group_id>/remove-member/<int:user_id>/', views.remove_member, name='remove_member'),


]
