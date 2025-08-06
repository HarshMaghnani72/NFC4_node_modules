"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Target, Clock, TrendingUp, BookOpen, Users, Flame, Gift, Crown } from 'lucide-react';
import { Navbar } from "@/components/Navbar";
import { Coupon } from "@/types/coupon";
import { Task } from "@/types/task";
import { ProgressUpdatePayload, WeeklyStats, DailyStudyHours } from "@/types/progress";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

// Weekly Study Chart Component
const WeeklyStudyChart = ({ data }: { data: { day: string; hours: number }[] }) => {
  const maxHours = Math.max(...data.map((d) => d.hours));
  return (
    <div className="flex items-end h-32 gap-1 px-2">
      {data.map((dayData, index) => (
        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
          <div
            className="w-4 rounded-t-sm bg-primary transition-all duration-300 ease-out"
            style={{ height: `${(dayData.hours / maxHours) * 100}%` }}
          />
          <span className="text-xs text-muted-foreground mt-1">{dayData.day}</span>
        </div>
      ))}
    </div>
  );
};

export default function ProgressPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userId;

  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    studyHours: 0,
    goal: 0,
    sessions: 0,
    groups: 0,
  });

  const [dailyStudyHours, setDailyStudyHours] = useState<DailyStudyHours>([
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ]);

  const subjects = [
    { name: "Mathematics", hours: 15, progress: 75, color: "bg-blue-500" },
    { name: "Physics", hours: 8, progress: 60, color: "bg-green-500" },
    { name: "Chemistry", hours: 5, progress: 40, color: "bg-purple-500" },
  ];

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      name: "Redfox 50% Off",
      description: "Get 50% off on your next Redfox purchase!",
      brand: "Redfox",
      value: "50% OFF",
      image: "/placeholder.svg?height=80&width=80",
      redeemed: false,
      expiryDate: "Dec 31, 2025",
    },
    {
      id: 2,
      name: "Redfox Free Shipping",
      description: "Enjoy free shipping on all Redfox orders.",
      brand: "Redfox",
      value: "FREE SHIPPING",
      image: "/placeholder.svg?height=80&width=80",
      redeemed: true,
      redeemedDate: "Jul 20, 2025",
    },
    {
      id: 3,
      name: "Redfox ₹100 Discount",
      description: "Flat ₹100 discount on orders above ₹500.",
      brand: "Redfox",
      value: "₹100 OFF",
      image: "/placeholder.svg?height=80&width=80",
      redeemed: false,
      expiryDate: "Nov 15, 2025",
    },
  ]);

  const milestones = [
    {
      title: "Complete Advanced Calculus Course",
      progress: 75,
      completed: false,
      dueDate: "Dec 15, 2024",
      tasks: ["Integration Methods ✓", "Series Convergence ✓", "Vector Calculus", "Final Exam"],
    },
    {
      title: "Master Quantum Physics Basics",
      progress: 60,
      completed: false,
      dueDate: "Jan 20, 2025",
      tasks: ["Wave Functions ✓", "Schrödinger Equation", "Quantum Entanglement", "Lab Experiments"],
    },
  ];

  const recentActivity = [
    { action: "Completed study session", group: "Advanced Calculus Masters", time: "2 hours ago" },
    { action: "Earned achievement", achievement: "Helper Badge", time: "3 hours ago" },
    { action: "Joined study group", group: "Quantum Physics Explorers", time: "1 day ago" },
    { action: "Completed milestone", milestone: "Integration Methods", time: "2 days ago" },
  ];

  const topUsers = [
    { id: 1, name: "Alice Johnson", level: 15, xp: 1800, rank: 1 },
    { id: 2, name: "Bob Williams", level: 14, xp: 1650, rank: 2 },
    { id: 3, name: "Charlie Brown", level: 13, xp: 1500, rank: 3 },
    { id: 4, name: "Diana Miller", level: 12, xp: 1300, rank: 4 },
    { id: 5, name: "Eve Davis", level: 11, xp: 1100, rank: 5 },
  ];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState("Today");
  const [newVisibility, setNewVisibility] = useState<"public" | "private">("private");
  const [newGroupId, setNewGroupId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "public" | "private" | "group">("all");
  const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]);

  // Function to update user progress via API
  const updateUserProgress = async (payload: ProgressUpdatePayload) => {
    if (!userId || !isAuthenticated) {
      toast.error("Please log in to update progress");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/progress", { // Using the URL from Postman image
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Failed to update progress: ${response.statusText}`);
      const data = await response.json();
      console.log("Progress updated:", data);
      toast.success("Progress updated successfully!");
      // Optionally refetch progress data to reflect changes immediately
      fetchProgressData();
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast.error("Failed to update progress");
    }
  };

  // Fetch tasks, groups, and progress data on mount
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      return;
    }
    fetchProgressData();
    fetchTasks();
    fetchGroups();
  }, [userId, isAuthenticated]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch(`/api/progress?userId=${userId}`); // Assuming this endpoint exists for GET
      if (!response.ok) throw new Error(`Failed to fetch progress: ${response.statusText}`);
      const data = await response.json();
      setWeeklyStats({
        studyHours: data.weeklyStats.studyHours,
        goal: data.weeklyStats.goal,
        sessions: data.weeklyStats.sessions,
        groups: data.weeklyStats.groups,
      });
      setDailyStudyHours(data.dailyStudyHours);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
      toast.error('Failed to fetch progress data');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/groups?userId=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch groups: ${response.statusText}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to fetch groups');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !userId) {
    navigate('/login');
    return null;
  }

  // Add New Task
  const addTask = async () => {
    if (!userId || !isAuthenticated) {
      toast.error("Please log in to add tasks");
      navigate("/login");
      return;
    }
    if (!newTask.trim()) {
      toast.error("Task cannot be empty");
      return;
    }
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          task: newTask,
          completed: false,
          dueDate: newDueDate,
          visibility: newVisibility,
          by: "You",
          groupId: newVisibility === "public" ? newGroupId : null,
        }),
      });
      if (!response.ok) throw new Error(`Failed to add task: ${response.statusText}`);
      const newTaskData = await response.json();
      setTasks([...tasks, newTaskData]);
      setNewTask("");
      setNewDueDate("Today");
      setNewVisibility("private");
      setNewGroupId(null);
      toast.success("Task added successfully");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task");
    }
  };

  // Toggle Task Completion
  const toggleTask = async (id: string) => {
    if (!userId || !isAuthenticated) {
      toast.error("Please log in to update tasks");
      navigate("/login");
      return;
    }
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const newCompletedStatus = !task.completed;
    const xpChange = newCompletedStatus ? 50 : -50; // Gain 50 XP on completion, lose 50 on uncompletion
    const tasksCompletedChange = newCompletedStatus ? 1 : -1; // Increment/decrement tasks completed

    try {
      // Update task status
      const taskResponse = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: newCompletedStatus }),
      });
      if (!taskResponse.ok) throw new Error(`Failed to update task: ${taskResponse.statusText}`);
      const updatedTask = await taskResponse.json();
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      toast.success("Task updated successfully");

      // Update user progress (studyHours, tasksCompleted, xp)
      await updateUserProgress({
        userId,
        tasksCompleted: weeklyStats.sessions + tasksCompletedChange, // Assuming sessions track tasks completed
        xp: weeklyStats.studyHours + xpChange, // Using studyHours as a proxy for current XP for simplicity
      });

    } catch (error) {
      console.error("Failed to update task or progress:", error);
      toast.error("Failed to update task or progress");
    }
  };

  // Filter tasks by visibility or group
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "public") return task.visibility === "public";
    if (activeTab === "private") return task.visibility === "private";
    if (activeTab === "group" && newGroupId) return task.groupId === newGroupId;
    return true;
  });

  // Handle Coupon Redeem
  const handleRedeemCoupon = (id: number) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    console.log("Redeeming coupon with id:", id, "Current coupons:", coupons);
    setCoupons((prev: Coupon[]) => {
      if (!Array.isArray(prev)) {
        console.error("Coupons state is not an array:", prev);
        return prev;
      }
      const updatedCoupons = prev.map((coupon) =>
        coupon.id === id ? { ...coupon, redeemed: true, redeemedDate: today } : coupon
      );
      console.log("Updated coupons:", updatedCoupons);
      toast.success(`Coupon "${updatedCoupons.find(c => c.id === id)?.name}" redeemed`);
      return updatedCoupons;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-foreground mb-2">Your Learning Progress</h1>
          <p className="text-lg text-muted-foreground">Track your study goals, achievements, and learning milestones</p>
        </div>
        {/* Weekly Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-3xl font-bold text-foreground">{weeklyStats.studyHours}h</p>
                  <p className="text-xs text-muted-foreground">of {weeklyStats.goal}h goal</p>
                </div>
                <Clock className="w-9 h-9 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-100 to-green-50 border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Sessions</p>
                  <p className="text-3xl font-bold text-foreground">{weeklyStats.sessions}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> +3 from last week
                  </p>
                </div>
                <Target className="w-9 h-9 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                  <p className="text-3xl font-bold text-foreground">{weeklyStats.groups}</p>
                  <p className="text-xs text-muted-foreground">Study groups</p>
                </div>
                <Users className="w-9 h-9 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-100 to-orange-50 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-3xl font-bold text-foreground">15</p>
                  <p className="text-xs text-orange-600">Days in a row!</p>
                </div>
                <Flame className="w-9 h-9 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="goals">Tasks</TabsTrigger>
                <TabsTrigger value="coupons">Offers</TabsTrigger> {/* Changed from Achievements to Offers */}
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="group">Group</TabsTrigger>
              </TabsList>
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-4">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                      Weekly Study Tracker
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <WeeklyStudyChart data={dailyStudyHours} />
                    <div className="flex justify-between text-sm pt-4 border-t">
                      <span className="text-muted-foreground">Total this week</span>
                      <span className="font-semibold text-foreground">
                        {weeklyStats.studyHours} / {weeklyStats.goal} hours
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <BookOpen className="w-6 h-6 mr-2 text-primary" />
                      Subjects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subjects.map((s, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${s.color}`} />
                            <span className="font-medium">{s.name}</span>
                          </div>
                          <span className="text-sm">{s.hours}h</span>
                        </div>
                        <ProgressBar value={s.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {act.action}{" "}
                            {act.group && <span className="text-primary">{act.group}</span>}
                            {act.achievement && <span className="text-primary"> {act.achievement}</span>}
                            {act.milestone && <span className="text-primary"> {act.milestone}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{act.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Tasks Tab */}
              <TabsContent value="goals" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl">
                      <span>Tasks</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-card space-y-3">
                      <h3 className="font-medium">Add New Task</h3>
                      <Input
                        placeholder="Enter task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <Select value={newDueDate} onValueChange={setNewDueDate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Due Date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Today">Today</SelectItem>
                            <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                            <SelectItem value="Friday">This Friday</SelectItem>
                            <SelectItem value="Next Week">Next Week</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={newVisibility} onValueChange={(v: "public" | "private") => setNewVisibility(v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                        {newVisibility === "public" && (
                          <Select value={newGroupId || ""} onValueChange={setNewGroupId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map((group) => (
                                <SelectItem key={group._id} value={group._id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Button onClick={addTask} className="w-full">Add Task</Button>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={activeTab === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={activeTab === "public" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("public")}
                      >
                        Public
                      </Button>
                      <Button
                        variant={activeTab === "private" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("private")}
                      >
                        Private
                      </Button>
                      <Button
                        variant={activeTab === "group" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab("group")}
                      >
                        Group
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {filteredTasks.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No {activeTab} tasks found.</p>
                      ) : (
                        filteredTasks.map((task) => (
                          <div
                            key={task._id}
                            className={`flex items-center gap-3 p-3 border rounded-lg ${
                              task.visibility === "public" ? "bg-accent/50" : "bg-card"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(task._id)}
                              className="w-5 h-5 rounded text-primary"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {task.task}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due: {task.dueDate} • Added by: {task.by}
                              </p>
                            </div>
                            <Badge variant="outline" className={task.visibility === "public" ? "bg-blue-100 text-blue-800" : ""}>
                              {task.visibility === "public" ? "🌍 Public" : "🔒 Private"}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Offers Tab (formerly Achievements / Coupons) */}
              <TabsContent value="coupons" className="space-y-6 mt-4">
                <div className="grid gap-4">
                  {coupons.map((c) => (
                    <Card key={c.id} className={c.redeemed ? "opacity-70" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={c.image || "/placeholder.svg"}
                            alt={c.name}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{c.name}</h4>
                            <p className="text-sm text-muted-foreground">{c.description}</p>
                            {c.redeemed ? (
                              <p className="text-xs text-green-600 mt-1">Redeemed on {c.redeemedDate}</p>
                            ) : (
                              <p className="text-xs text-muted-foreground mt-1">Expires: {c.expiryDate}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant={c.redeemed ? "secondary" : "default"}>{c.value}</Badge>
                            {!c.redeemed && (
                              <Button size="sm" className="mt-2" onClick={() => handleRedeemCoupon(c.id)}>
                                <Gift className="w-4 h-4 mr-1" /> Redeem
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              {/* Milestones */}
              <TabsContent value="milestones" className="space-y-6 mt-4">
                {milestones.map((m, i) => (
                  <Card key={i} className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{m.title}</span>
                        <Badge variant="outline">Due: {m.dueDate}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{m.progress}%</span>
                        </div>
                        <ProgressBar value={m.progress} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Tasks:</p>
                        <ul className="space-y-1">
                          {m.tasks.map((task, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  task.includes("✓") ? "bg-green-500" : "bg-gray-300"
                                }`}
                              />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              {/* Group Tasks */}
              <TabsContent value="group" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl">
                      <span>Group Tasks</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={newGroupId || ""} onValueChange={setNewGroupId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group._id} value={group._id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="space-y-3">
                      {filteredTasks.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No group tasks found.</p>
                      ) : (
                        filteredTasks.map((task) => (
                          <div
                            key={task._id}
                            className="flex items-center gap-3 p-3 border rounded-lg bg-accent/50"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(task._id)}
                              className="w-5 h-5 rounded text-primary"
                            />
                            <div className="flex-1">
                              <p
                                className={`font-medium ${
                                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {task.task}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due: {task.dueDate} • Added by: {task.by}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              🌍 Public
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Trophy className="w-6 h-6 mr-2 text-primary" />
                  Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">Level 12</div>
                  <p className="text-muted-foreground">Study Master</p>
                </div>
                <ProgressBar value={95} className="h-3 mt-4" />
                <p className="text-xs text-center mt-2 text-muted-foreground">153 XP to next level</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Flame className="w-6 h-6 mr-2 text-orange-600" />
                  Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-600">15</div>
                  <p className="text-muted-foreground">Days in a row!</p>
                </div>
              </CardContent>
            </Card>
            {/* Leaderboard Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 bg-card rounded-lg">
                    <Badge variant="secondary" className="min-w-[30px] justify-center">
                      {user.rank}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Level {user.level} ({user.xp} XP)</p>
                    </div>
                    {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
