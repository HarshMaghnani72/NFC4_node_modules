from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
from django.utils import timezone
from .models import Course , JoinRequest
from .forms import CourseForm
from django.db.models import Count

# ───────────── AUTH ─────────────

def signup_view(request):
    if request.method == 'POST':
        form = UserSignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            return redirect('login')
    else:
        form = UserSignupForm()
    return render(request, 'auth/signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if not hasattr(user, 'userprofile'):
                return redirect('create_profile')
            return redirect('dashboard')
    return render(request, 'auth/login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

# ───────────── PROFILE ─────────────

@login_required
def create_profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            form.save_m2m()
            return redirect('dashboard')
    else:
        form = UserProfileForm()
    return render(request, 'profile/create_profile.html', {'form': form})

@login_required
def edit_profile(request):
    profile = request.user.userprofile
    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = UserProfileForm(instance=profile)
    return render(request, 'profile/edit_profile.html', {'form': form})

# ───────────── DASHBOARD ─────────────

@login_required
def dashboard(request):
    user_groups = GroupMembership.objects.filter(user=request.user)
    total_hours = user_groups.count() * 1  # Placeholder: track with entry/exit time later
    profile = request.user.userprofile
    return render(request, 'dashboard.html', {
        'user_groups': user_groups,
        'total_hours': total_hours,
        'profile': profile,
    })

# ───────────── GROUPS ─────────────

@login_required
@login_required
def study_groups(request):
    user_subjects = request.user.userprofile.subjects.all()
    
    # Correct field is 'courses' on StudyGroup
    matching_groups = StudyGroup.objects.filter(courses__in=user_subjects)

    joined_group_ids = GroupMembership.objects.filter(user=request.user).values_list('group_id', flat=True)
    joined_groups = StudyGroup.objects.filter(id__in=joined_group_ids)

    # Combine and remove duplicates
    groups = (matching_groups | joined_groups).distinct()

    return render(request, 'groups/study_groups.html', {
        'groups': groups,
        'joined_group_ids': list(joined_group_ids)
    })


@login_required
def create_group(request):
    if request.method == 'POST':
        form = StudyGroupForm(request.POST)
        if form.is_valid():
            group = form.save(commit=False)
            group.owner = request.user
            group.save()
            form.save_m2m()
            GroupMembership.objects.create(user=request.user, group=group)
            return redirect('study_groups')
    else:
        form = StudyGroupForm()
    return render(request, 'groups/create_group.html', {'form': form})

@login_required
def join_group(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)

    # Prevent joining twice
    if GroupMembership.objects.filter(user=request.user, group=group).exists():
        return redirect('group_chat', group_id=group.id)

    if group.is_public:
        # Public group — auto-approve
        GroupMembership.objects.create(user=request.user, group=group, is_approved=True)
        return redirect('group_chat', group_id=group.id)
    else:
        # Private group — send join request
        GroupMembership.objects.create(user=request.user, group=group, is_approved=False)
        return redirect('dashboard')  # Or show a message like "Request sent"




@login_required
def manage_requests(request):
    requests = JoinRequest.objects.filter(group__owner=request.user, status='pending')
    return render(request, 'groups/manage_requests.html', {'requests': requests})

@login_required
def handle_request(request, req_id, action):
    join_request = get_object_or_404(JoinRequest, id=req_id)
    if join_request.group.owner != request.user:
        return redirect('dashboard')
    if action == 'accept':
        join_request.status = 'accepted'
        GroupMembership.objects.get_or_create(user=join_request.user, group=join_request.group)
    else:
        join_request.status = 'rejected'
    join_request.save()
    return redirect('manage_requests')

# ───────────── CHAT ─────────────

@login_required
def group_chat(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)

    # ✅ FIX: Allow group owner to access the chat without needing membership
    if request.user != group.owner and not GroupMembership.objects.filter(user=request.user, group=group).exists():
        return redirect('dashboard')

    messages = ChatMessage.objects.filter(group=group).order_by('timestamp')

    if request.method == 'POST':
        msg_form = ChatMessageForm(request.POST)
        if msg_form.is_valid():
            msg = msg_form.save(commit=False)
            msg.group = group
            msg.sender = request.user
            msg.save()
            return redirect('group_chat', group_id=group_id)
    else:
        msg_form = ChatMessageForm()

    file_form = StudyMaterialForm()
    materials = StudyMaterial.objects.filter(group=group)

    return render(request, 'groups/group_chat.html', {
        'group': group,
        'messages': messages,
        'msg_form': msg_form,
        'file_form': file_form,
        'materials': materials,
    })


@login_required
def upload_material(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)
    if request.method == 'POST':
        form = StudyMaterialForm(request.POST, request.FILES)
        if form.is_valid():
            mat = form.save(commit=False)
            mat.group = group
            mat.uploaded_by = request.user
            mat.save()
    return redirect('group_chat', group_id=group_id)

# ───────────── MATCH FINDER ─────────────

@login_required

def match_finder(request):
    groups = StudyGroup.objects.all()
    subjects = Course.objects.all()

    # FETCH years from StudyGroup model (distinct)
    years = StudyGroup.objects.values_list('year', flat=True).distinct()

    selected_year = request.GET.get('year')
    selected_subjects = request.GET.getlist('subjects')
    match_percent = int(request.GET.get('match', 0))

    if selected_year:
        groups = groups.filter(year=selected_year)

    if selected_subjects:
        groups = groups.annotate(
            match_count=Count('courses', filter=models.Q(courses__in=selected_subjects))
        ).filter(match_count__gte=len(selected_subjects) * (match_percent / 100))

    return render(request, 'match/match_finder.html', {
        'groups': groups.distinct(),
        'subjects': subjects,
        'years': years,
        'selected_year': selected_year,
        'selected_subjects': [int(s) for s in selected_subjects],
        'match_percent': match_percent,
    })



def create_course(request):
    if request.method == 'POST':
        form = CourseForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('study_groups')  # or wherever you want to redirect after creation
    else:
        form = CourseForm()
    return render(request, 'courses/create_course.html', {'form': form})



@login_required
def join_group(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)
    user = request.user

    # Check if user is already a member
    if GroupMembership.objects.filter(user=user, group=group).exists():
        return redirect('group_chat', group_id=group.id)

    if group.is_public:
        # Directly add user as member for public groups
        GroupMembership.objects.create(user=user, group=group)
        return redirect('group_chat', group_id=group.id)
    else:
        # For private groups, create a join request if not exists
        join_request, created = JoinRequest.objects.get_or_create(user=user, group=group)
        return redirect('dashboard')  # or wherever you want to redirect after request

@login_required
def pending_requests(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)

    # Only group creator can see requests
    if request.user != group.owner:
        return redirect('dashboard')

    requests = JoinRequest.objects.filter(group=group, approved=False)

    return render(request, 'groups/pending_requests.html', {
        'group': group,
        'requests': requests,
    })

@login_required
def approve_request(request, request_id):
    join_request = get_object_or_404(JoinRequest, id=request_id)
    group = join_request.group

    if request.user != group.owner:
        return redirect('dashboard')

    # Approve: add member & mark request approved
    GroupMembership.objects.create(user=join_request.user, group=group)
    join_request.approved = True
    join_request.save()

    return redirect('pending_requests', group_id=group.id)

@login_required
def reject_request(request, request_id):
    join_request = get_object_or_404(JoinRequest, id=request_id)
    group = join_request.group

    if request.user != group.owner:
        return redirect('dashboard')

    join_request.delete()
    return redirect('pending_requests', group_id=group.id)

def leave_group(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)
    membership = GroupMembership.objects.filter(user=request.user, group=group)
    if membership.exists():
        membership.delete()
    return redirect('dashboard')

@login_required
def view_members(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id)
    members = group.members.all()
    return render(request, 'groups/group_chat.html', {
        'group': group,
        'members': members
    })





@login_required
def admin_groups(request):
    groups = StudyGroup.objects.filter(owner=request.user)
    return render(request, 'groups/admin_groups.html', {'groups': groups})

@login_required
def edit_group(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id, owner=request.user)
    if request.method == 'POST':
        form = StudyGroupForm(request.POST, instance=group)
        if form.is_valid():
            form.save()
            return redirect('admin_groups')
    else:
        form = StudyGroupForm(instance=group)
    return render(request, 'groups/edit_group.html', {'form': form, 'group': group})

@login_required
def delete_group(request, group_id):
    group = get_object_or_404(StudyGroup, id=group_id, owner=request.user)
    if request.method == 'POST':
        group.delete()
        return redirect('admin_groups')
    return render(request, 'groups/confirm_delete.html', {'group': group})

@login_required
def remove_member(request, group_id, user_id):
    group = get_object_or_404(StudyGroup, id=group_id, owner=request.user)
    user = get_object_or_404(User, id=user_id)
    GroupMembership.objects.filter(group=group, user=user).delete()
    return redirect('admin_groups')