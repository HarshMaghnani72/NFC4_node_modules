import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
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
  Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "../context/AuthContext";

export const Chat = () => {
  const { groupId, memberId } = useParams();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(groupId || memberId || null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [usePolling, setUsePolling] = useState(false);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("http://localhost:8000/group/my-groups", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in");
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch groups: ${response.status} ${response.statusText}`);
        }

        const groups = await response.json();
        const groupConvs = groups.map((group) => ({
          id: group.groupId,
          name: group.name,
          type: "group",
          lastMessage: group.lastMessage || "No messages yet",
          lastTime: group.lastMessageTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: group.unreadCount || 0,
          avatar: "",
          online: true,
          pinned: group.pinned || false,
        }));

        setConversations(groupConvs);
        setLoading(false);
      } catch (err) {
        console.error("Fetch conversations error:", err);
        setError(`Could not load conversations: ${err.message}`);
        setLoading(false);
        toast.error(`Failed to load conversations: ${err.message}`);
      }
    };

    fetchConversations();
  }, []);

  // Check group membership
  useEffect(() => {
    if (!groupId || !user?.userId) {
      setIsMember(memberId ? true : null);
      return;
    }

    const checkMembership = async () => {
      try {
        const response = await fetch(`http://localhost:8000/group/${groupId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch group: ${response.status} ${response.statusText}`);
        }

        const groupData = await response.json();
        const member = groupData.isMember !== undefined
          ? groupData.isMember
          : groupData.members?.some((m) => m._id === user?.userId) || false;
        setIsMember(member);
        if (!member) {
          toast.error("You are not a member of this group.");
        }
      } catch (err) {
        console.error("Membership check error:", err);
        setError(`Could not verify group membership: ${err.message}`);
        setIsMember(false);
      }
    };

    checkMembership();
  }, [groupId, user]);

  // Fetch messages
  useEffect(() => {
    if (!selectedChat || isMember === false) return;

    const fetchMessages = async () => {
      try {
        const endpoint = groupId
          ? `http://localhost:8000/chat/${selectedChat}/messages`
          : `http://localhost:8000/chat/direct/${selectedChat}`;
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        console.error("Fetch messages error:", err);
        setError(`Could not load messages: ${err.message}`);
      }
    };

    fetchMessages();

    // Polling fallback if WebSocket fails
    let pollingInterval;
    if (usePolling) {
      pollingInterval = setInterval(fetchMessages, 5000);
    }

    return () => clearInterval(pollingInterval);
  }, [selectedChat, isMember, groupId, usePolling]);

  // Setup WebSocket with reconnection logic
  const connectWebSocket = () => {
    if (!user?.userId || isMember === false || !conversations.length || reconnectAttempts.current >= maxReconnectAttempts) {
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        setUsePolling(true);
        toast.warning("Switching to polling mode due to WebSocket failure.");
      }
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000?userId=${user.userId}&groups=${conversations
      .filter((conv) => conv.type === "group")
      .map((conv) => conv.id)
      .join(",")}`);
    
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttempts.current = 0;
      setUsePolling(false);
      toast.success("Real-time messaging connected!");
    };

    ws.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "message" && data.groupId === selectedChat) {
          setMessages((prev) => [...prev, data]);
          scrollToBottom();
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket connection failed. Retrying...");
    };

    ws.onclose = (event) => {
      console.log(`WebSocket disconnected: code=${event.code}, reason=${event.reason}`);
      reconnectAttempts.current += 1;
      if (reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(connectWebSocket, 2000 * Math.pow(2, reconnectAttempts.current)); // Exponential backoff
      } else {
        setUsePolling(true);
        toast.warning("Switching to polling mode due to WebSocket failure.");
      }
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [user, conversations, selectedChat, isMember]);

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat || isMember === false) return;

    try {
      const endpoint = groupId
        ? `http://localhost:8000/chat/${selectedChat}/message`
        : `http://localhost:8000/chat/direct/${selectedChat}`;
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      setMessage("");
      scrollToBottom();
      toast.success("Message sent!");
    } catch (err) {
      console.error("Send message error:", err);
      toast.error(`Failed to send message: ${err.message}`);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedChat || isMember === false) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:8000/chat/${selectedChat}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
      }

      const { fileId } = await response.json();
      const messageResponse = await fetch(`http://localhost:8000/chat/${selectedChat}/message`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: file.name, file: fileId }),
      });

      if (!messageResponse.ok) {
        throw new Error(`Failed to send file message: ${messageResponse.status} ${messageResponse.statusText}`);
      }

      scrollToBottom();
      toast.success("File uploaded!");
    } catch (err) {
      console.error("File upload error:", err);
      toast.error(`Failed to upload file: ${err.message}`);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find((conv) => conv.id === selectedChat);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">{error}</p>
          <Button asChild>
            <Link to="/groups">View Groups</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">Please log in to view chats.</p>
          <Button asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (groupId && isMember === false) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">You are not a member of this group.</p>
          <Button asChild>
            <Link to={`/group/${groupId}`}>Back to Group</Link>
          </Button>
        </div>
      </div>
    );
  }

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
                              <Users className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
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
          {selectedConversation ? (
            <>
              <div className="border-b bg-card/50 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>
                        <Users className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {selectedConversation.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.memberCount} members
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

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.senderId === user?.userId ? 'justify-end' : ''}`}>
                      {message.senderId !== user?.userId && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback className="text-xs">
                            {message.sender.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[70%] ${message.senderId === user?.userId ? 'order-first' : ''}`}>
                        {message.senderId !== user?.userId && (
                          <p className="text-xs text-muted-foreground mb-1">{message.sender}</p>
                        )}
                        
                        <div className={`p-3 rounded-lg ${
                          message.senderId === user?.userId 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent'
                        }`}>
                          {message.type === 'file' ? (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <a
                                href={`http://localhost:8000/chat/file/${message.file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline"
                              >
                                {message.content}
                              </a>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      {message.senderId === user?.userId && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t bg-card/50 backdrop-blur-sm p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <label>
                        <Button variant="ghost" size="sm" type="button">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                      </label>
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
                            sendMessage();
                          }
                        }}
                        className="flex-1"
                        disabled={isMember === false}
                      />
                      <Button variant="ghost" size="icon" disabled={isMember === false}>
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button onClick={sendMessage} disabled={isMember === false}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};