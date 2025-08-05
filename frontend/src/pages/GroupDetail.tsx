import { useState, useEffect } from "react";
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
  CheckSquare,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "../context/AuthContext";

export const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/group/${id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch group details");
        }

        const data = await response.json();
        console.log("Fetched group data:", data);
        console.log("Members array:", data.members);
        setGroupData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching group details:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>No group data found.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">Please log in to view group details.</p>
          <Button asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Debug logs for user and membership status
  console.log("User object:", user);
  console.log("isMember:", groupData.isMember);

  // Determine membership by checking if user.userId is in members array
  const isUserMember =
    groupData.isMember !== undefined
      ? groupData.isMember
      : groupData.members?.some((member) => member._id === user?.userId) || false;

  // Get user ID
  const userId = user?.userId;

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
                <Badge variant="secondary" className="text-sm">
                  {groupData.subjects?.length > 0 ? groupData.subjects.join(", ") : "No subjects"}
                </Badge>
                {groupData.rating && (
                  <div className="flex items-center text-muted-foreground">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {groupData.rating}
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  {groupData.memberCount || groupData.members?.length}/{groupData.maxMembers}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isUserMember ? (
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
                      {groupData.learningStyle && (
                        <Badge variant="outline">{groupData.learningStyle} Learning</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {groupData.upcomingSessions?.length > 0 && (
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
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                {groupData.timeSlots?.length > 0 ? (
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
                ) : (
                  <p>No schedule available.</p>
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                {groupData.goals?.length > 0 && (
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
                )}

                {groupData.studyStats && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {groupData.studyStats.totalHours && (
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{groupData.studyStats.totalHours}h</div>
                            <div className="text-sm text-muted-foreground">Total Study Time</div>
                          </div>
                        )}
                        {groupData.studyStats.sessionsCompleted && (
                          <div className="text-center p-4 bg-accent/5 rounded-lg">
                            <div className="text-2xl font-bold text-accent">{groupData.studyStats.sessionsCompleted}</div>
                            <div className="text-sm text-muted-foreground">Sessions Completed</div>
                          </div>
                        )}
                      </div>
                      {groupData.studyStats.weeklyGoal && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Weekly Goal Progress</span>
                            <span className="font-medium">{groupData.studyStats.currentWeek}/{groupData.studyStats.weeklyGoal}h</span>
                          </div>
                          <Progress value={(groupData.studyStats.currentWeek / groupData.studyStats.weeklyGoal) * 100} className="h-3" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <div className="grid gap-4">
                  {groupData.members?.map((member) => (
                    <Card key={member._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar || ""} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge variant={member.role === 'Leader' ? 'default' : 'secondary'} className="text-xs">
                                {member.role || 'Member'}
                              </Badge>
                              {member.rating && (
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {member.rating}
                                </div>
                              )}
                              {member.streak && (
                                <div className="flex items-center">
                                  <Award className="w-3 h-3 mr-1 text-primary" />
                                  {member.streak} day streak
                                </div>
                              )}
                            </div>
                          </div>
                          {user && member._id !== userId && (
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                          )}
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
                {groupData.progress && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium">{groupData.progress}%</span>
                    </div>
                    <Progress value={groupData.progress} className="h-2" />
                  </>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Members</span>
                    <span className="font-medium">{groupData.memberCount || groupData.members?.length}</span>
                  </div>
                  {groupData.activityScore !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Activity Score</span>
                      <span className="font-medium">{groupData.activityScore}</span>
                    </div>
                  )}
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
            {groupData.recentActivity?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {groupData.recentActivity.map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium text-foreground">{activity.description}</p>
                      <p className="text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};