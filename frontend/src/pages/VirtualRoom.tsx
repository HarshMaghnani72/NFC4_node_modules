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
<<<<<<< HEAD
  StopCircle,
  Play,
  Pause,
  RotateCcw,
=======
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
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
  Send,
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
<<<<<<< HEAD
  Users,
  Wifi,
  PhoneOff,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
=======
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e

const Navbar = () => (
  <div className="bg-card border-b p-4">
    <h1 className="text-xl font-bold">StudyRoom</h1>
  </div>
);

export const VirtualRoom = () => {
<<<<<<< HEAD
  // Connection and Session State
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [userName, setUserName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [connectionError, setConnectionError] = useState("");

  // Media State
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [mediaError, setMediaError] = useState("");

  // Timer State
=======
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState("pen");
<<<<<<< HEAD
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(2);
  const [eraserSize, setEraserSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);

  // App State
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [xpPoints, setXpPoints] = useState(100);
  const [showNotification, setShowNotification] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const localVideoRef = useRef(null);
  const screenShareVideoRef = useRef(null);
  const socketRef = useRef(null);
=======

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
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e

  const whiteboardTools = [
    { id: "pen", icon: PenTool, name: "Pen" },
    { id: "eraser", icon: Eraser, name: "Eraser" },
    { id: "square", icon: Square, name: "Rectangle" },
    { id: "circle", icon: Circle, name: "Circle" },
    { id: "text", icon: Type, name: "Text" },
  ];

<<<<<<< HEAD
  // Initialize Mock Socket
  useEffect(() => {
    socketRef.current = {
      emit: (event, data) => {
        console.log(`Socket emit: ${event}`, data);
        // Simulate successful connection
        if (event === "join-session") {
          setTimeout(() => {
            setConnectedUsers([
              { id: "user1", name: data.userName, isHost: data.isHost },
              { id: "user2", name: "Study Partner", isHost: false },
            ]);
          }, 1000);
        }
      },
      on: (event, callback) => {
        console.log(`Socket listener registered: ${event}`);
      },
      disconnect: () => {
        console.log("Socket disconnected");
      },
    };

    return () => {
      // Cleanup all streams on unmount
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream, screenStream]);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas size properly
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
      contextRef.current = context;
    }
  }, [penColor, penSize]);

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

  // Enhanced getUserMedia with better error handling
  const getUserMedia = async () => {
    try {
      setMediaError("");
      console.log("Requesting user media...");
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Stream obtained:", stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
      
      return stream;
    } catch (error) {
      console.error("getUserMedia error:", error);
      let errorMessage = "Failed to access camera/microphone. ";
      
      switch (error.name) {
        case "NotAllowedError":
          errorMessage += "Please allow camera and microphone permissions and refresh the page.";
          break;
        case "NotFoundError":
          errorMessage += "No camera or microphone found.";
          break;
        case "NotReadableError":
          errorMessage += "Camera or microphone is being used by another application.";
          break;
        case "OverconstrainedError":
          errorMessage += "Camera constraints could not be satisfied.";
          break;
        default:
          errorMessage += error.message;
      }
      
      setMediaError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Enhanced getDisplayMedia with better error handling
  const getDisplayMedia = async () => {
    try {
      console.log("Requesting screen share...");
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          width: { max: 1920 },
          height: { max: 1080 },
          frameRate: { max: 30 }
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      console.log("Screen stream obtained:", stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
      return stream;
    } catch (error) {
      console.error("getDisplayMedia error:", error);
      let errorMessage = "Screen sharing failed. ";
      
      switch (error.name) {
        case "NotAllowedError":
          errorMessage += "Screen sharing permission denied.";
          break;
        case "NotFoundError":
          errorMessage += "No screen source available.";
          break;
        default:
          errorMessage += error.message;
      }
      
      setMediaError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Enhanced video setup with proper error handling
  const setupVideo = async (videoElement, stream, label) => {
    if (!videoElement || !stream) {
      console.warn(`Missing video element or stream for ${label}`);
      console.log(`${label} video element`, videoElement);
console.log(`${label} stream`, stream);

      return false;
    }

    try {
      console.log(`Setting up ${label} video...`);
      
      // Clear any existing stream
      if (videoElement.srcObject) {
        const oldStream = videoElement.srcObject;
        oldStream.getTracks().forEach(track => track.stop());
      }
      
      videoElement.srcObject = stream;
      videoElement.muted = label.includes("local"); // Mute local video to prevent feedback
      
      // Wait for metadata to load
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Video load timeout")), 10000);
        
        videoElement.onloadedmetadata = () => {
          clearTimeout(timeout);
          console.log(`${label} video metadata loaded`);
          resolve();
        };
        
        videoElement.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`${label} video element error`));
        };
      });

      // Attempt to play
      await videoElement.play();
      console.log(`${label} video playing successfully`);
      return true;
      
    } catch (error) {
      console.error(`${label} video setup error:`, error);
      setMediaError(`Failed to play ${label} video: ${error.message}`);
      return false;
    }
  };

  // Join Session with improved error handling
  const joinSession = async () => {
    if (!userName.trim()) {
      setConnectionError("Please enter your name");
      return;
    }

    try {
      setConnectionError("");
      setMediaError("");
      
      console.log("Starting join session...");
      
      // Get user media first
      const stream = await getUserMedia();
      setLocalStream(stream);
      console.log("Local Stream Tracks", stream.getTracks());

      // Setup local video
      if (localVideoRef.current) {
        const success = await setupVideo(localVideoRef.current, stream, "local");
        if (!success) {
          console.warn("Local video setup failed, but continuing...");
        }
      }

      // Simulate room joining
      const roomId = sessionId || `room_${Date.now()}`;
      setSessionId(roomId);
      setIsHost(!sessionId);
      
      socketRef.current?.emit("join-session", {
        sessionId: roomId,
        userName: userName,
        isHost: !sessionId,
      });
      
      setIsConnected(true);
      console.log("Successfully joined session");
      
    } catch (error) {
      console.error("Join session failed:", error);
      setConnectionError(error.message);
    }
  };

  // Leave Session
  const leaveSession = () => {
    console.log("Leaving session...");
    
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      setLocalStream(null);
    }
    
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped screen ${track.kind} track`);
      });
      setScreenStream(null);

    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (screenShareVideoRef.current) {
      screenShareVideoRef.current.srcObject = null;
    }

    // Reset state
    setIsConnected(false);
    setConnectedUsers([]);
    setIsScreenSharing(false);
    setMediaError("");
    setConnectionError("");

    socketRef.current?.emit("leave-session", { sessionId });
  };

  // Enhanced Screen Share
  const toggleScreenShare = async () => {
    try {
      setMediaError("");
      
      if (!isScreenSharing) {
        console.log("Starting screen share...");
        
        const stream = await getDisplayMedia();
        setScreenStream(stream);
        
        // Setup screen share video
        if (screenShareVideoRef.current) {
          const success = await setupVideo(screenShareVideoRef.current, stream, "screen share");
          if (success) {
            setIsScreenSharing(true);
            
            // Handle screen share end
            stream.getVideoTracks()[0].addEventListener("ended", () => {
              console.log("Screen share ended by user");
              stopScreenShare();
            });
            
            socketRef.current?.emit("screen-share-start", {
              sessionId,
              streamId: stream.id,
            });
          }
        }
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error("Screen share toggle error:", error);
      // Error message already set by getDisplayMedia
    }
  };

  const stopScreenShare = () => {
    console.log("Stopping screen share...");
    
    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped screen share ${track.kind} track`);
      });
      setScreenStream(null);
    }

    if (screenShareVideoRef.current) {
      screenShareVideoRef.current.srcObject = null;
    }

    setIsScreenSharing(false);
    socketRef.current?.emit("screen-share-stop", { sessionId });
  };

  // Toggle Video/Audio
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
        console.log(`Video ${!isVideoOn ? 'enabled' : 'disabled'}`);
        socketRef.current?.emit("video-toggle", {
          sessionId,
          enabled: !isVideoOn,
        });
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
        console.log(`Audio ${!isAudioOn ? 'enabled' : 'disabled'}`);
        socketRef.current?.emit("audio-toggle", {
          sessionId,
          enabled: !isAudioOn,
        });
      }
    }
  };

  // Whiteboard Drawing Functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    if (!context) return;

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
    if (!context) return;

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
=======
  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        }
      }, 1000);
<<<<<<< HEAD
    } else if (timerMinutes === 0 && timerSeconds === 0 && isTimerRunning) {
=======
    } else if (timerMinutes === 0 && timerSeconds === 0) {
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
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

<<<<<<< HEAD
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
              {connectionError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {connectionError}
                </div>
              )}
              {mediaError && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
                  <AlertCircle className="w-4 h-4 mr-2 inline" />
                  {mediaError}
                </div>
              )}
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
              <div className="text-xs text-muted-foreground">
                Make sure to allow camera and microphone permissions when prompted
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

=======
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
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
            {mediaError && (
              <div className="mt-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
                <AlertCircle className="w-4 h-4 mr-2 inline" />
                {mediaError}
              </div>
            )}
          </div>

<<<<<<< HEAD
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
  hidden={!localStream}
/>
<video
  ref={screenShareVideoRef}
  autoPlay
  muted
  playsInline
  className="w-full h-full object-contain"
  hidden={!screenStream}
/>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  You {isHost && "(Host)"}
                </div>
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {!localStream && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Video className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Camera not available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Screen Share or Partner Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                {isScreenSharing ? (
                  <>
                    <video
                      ref={screenShareVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Your Screen Share
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Waiting for study partner...</p>
                      <p className="text-xs mt-1">Or share your screen to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Whiteboard Area */}
          <div className="flex-1 flex">
=======
          {/* Video Grid and Whiteboard */}
          <div className="flex-1 flex">
            {/* Whiteboard Area */}
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
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
<<<<<<< HEAD
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const canvas = canvasRef.current;
                      const context = contextRef.current;
                      if (canvas && context) {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        socketRef.current?.emit("whiteboard-clear", {
                          sessionId,
                        });
                      }
                    }}
                  >
                    Clear
                  </Button>
=======

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
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
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
<<<<<<< HEAD

      {/* Google Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Schedule Calendar</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[600px] bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center text-gray-600">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Calendar integration would be implemented here</p>
              <p className="text-sm mt-2">Connect with Google Calendar API</p>
            </div>
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Timer completed! +10 XP earned
          </div>
        </div>
      )}
=======
>>>>>>> 55111e80bdceba71110484c762f545d0078cc07e
    </div>
  );
};