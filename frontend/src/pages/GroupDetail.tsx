import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Clock, 
  Star,
  Calendar,
  MessageCircle,
  VideoIcon,
  Settings,
  UserPlus,
  Award,
  BookOpen,
  Target,
  CheckSquare
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const GroupDetail = () => {
  const { id } = useParams();
  const [isMember, setIsMember] = useState(true);

  const groupData = {
    id: 1,
    name: "Advanced Calculus Masters",
    subject: "Mathematics",
    description: "A dedicated group focused on mastering advanced calculus concepts including multivariable calculus, differential equations, and real analysis. We meet regularly to solve complex problems and prepare for exams together.",
    members: [
      { id: 1, name: "Alex Chen", avatar: "", role: "Leader", rating: 4.9, streak: 15 },
      { id: 2, name: "Sarah Johnson", avatar: "", role: "Member", rating: 4.7, streak: 8 },
      { id: 3, name: "Mike Rodriguez", avatar: "", role: "Member", rating: 4.8, streak: 12 },
      { id: 4, name: "Emily Davis", avatar: "", role: "Member", rating: 4.6, streak: 5 }
    ],
    maxMembers: 6,
    rating: 4.8,
    learningStyle: "Visual",
    timeSlots: ["Monday 3:00-5:00 PM", "Wednesday 3:00-5:00 PM", "Friday 2:00-4:00 PM"],
    progress: 75,
    goals: [
      { id: 1, title: "Complete Chapter 12: Multiple Integrals", completed: true },
      { id: 2, title: "Practice Midterm Exam", completed: true },
      { id: 3, title: "Master Green's Theorem Applications", completed: false },
      { id: 4, title: "Final Exam Preparation", completed: false }
    ],
    upcomingSessions: [
      { date: "Today", time: "3:00 PM", topic: "Vector Calculus Review", type: "Study Session" },
      { date: "Wednesday", time: "3:00 PM", topic: "Practice Problems", type: "Problem Solving" },
      { date: "Friday", time: "2:00 PM", topic: "Exam Preparation", type: "Mock Exam" }
    ],
    studyStats: {
      totalHours: 145,
      weeklyGoal: 12,
      currentWeek: 8,
      sessionsCompleted: 24
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {groupData.name}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">{groupData.subject}</Badge>
                <div className="flex items-center text-muted-foreground">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {groupData.rating}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  {groupData.members.length}/{groupData.maxMembers}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isMember ? (
                <>
                  <Button asChild>
                    <Link to="/virtual-room">
                      <VideoIcon className="w-4 h-4 mr-2" />
                      Join Study Room
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/chat">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Group Chat
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Request to Join
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{groupData.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Advanced Level</Badge>
                      <Badge variant="outline">Problem Solving</Badge>
                      <Badge variant="outline">Exam Prep</Badge>
                      <Badge variant="outline">{groupData.learningStyle} Learning</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupData.upcomingSessions.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">{session.topic}</h4>
                          <p className="text-sm text-muted-foreground">{session.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{session.date}</p>
                          <p className="text-sm text-muted-foreground">{session.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupData.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center p-4 bg-card border rounded-lg">
                        <Calendar className="w-5 h-5 text-primary mr-3" />
                        <span className="text-foreground">{slot}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupData.goals.map((goal) => (
                      <div key={goal.id} className="flex items-center gap-3">
                        <CheckSquare className={`w-5 h-5 ${goal.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span className={`flex-1 ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {goal.title}
                        </span>
                        {goal.completed && <Badge variant="outline" className="text-green-600">Completed</Badge>}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Study Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{groupData.studyStats.totalHours}h</div>
                        <div className="text-sm text-muted-foreground">Total Study Time</div>
                      </div>
                      <div className="text-center p-4 bg-accent/5 rounded-lg">
                        <div className="text-2xl font-bold text-accent">{groupData.studyStats.sessionsCompleted}</div>
                        <div className="text-sm text-muted-foreground">Sessions Completed</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weekly Goal Progress</span>
                        <span className="font-medium">{groupData.studyStats.currentWeek}/{groupData.studyStats.weeklyGoal}h</span>
                      </div>
                      <Progress value={(groupData.studyStats.currentWeek / groupData.studyStats.weeklyGoal) * 100} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <div className="grid gap-4">
                  {groupData.members.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant={member.role === 'Leader' ? 'default' : 'secondary'} className="text-xs">
                                {member.role}
                              </Badge>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                {member.rating}
                              </div>
                              <div className="flex items-center">
                                <Award className="w-3 h-3 mr-1 text-primary" />
                                {member.streak} day streak
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Group Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{groupData.progress}%</span>
                </div>
                <Progress value={groupData.progress} className="h-2" />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Members</span>
                    <span className="font-medium">{groupData.members.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Study Sessions</span>
                    <span className="font-medium">3/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Learning Style</span>
                    <span className="font-medium">{groupData.learningStyle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/virtual-room">
                    <VideoIcon className="w-4 h-4 mr-2" />
                    Start Study Session
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/chat">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open Group Chat
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/scheduler">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-foreground">Sarah completed Chapter 12 quiz</p>
                  <p className="text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">New study session scheduled</p>
                  <p className="text-muted-foreground">1 day ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">Mike shared helpful resources</p>
                  <p className="text-muted-foreground">2 days ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};