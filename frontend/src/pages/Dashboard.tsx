import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Trophy, 
  Clock, 
  Target, 
  BookOpen, 
  Calendar,
  MessageCircle,
  VideoIcon,
  Star,
  TrendingUp
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Dashboard = () => {
  const myGroups = [
    {
      id: 1,
      name: "Advanced Calculus Masters",
      subject: "Mathematics",
      members: 4,
      nextSession: "Today, 3:00 PM",
      progress: 75
    },
    {
      id: 2,
      name: "Quantum Physics Explorers",
      subject: "Physics",
      members: 5,
      nextSession: "Tomorrow, 10:00 AM",
      progress: 60
    },
    {
      id: 3,
      name: "Organic Chemistry Lab",
      subject: "Chemistry",
      members: 3,
      nextSession: "Friday, 2:00 PM",
      progress: 40
    }
  ];

  const upcomingSessions = [
    { group: "Advanced Calculus Masters", time: "Today, 3:00 PM", type: "Study Session" },
    { group: "Quantum Physics Explorers", time: "Tomorrow, 10:00 AM", type: "Practice Exam" },
    { group: "Organic Chemistry Lab", time: "Friday, 2:00 PM", type: "Lab Review" }
  ];

  const achievements = [
    { name: "Study Streak", description: "7 days in a row!", icon: "🔥" },
    { name: "Group Leader", description: "Led 5 study sessions", icon: "👑" },
    { name: "Helpful Peer", description: "Top rated this week", icon: "⭐" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey? You have 2 study sessions today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">XP Points</p>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold text-foreground">42h</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Groups</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/10 dark:border-emerald-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Goals Completed</p>
                  <p className="text-2xl font-bold text-foreground">8/12</p>
                </div>
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="groups" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="groups">My Groups</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="groups" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Active Study Groups</h2>
                  <Button asChild>
                    <Link to="/groups">Find New Groups</Link>
                  </Button>
                </div>

                {myGroups.map(group => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{group.name}</h3>
                          <Badge variant="secondary">{group.subject}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {group.members} members
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          Next session: {group.nextSession}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Group Progress</span>
                            <span className="font-medium">{group.progress}%</span>
                          </div>
                          <Progress value={group.progress} className="h-2" />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" asChild>
                            <Link to={`/group/${group.id}`}>View Details</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/chat">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/virtual-room">
                              <VideoIcon className="w-4 h-4 mr-1" />
                              Join Room
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Upcoming Sessions</h2>
                {upcomingSessions.map((session, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{session.group}</h3>
                          <p className="text-sm text-muted-foreground">{session.type}</p>
                        </div>
                        <Badge variant="outline">{session.time}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Learning Progress</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-foreground">Weekly Study Goal</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        On track
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress this week</span>
                        <span className="font-medium">28/40 hours</span>
                      </div>
                      <Progress value={70} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                  <Link to="/groups">
                    <Users className="w-4 h-4 mr-2" />
                    Find Study Partners
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/scheduler">
                    <Calendar className="w-4 h-4 mr-2" />
                    Update Schedule
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">7</div>
                  <p className="text-muted-foreground">Days in a row!</p>
                  <div className="flex justify-center mt-3">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-primary rounded-full mx-1" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};