import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Conversation {
  id: number;
  name: string;
  isGroup: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  type: "text";
}

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allMessages, setAllMessages] = useState<Record<number, Message[]>>({});
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chat_messages");
    const storedConversations = localStorage.getItem("chat_conversations");

    if (storedMessages && storedConversations) {
      setAllMessages(JSON.parse(storedMessages));
      setConversations(JSON.parse(storedConversations));
    } else {
      const initialConversations: Conversation[] = [
        {
          id: 1,
          name: "Study Group",
          isGroup: true,
          lastMessage: "Welcome to the group!",
          lastTime: "10:00 AM",
          unread: 0,
        },
        {
          id: 2,
          name: "John Doe",
          isGroup: false,
          lastMessage: "Hey, how's your prep?",
          lastTime: "9:45 AM",
          unread: 0,
        },
      ];
      setConversations(initialConversations);
      setAllMessages({});
      localStorage.setItem("chat_conversations", JSON.stringify(initialConversations));
      localStorage.setItem("chat_messages", JSON.stringify({}));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(allMessages));
    localStorage.setItem("chat_conversations", JSON.stringify(conversations));
  }, [allMessages, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim() || selectedChat === null) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = {
      id: Date.now(),
      sender: "You",
      content: message,
      time,
      type: "text",
    };

    setAllMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedChat
          ? { ...conv, lastMessage: message, lastTime: time, unread: 0 }
          : { ...conv, unread: conv.unread + (selectedChat !== conv.id ? 1 : 0) }
      )
    );

    setMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-full max-w-sm border-r bg-muted/30 overflow-y-auto">
        <Card className="rounded-none border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Chats</CardTitle>
            <Input
              className="mt-2"
              placeholder="Search chats..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            {conversations
              .filter((conv) =>
                conv.name.toLowerCase().includes(search.toLowerCase()) ||
                conv.lastMessage.toLowerCase().includes(search.toLowerCase())
              )
              .map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedChat(conv.id);
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
                    );
                  }}
                  className={cn(
                    "flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-muted",
                    selectedChat === conv.id && "bg-muted"
                  )}
                >
                  <div>
                    <p className="font-medium text-foreground">{conv.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {conv.lastTime}
                    </p>
                    {conv.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-muted/40">
              <h2 className="text-lg font-semibold">
                {conversations.find((c) => c.id === selectedChat)?.name}
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {(allMessages[selectedChat] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={cn("max-w-md p-3 rounded-lg", {
                    "ml-auto bg-primary text-primary-foreground": msg.sender === "You",
                    "mr-auto bg-muted text-foreground": msg.sender !== "You",
                  })}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {msg.time}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;