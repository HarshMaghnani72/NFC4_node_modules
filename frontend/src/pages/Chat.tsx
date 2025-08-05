import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Search, 
  Paperclip, 
  Smile, 
  Users, 
  Bell,
  Calendar,
  FileText,
  Image,
  MoreVertical,
  Pin,
  Star
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Advanced Calculus Masters",
      type: "group",
      lastMessage: "Thanks for sharing those practice problems!",
      lastTime: "2:45 PM",
      unread: 3,
      avatar: "",
      online: true,
      pinned: true
    },
    {
      id: 2,
      name: "Alex Chen",
      type: "direct",
      lastMessage: "Can you help me with the integration by parts problem?",
      lastTime: "1:30 PM",
      unread: 1,
      avatar: "",
      online: true,
      pinned: false
    },
    {
      id: 3,
      name: "Quantum Physics Explorers",
      type: "group",
      lastMessage: "Meeting scheduled for tomorrow at 10 AM",
      lastTime: "12:15 PM",
      unread: 0,
      avatar: "",
      online: false,
      pinned: false
    },
    {
      id: 4,
      name: "Sarah Johnson",
      type: "direct",
      lastMessage: "Great study session today!",
      lastTime: "11:45 AM",
      unread: 0,
      avatar: "",
      online: false,
      pinned: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Alex Chen",
      content: "Hey everyone! I just uploaded the practice problems for Chapter 12.",
      time: "2:30 PM",
      type: "text",
      avatar: ""
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      content: "Perfect timing! I was just looking for more practice questions.",
      time: "2:31 PM",
      type: "text",
      avatar: ""
    },
    {
      id: 3,
      sender: "You",
      content: "Thanks Alex! These look really challenging. Should we tackle them together in our next session?",
      time: "2:32 PM",
      type: "text",
      avatar: ""
    },
    {
      id: 4,
      sender: "Mike Rodriguez",
      content: "Definitely! I'm free tomorrow at 3 PM. How about everyone else?",
      time: "2:33 PM",
      type: "text",
      avatar: ""
    },
    {
      id: 5,
      sender: "Alex Chen",
      content: "calculus_practice_ch12.pdf",
      time: "2:34 PM",
      type: "file",
      avatar: ""
    },
    {
      id: 6,
      sender: "Sarah Johnson",
      content: "I can make it at 3 PM tomorrow. Looking forward to it!",
      time: "2:45 PM",
      type: "text",
      avatar: ""
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "reminder",
      title: "Study Session Reminder",
      message: "Advanced Calculus Masters - Starting in 30 minutes",
      time: "3:00 PM Today"
    },
    {
      id: 2,
      type: "message",
      title: "New Message from Alex Chen",
      message: "Can you help me with the integration by parts problem?",
      time: "1:30 PM"
    },
    {
      id: 3,
      type: "schedule",
      title: "Session Scheduled",
      message: "Quantum Physics Explorers - Tomorrow at 10:00 AM",
      time: "12:15 PM"
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card/30 flex flex-col">
          <Tabs defaultValue="chats" className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chats">Chats</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chats" className="flex-1 flex flex-col mt-0">
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <ScrollArea className="flex-1">
                <div className="space-y-1 px-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedChat === conversation.id ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedChat(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>
                              {conversation.type === 'group' ? (
                                <Users className="w-5 h-5" />
                              ) : (
                                conversation.name.split(' ').map(n => n[0]).join('')
                              )}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && conversation.type === 'direct' && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground truncate">
                                {conversation.name}
                              </h4>
                              {conversation.pinned && (
                                <Pin className="w-3 h-3 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                {conversation.lastTime}
                              </span>
                              {conversation.unread > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notifications" className="flex-1 mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation && (
            <>
              {/* Chat Header */}
              <div className="border-b bg-card/50 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>
                        {selectedConversation.type === 'group' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          selectedConversation.name.split(' ').map(n => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {selectedConversation.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.type === 'group' ? 
                          '4 members • 3 online' : 
                          selectedConversation.online ? 'Online' : 'Last seen 2h ago'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.sender === 'You' ? 'justify-end' : ''}`}>
                      {message.sender !== 'You' && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="text-xs">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[70%] ${message.sender === 'You' ? 'order-first' : ''}`}>
                        {message.sender !== 'You' && (
                          <p className="text-xs text-muted-foreground mb-1">{message.sender}</p>
                        )}
                        
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'You' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent'
                        }`}>
                          {message.type === 'file' ? (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">{message.content}</span>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.time}
                        </p>
                      </div>
                      
                      {message.sender === 'You' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t bg-card/50 backdrop-blur-sm p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            setMessage("");
                          }
                        }}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => setMessage("")}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};