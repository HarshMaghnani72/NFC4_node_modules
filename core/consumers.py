import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage, Group
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f'chat_{self.group_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope["user"]

        # 🔽 Save the message to database ✅
        await self.save_message(user, message)

        # 🔽 Broadcast message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': user.username
            }
        )

    async def chat_message(self, event):
        # 🔽 Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username']
        }))

    @sync_to_async
    def save_message(self, user, message):
        group = Group.objects.get(id=self.group_id)
        ChatMessage.objects.create(sender=user, group=group, message=message)
