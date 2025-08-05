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
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const VirtualRoom = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTool, setSelectedTool] = useState("pen");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(2);
  const [eraserSize, setEraserSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timerType, setTimerType] = useState("pomodoro");
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");
  const [studyHours, setStudyHours] = useState(0);
  const [xpPoints, setXpPoints] = useState(100);
  const [showNotification, setShowNotification] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const whiteboardRef = useRef(null);

  const whiteboardTools = [
    { id: "pen", icon: PenTool, name: "Pen" },
    { id: "eraser", icon: Eraser, name: "Eraser" },
    { id: "square", icon: Square, name: "Rectangle" },
    { id: "circle", icon: Circle, name: "Circle" },
    { id: "text", icon: Type, name: "Text" },
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  // Update canvas context when tool, color, or size changes
  useEffect(() => {
    const context = contextRef.current;
    if (context) {
      context.strokeStyle = selectedTool === "eraser" ? "#FFFFFF" : penColor;
      context.lineWidth = selectedTool === "eraser" ? eraserSize : penSize;
    }
  }, [selectedTool, penColor, penSize, eraserSize]);

  // Whiteboard Drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    if (selectedTool === "pen" || selectedTool === "eraser") {
      setIsDrawing(true);
    } else if (selectedTool === "square" || selectedTool === "circle") {
      setTextPosition({
        x: offsetX,
        y: offsetY,
        startX: offsetX,
        startY: offsetY,
      });
      setIsDrawing(true);
    } else if (selectedTool === "text") {
      setTextPosition({ x: offsetX, y: offsetY });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    if (selectedTool === "pen" || selectedTool === "eraser") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (selectedTool === "square" || selectedTool === "circle") {
      setTextPosition((prev) => ({ ...prev, x: offsetX, y: offsetY }));
    }
  };

  const stopDrawing = () => {
    if (selectedTool === "square" && isDrawing) {
      const { startX, startY, x, y } = textPosition;
      contextRef.current.beginPath();
      contextRef.current.rect(startX, startY, x - startX, y - startY);
      contextRef.current.stroke();
    } else if (selectedTool === "circle" && isDrawing) {
      const { startX, startY, x, y } = textPosition;
      const radius = Math.sqrt(
        Math.pow(x - startX, 2) + Math.pow(y - startY, 2)
      );
      contextRef.current.beginPath();
      contextRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
      contextRef.current.stroke();
    }
    setIsDrawing(false);
  };

  const addText = () => {
    if (selectedTool === "text" && textPosition && textInput) {
      contextRef.current.font = "16px Arial";
      contextRef.current.fillStyle = penColor;
      contextRef.current.fillText(textInput, textPosition.x, textPosition.y);
      setTextInput("");
      setTextPosition(null);
    }
  };

  // Pomodoro Timer and Study Hours
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
      setStudyHours((prev) => prev + 1 / 3600); // Increment study hours
    } else if (timerMinutes === 0 && timerSeconds === 0) {
      setIsTimerRunning(false);
      setXpPoints((prev) => prev + 10); // Award XP on timer completion
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      if (timerType === "pomodoro") {
        setTimerType("break");
        setTimerMinutes(5);
      } else if (timerType === "break") {
        setTimerType("pomodoro");
        setTimerMinutes(25);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds, timerType]);

  const resetTimer = () => {
    setTimerMinutes(
      timerType === "pomodoro" ? 25 : timerType === "break" ? 5 : 15
    );
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const handleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: isVideoOn,
          audio: isAudioOn,
        });
        setIsScreenSharing(true);
        stream.getVideoTracks()[0].onended = () => setIsScreenSharing(false);
      } else {
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const addTodo = () => {
    if (todoInput.trim()) {
      setTodos([
        ...todos,
        { id: todos.length + 1, text: todoInput, completed: false },
      ]);
      setTodoInput("");
      setXpPoints((prev) => prev + 5); // Award XP for adding todo
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    if (!todos.find((todo) => todo.id === id).completed) {
      setXpPoints((prev) => prev + 10); // Award XP for completing todo
    }
  };

  const toggleFullScreen = () => {
    const elem = whiteboardRef.current;
    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
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
                <Badge variant="secondary">
                  Matched: Calculus, Visual/Auditory
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
                  onClick={handleScreenShare}
                >
                  <ScreenShare className="w-4 h-4 mr-2" />
                  {isScreenSharing ? "Stop Screen Share" : "Start Screen Share"}
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Sync Calendar
                </Button>
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
                        className="p-2 relative group"
                      >
                        <tool.icon className="w-4 h-4" />
                        <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                          {tool.name}
                        </span>
                      </Button>
                    ))}
                    <input
                      type="color"
                      value={penColor}
                      onChange={(e) => setPenColor(e.target.value)}
                      className="w-8 h-8 p-1 rounded"
                      title="Pen Color"
                    />
                    {selectedTool !== "eraser" && (
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={penSize}
                        onChange={(e) => setPenSize(parseInt(e.target.value))}
                        className="w-20"
                        title="Pen Size"
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
                        title="Eraser Size"
                      />
                    )}
                    {selectedTool === "text" && textPosition && (
                      <div className="flex gap-2">
                        <Input
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="Enter text"
                          className="w-32"
                        />
                        <Button size="sm" onClick={addText}>
                          Add Text
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const canvas = canvasRef.current;
                        const link = document.createElement("a");
                        link.download = "whiteboard.png";
                        link.href = canvas.toDataURL("image/png");
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        contextRef.current.clearRect(
                          0,
                          0,
                          canvasRef.current.width,
                          canvasRef.current.height
                        )
                      }
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullScreen}
                    >
                      {isFullScreen ? (
                        <Minimize className="w-4 h-4" />
                      ) : (
                        <Maximize className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              {/* Whiteboard Canvas */}
              <div className="flex-1 bg-white dark:bg-gray-950 flex items-center justify-center relative">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  style={{ touchAction: "none" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                />
                <div className="text-center text-muted-foreground">
                  <PenTool className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Interactive Whiteboard</p>
                  <p className="text-sm">
                    Click and drag to draw • Use tools above
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="w-80 border-l bg-card/30 flex flex-col">
          {/* Notification */}
          {showNotification && (
            <div className="m-4 p-2 bg-green-100 text-green-700 rounded text-sm flex items-center">
              <Trophy className="w-4 h-4 mr-2" /> Timer complete! +10 XP
            </div>
          )}
          {/* Pomodoro Timer */}
          <Card className="m-4 mb-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
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
                  {timerType === "pomodoro"
                    ? "Pomodoro Session"
                    : timerType === "break"
                    ? "Break"
                    : "Custom Timer"}
                </p>
                <p className="text-sm">Study Hours: {studyHours.toFixed(1)}</p>
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
                <select
                  value={timerType}
                  onChange={(e) => {
                    setTimerType(e.target.value);
                    setTimerMinutes(
                      e.target.value === "pomodoro"
                        ? 25
                        : e.target.value === "break"
                        ? 5
                        : 15
                    );
                    setTimerSeconds(0);
                  }}
                  className="text-sm border rounded p-1"
                >
                  <option value="pomodoro">Pomodoro (25m)</option>
                  <option value="break">Break (5m)</option>
                  <option value="custom">Custom (15m)</option>
                </select>
              </div>
            </CardContent>
          </Card>
          {/* To-Do List */}
          <Card className="m-4 mb-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CheckSquare className="w-5 h-5 mr-2" />
                Shared To-Do List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add task..."
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                />
                <Button size="icon" onClick={addTodo}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="h-24">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 mb-2">
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
        </div>
      </div>
    </div>
  );
};
