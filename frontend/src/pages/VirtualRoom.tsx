import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  CheckSquare,
  Trophy,
  Clock,
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  StopCircle,
  Download,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Send,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  Users,
  Wifi,
  WifiOff,
  Phone,
  PhoneOff,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export const VirtualRoom = () => {
  // Connection and Session State
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [userName, setUserName] = useState("");
  const [isHost, setIsHost] = useState(false);

  // Media State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteScreenShare, setRemoteScreenShare] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState("pomodoro");

  // Whiteboard State
  const [selectedTool, setSelectedTool] = useState("pen");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(2);
  const [eraserSize, setEraserSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState(null);

  // App State
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [studyHours, setStudyHours] = useState(0);
  const [xpPoints, setXpPoints] = useState(100);
  const [showNotification, setShowNotification] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false); // New state for calendar modal

  // Refs
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const whiteboardRef = useRef(null);
  const localVideoRef = useRef(null);
  const screenShareVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());
  const remoteVideosRef = useRef(new Map());

  const whiteboardTools = [
    { id: "pen", icon: PenTool, name: "Pen" },
    { id: "eraser", icon: Eraser, name: "Eraser" },
    { id: "square", icon: Square, name: "Rectangle" },
    { id: "circle", icon: Circle, name: "Circle" },
    { id: "text", icon: Type, name: "Text" },
  ];

  // WebRTC Configuration
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Initialize Socket Connection
  useEffect(() => {
    const SOCKET_SERVER = "ws://localhost:8080";

    try {
      socketRef.current = {
        emit: (event, data) => {
          console.log(`Socket emit: ${event}`, data);
          setTimeout(() => {
            if (event === "join-session") {
              setIsConnected(true);
              setConnectedUsers([
                { id: "user1", name: "You", isHost: true },
                { id: "user2", name: "Study Partner", isHost: false },
              ]);
            }
          }, 1000);
        },
        on: (event, callback) => {
          console.log(`Socket listener: ${event}`);
        },
        disconnect: () => {
          console.log("Socket disconnected");
        },
      };
    } catch (error) {
      console.error("Socket connection failed:", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
      contextRef.current = context;
    }
  }, []);

  // Update canvas context when tool changes
  useEffect(() => {
    const context = contextRef.current;
    if (context) {
      if (selectedTool === "eraser") {
        context.globalCompositeOperation = "destination-out";
        context.lineWidth = eraserSize;
      } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = penColor;
        context.fillStyle = penColor;
        context.lineWidth = penSize;
      }
    }
  }, [selectedTool, penColor, penSize, eraserSize]);

  // Join Session
  const joinSession = async () => {
    if (!userName.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn,
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const roomId = sessionId || `room_${Date.now()}`;
      setSessionId(roomId);

      socketRef.current?.emit("join-session", {
        sessionId: roomId,
        userName: userName,
        isHost: !sessionId,
      });

      setIsHost(!sessionId);
    } catch (error) {
      console.error("Failed to join session:", error);
      alert("Failed to access camera/microphone. Please check permissions.");
    }
  };

  // Leave Session
  const leaveSession = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();

    setIsConnected(false);
    setConnectedUsers([]);
    setRemoteStreams(new Map());
    setIsScreenSharing(false);
    setRemoteScreenShare(null);

    socketRef.current?.emit("leave-session", { sessionId });
  };

  // Screen Share Implementation
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            mediaSource: "screen",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
          },
          audio: true,
        });

        setIsScreenSharing(true);

        if (screenShareVideoRef.current) {
          screenShareVideoRef.current.srcObject = screenStream;
        }

        socketRef.current?.emit("screen-share-start", {
          sessionId,
          streamId: screenStream.id,
        });

        peerConnectionsRef.current.forEach(async (pc, userId) => {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = pc
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        });

        screenStream.getVideoTracks()[0].addEventListener("ended", () => {
          stopScreenShare();
        });
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error("Screen share error:", error);
      alert("Screen sharing failed. Please try again.");
    }
  };

  const stopScreenShare = async () => {
    setIsScreenSharing(false);

    if (screenShareVideoRef.current) {
      const stream = screenShareVideoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        screenShareVideoRef.current.srcObject = null;
      }
    }

    socketRef.current?.emit("screen-share-stop", { sessionId });

    if (localStream && isVideoOn) {
      peerConnectionsRef.current.forEach(async (pc, userId) => {
        const videoTrack = localStream.getVideoTracks()[0];
        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      });
    }
  };

  // Toggle Video/Audio
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  // Whiteboard Drawing Functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;

    if (selectedTool === "text") {
      setTextPosition({ x: offsetX, y: offsetY });
      return;
    }

    context.beginPath();
    context.moveTo(offsetX, offsetY);

    if (selectedTool === "pen" || selectedTool === "eraser") {
      setIsDrawing(true);
      socketRef.current?.emit("drawing-start", {
        sessionId,
        x: offsetX,
        y: offsetY,
        tool: selectedTool,
        color: penColor,
        size: selectedTool === "eraser" ? eraserSize : penSize,
      });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;

    if (selectedTool === "pen" || selectedTool === "eraser") {
      context.lineTo(offsetX, offsetY);
      context.stroke();

      socketRef.current?.emit("drawing", {
        sessionId,
        x: offsetX,
        y: offsetY,
        tool: selectedTool,
        color: penColor,
        size: selectedTool === "eraser" ? eraserSize : penSize,
      });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (selectedTool === "pen" || selectedTool === "eraser") {
      socketRef.current?.emit("drawing-end", { sessionId });
    }
  };

  // Chat Functions
  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const message = {
        id: Date.now(),
        user: userName,
        text: chatInput,
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatMessages((prev) => [...prev, message]);
      socketRef.current?.emit("chat-message", { sessionId, message });
      setChatInput("");
    }
  };

  // Timer Functions
  useEffect(() => {
    let interval;
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        }
      }, 1000);
      setStudyHours((prev) => prev + 1 / 3600);
    } else if (timerMinutes === 0 && timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setXpPoints((prev) => prev + 10);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const resetTimer = () => {
    setTimerMinutes(
      timerType === "pomodoro" ? 25 : timerType === "break" ? 5 : 15
    );
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  // Todo Functions
  const addTodo = () => {
    if (todoInput.trim()) {
      const newTodo = { id: Date.now(), text: todoInput, completed: false };
      setTodos((prev) => [...prev, newTodo]);
      socketRef.current?.emit("todo-add", { sessionId, todo: newTodo });
      setTodoInput("");
      setXpPoints((prev) => prev + 5);
    }
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    socketRef.current?.emit("todo-toggle", { sessionId, todoId: id });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                Join Virtual Study Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                placeholder="Session ID (leave empty to create new)"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={joinSession}
                disabled={!userName.trim()}
              >
                <Video className="w-4 h-4 mr-2" />
                Join Session
              </Button>
              <div className="text-sm text-muted-foreground text-center">
                {sessionId
                  ? "Joining existing session"
                  : "Creating new session"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                  Virtual Study Session
                </h1>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {connectedUsers.length} Users
                </Badge>
                <Badge variant="outline">Room: {sessionId.slice(-6)}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="icon"
                  onClick={toggleVideo}
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
                  onClick={toggleAudio}
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
                  onClick={toggleScreenShare}
                >
                  {isScreenSharing ? (
                    <>
                      <StopCircle className="w-4 h-4 mr-2" />
                      Stop Share
                    </>
                  ) : (
                    <>
                      <ScreenShare className="w-4 h-4 mr-2" />
                      Share Screen
                    </>
                  )}
                </Button>
                <Button variant="destructive" size="sm" onClick={leaveSession}>
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Leave
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCalendar(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Calendar
                </Button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="bg-gray-900 p-4">
            <div className="grid grid-cols-2 gap-4 h-48">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You {isHost && "(Host)"}
                </div>
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Remote Video or Screen Share */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                {isScreenSharing ? (
                  <video
                    ref={screenShareVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Waiting for study partner...</p>
                    </div>
                  </div>
                )}
                {isScreenSharing && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Screen Share Active
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Whiteboard Area */}
          <div className="flex-1 flex">
            <div
              ref={whiteboardRef}
              className="flex-1 flex flex-col bg-white dark:bg-gray-900 border-r"
            >
              {/* Whiteboard Toolbar */}
              <div className="border-b bg-card/80 backdrop-blur-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
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
                    <div className="flex items-center gap-2 border rounded p-1">
                      <input
                        type="color"
                        value={penColor}
                        onChange={(e) => setPenColor(e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer"
                      />
                    </div>
                    {selectedTool !== "eraser" && (
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={penSize}
                        onChange={(e) => setPenSize(parseInt(e.target.value))}
                        className="w-20"
                      />
                    )}
                    {selectedTool === "eraser" && (
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={eraserSize}
                        onChange={(e) =>
                          setEraserSize(parseInt(e.target.value))
                        }
                        className="w-20"
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const canvas = canvasRef.current;
                      const context = contextRef.current;
                      context.clearRect(0, 0, canvas.width, canvas.height);
                      socketRef.current?.emit("whiteboard-clear", {
                        sessionId,
                      });
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 bg-white dark:bg-gray-950 relative">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-card/30 flex flex-col">
          {/* Connected Users */}
          <Card className="m-4 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Connected Users ({connectedUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {connectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{user.name}</span>
                  {user.isHost && (
                    <Badge variant="secondary" className="text-xs">
                      Host
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Timer */}
          <Card className="m-4 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Focus Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {String(timerMinutes).padStart(2, "0")}:
                  {String(timerSeconds).padStart(2, "0")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {timerType === "pomodoro" ? "Focus Session" : "Break Time"}
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant={isTimerRunning ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={resetTimer}>
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shared Todo */}
          <Card className="m-4 mb-2 flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                Shared Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add task..."
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  className="text-sm h-8"
                />
                <Button size="sm" onClick={addTodo}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>
              <ScrollArea className="h-32">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 mb-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      className={
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {todo.text}
                    </span>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="m-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-24 mb-2 border rounded p-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-xs mb-1">
                    <span className="font-medium">{msg.user}:</span> {msg.text}
                  </div>
                ))}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                  className="text-sm h-8"
                />
                <Button size="sm" onClick={sendChatMessage}>
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Schedule Calendar</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[600px]">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=your_calendar_id%40group.calendar.google.com&ctz=UTC"
              style={{ border: 0 }}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
            ></iframe>
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Timer completed! +10 XP earned
          </div>
        </div>
      )}
    </div>
  );
};
