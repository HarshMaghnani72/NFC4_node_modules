import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  Users,
  MessageCircle,
  Upload,
  Download,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Maximize,
  Minimize,
  Send,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const VirtualRoom = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState("pen");

  const participants = [
    { id: 1, name: "You", avatar: "", isHost: true, video: true, audio: true },
    {
      id: 2,
      name: "Alex Chen",
      avatar: "",
      isHost: false,
      video: true,
      audio: true,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      avatar: "",
      isHost: false,
      video: false,
      audio: true,
    },
    {
      id: 4,
      name: "Mike Rodriguez",
      avatar: "",
      isHost: false,
      video: true,
      audio: false,
    },
  ];

  const chatMessages = [
    {
      id: 1,
      sender: "Alex Chen",
      message: "Hey everyone! Ready to tackle these calculus problems?",
      time: "2:30 PM",
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      message: "Absolutely! I have some questions about integration by parts.",
      time: "2:31 PM",
    },
    {
      id: 3,
      sender: "Mike Rodriguez",
      message: "Same here. Let's start with the practice problems.",
      time: "2:32 PM",
    },
  ];

  const whiteboardTools = [
    { id: "pen", icon: PenTool, name: "Pen" },
    { id: "eraser", icon: Eraser, name: "Eraser" },
    { id: "square", icon: Square, name: "Rectangle" },
    { id: "circle", icon: Circle, name: "Circle" },
    { id: "text", icon: Type, name: "Text" },
  ];

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        }
      }, 1000);
    } else if (timerMinutes === 0 && timerSeconds === 0) {
      setIsTimerRunning(false);
      // Timer finished - could show notification
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const resetTimer = () => {
    setTimerMinutes(25);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Controls */}
          <div className="border-b bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground">
                  Advanced Calculus Study Session
                </h1>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  Live
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="icon"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="icon"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? (
                    <Mic className="w-4 h-4" />
                  ) : (
                    <MicOff className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant={isScreenSharing ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  <ScreenShare className="w-4 h-4 mr-2" />
                  {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                </Button>

                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Video Grid and Whiteboard */}
          <div className="flex-1 flex">
            {/* Whiteboard Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 border-r">
              {/* Whiteboard Toolbar */}
              <div className="border-b bg-card/80 backdrop-blur-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-3">
                      Tools:
                    </span>
                    {whiteboardTools.map((tool) => (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTool(tool.id)}
                        className="p-2"
                      >
                        <tool.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      Clear
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Whiteboard Canvas */}
              <div className="flex-1 bg-white dark:bg-gray-950 flex items-center justify-center relative">
                <div className="text-center text-muted-foreground">
                  <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Interactive Whiteboard</p>
                  <p className="text-sm">
                    Click and drag to draw • Use tools above
                  </p>
                </div>

                {/* Placeholder for actual whiteboard canvas */}
                <canvas
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  style={{ touchAction: "none" }}
                />
              </div>
            </div>

            {/* Video Grid */}
            <div className="w-80 bg-card/30 p-4">
              <div className="grid grid-cols-1 gap-3">
                {participants.map((participant) => (
                  <Card
                    key={participant.id}
                    className="relative overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                        {participant.video ? (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <VideoOff className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {participant.name}
                            {participant.isHost && " (Host)"}
                          </Badge>

                          <div className="flex items-center gap-1">
                            {!participant.audio && (
                              <MicOff className="w-3 h-3 text-red-500" />
                            )}
                            {!participant.video && (
                              <VideoOff className="w-3 h-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-card/30 flex flex-col">
          {/* Pomodoro Timer */}
          <Card className="m-4 mb-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {String(timerMinutes).padStart(2, "0")}:
                  {String(timerSeconds).padStart(2, "0")}
                </div>
                <p className="text-sm text-muted-foreground">
                  Pomodoro Session
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant={isTimerRunning ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={resetTimer}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card className="m-4 mb-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants ({participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm">{participant.name}</span>
                    {participant.isHost && (
                      <Badge variant="outline" className="text-xs">
                        Host
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="m-4 flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Group Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && setMessage("")}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={() => setMessage("")}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="w-4 h-4 mr-1" />
                    Share File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
