import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckSquare, 
  Star, 
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Users,
  Flame,
  Medal
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Progress = () => {
  const weeklyStats = {
    studyHours: 28,
    goal: 40,
    sessions: 12,
    groups: 3
  };

  const subjects = [
    { name: "Mathematics", hours: 15, progress: 75, color: "bg-blue-500" },
    { name: "Physics", hours: 8, progress: 60, color: "bg-green-500" },
    { name: "Chemistry", hours: 5, progress: 40, color: "bg-purple-500" }
  ];

  const achievements = [
    { 
      id: 1, 
      name: "Study Streak Master", 
      description: "Maintain a 7-day study streak", 
      icon: "🔥", 
      earned: true, 
      date: "2 days ago",
      xp: 100 
    },
    { 
      id: 2, 
      name: "Group Leader", 
      description: "Lead 5 successful study sessions", 
      icon: "👑", 
      earned: true, 
      date: "1 week ago",
      xp: 150 
    },
    { 
      id: 3, 
      name: "Helper", 
      description: "Get 10 positive peer ratings", 
      icon: "⭐", 
      earned: true, 
      date: "3 days ago",
      xp: 75 
    },
    { 
      id: 4, 
      name: "Night Owl", 
      description: "Complete 5 evening study sessions", 
      icon: "🦉", 
      earned: false, 
      progress: 60,
      xp: 50 
    },
    { 
      id: 5, 
      name: "Marathon Learner", 
      description: "Study for 4+ hours in one session", 
      icon: "🏃", 
      earned: false, 
      progress: 25,
      xp: 200 
    }
  ];

  const milestones = [
    { 
      title: "Complete Advanced Calculus Course", 
      progress: 75, 
      completed: false,
      dueDate: "Dec 15, 2024",
      tasks: ["Integration Methods ✓", "Series Convergence ✓", "Vector Calculus", "Final Exam"]
    },
    { 
      title: "Master Quantum Physics Basics", 
      progress: 60, 
      completed: false,
      dueDate: "Jan 20, 2025",
      tasks: ["Wave Functions ✓", "Schrödinger Equation", "Quantum Entanglement", "Lab Experiments"]
    },
    { 
      title: "Chemistry Lab Certification", 
      progress: 40, 
      completed: false,
      dueDate: "Nov 30, 2024",
      tasks: ["Safety Training ✓", "Basic Reactions", "Analytical Methods", "Final Assessment"]
    }
  ];

  const studyGoals = [
    { task: "Complete Chapter 13 Problems", completed: true, dueDate: "Today" },
    { task: "Review Quantum Mechanics Notes", completed: false, dueDate: "Tomorrow" },
    { task: "Organic Chemistry Lab Report", completed: false, dueDate: "Friday" },
    { task: "Group Study Session Prep", completed: true, dueDate: "Yesterday" },
    { task: "Physics Problem Set #8", completed: false, dueDate: "Monday" }
  ];

  const recentActivity = [
    { action: "Completed study session", group: "Advanced Calculus Masters", time: "2 hours ago" },
    { action: "Earned achievement", achievement: "Helper Badge", time: "3 hours ago" },
    { action: "Joined study group", group: "Quantum Physics Explorers", time: "1 day ago" },
    { action: "Completed milestone", milestone: "Integration Methods", time: "2 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Learning Progress
          </h1>
          <p className="text-muted-foreground">
            Track your study goals, achievements, and learning milestones
          </p>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.studyHours}h</p>
                  <p className="text-xs text-muted-foreground">of {weeklyStats.goal}h goal</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-green-50 border-green-200 dark:from-green-900/20 dark:to-green-800/10 dark:border-green-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Sessions</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.sessions}</p>
                  <p className="text-xs text-green-600">+3 from last week</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.groups}</p>
                  <p className="text-xs text-muted-foreground">Study groups</p>
                </div>
                <Users className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-100 to-orange-50 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/10 dark:border-orange-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-bold text-foreground">15</p>
                  <p className="text-xs text-orange-600">Days in a row!</p>
                </div>
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Weekly Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Weekly Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Study Goal Progress</span>
                        <span className="font-medium">{weeklyStats.studyHours}/{weeklyStats.goal} hours</span>
                      </div>
                      <ProgressBar value={(weeklyStats.studyHours / weeklyStats.goal) * 100} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Subject Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {subjects.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                            <span className="font-medium text-foreground">{subject.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{subject.hours}h this week</span>
                        </div>
                        <ProgressBar value={subject.progress} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {activity.action}
                            {activity.group && <span className="text-primary"> {activity.group}</span>}
                            {activity.achievement && <span className="text-primary"> {activity.achievement}</span>}
                            {activity.milestone && <span className="text-primary"> {activity.milestone}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckSquare className="w-5 h-5 mr-2" />
                        Study Goals
                      </span>
                      <Button size="sm">Add Goal</Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {studyGoals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                        <CheckSquare className={`w-5 h-5 ${goal.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <p className={`font-medium ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {goal.task}
                          </p>
                          <p className="text-sm text-muted-foreground">Due: {goal.dueDate}</p>
                        </div>
                        {goal.completed && (
                          <Badge variant="outline" className="text-green-600">Completed</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="grid gap-4">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={achievement.earned ? 'bg-primary/5 border-primary/20' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            {achievement.earned ? (
                              <p className="text-xs text-primary font-medium">Earned {achievement.date}</p>
                            ) : (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-muted-foreground">Progress: {achievement.progress}%</p>
                                <ProgressBar value={achievement.progress || 0} className="h-1" />
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant={achievement.earned ? "default" : "secondary"}>
                              +{achievement.xp} XP
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-6">
                {milestones.map((milestone, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{milestone.title}</span>
                        <Badge variant="outline">Due: {milestone.dueDate}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{milestone.progress}%</span>
                        </div>
                        <ProgressBar value={milestone.progress} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Tasks:</p>
                        <ul className="space-y-1">
                          {milestone.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${task.includes('✓') ? 'bg-green-500' : 'bg-gray-300'}`} />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* XP Level */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">Level 12</div>
                  <p className="text-sm text-muted-foreground">Study Master</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">XP Progress</span>
                    <span className="font-medium">2,847 / 3,000</span>
                  </div>
                  <ProgressBar value={95} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center">153 XP to next level</p>
                </div>
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Flame className="w-5 h-5 mr-2" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-4xl font-bold text-orange-600">15</div>
                  <p className="text-muted-foreground">Days in a row!</p>
                  
                  <div className="flex justify-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-orange-500 rounded-full" />
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">Keep it up to maintain your streak!</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Study Time</span>
                  <span className="font-medium">145h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Goals</span>
                  <span className="font-medium">23/30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Study Partners</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Rating</span>
                  <span className="font-medium flex items-center">
                    4.8 <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};