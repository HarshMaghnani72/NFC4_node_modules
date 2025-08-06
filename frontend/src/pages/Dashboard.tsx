import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      return null;
    }
  };

  function useUserGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchGroups = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/group/my-groups",
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch groups");
          }

          const data = await response.json();
          setGroups(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchGroups();
    }, []);

    return { groups, loading, error };
  }

  const { groups, loading, error } = useUserGroups();

  const handleViewDetails = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8000/group/${groupId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch group details");
      }

      const groupData = await response.json();
      // Navigate to group details page with data
      navigate(`/group/${groupId}`, { state: { group: groupData } });
    } catch (error) {
      console.error("Error fetching group details:", error.message);
      alert(`Failed to fetch group details: ${error.message}`);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      const userData = await fetchUserProfile();
      setProfile(userData);
    };

    getProfile();
  }, []);

  const achievements = [
    { name: "Study Streak", description: "7 days in a row!", icon: "🔥" },
    { name: "Group Leader", description: "Led 5 study sessions", icon: "👑" },
    { name: "Helpful Peer", description: "Top rated this week", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {profile
              ? `Welcome back, ${profile.name || profile.email}!`
              : "Welcome back!"}
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey? You have {groups.length}{" "}
            study sessions today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    XP Points
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {profile?.xp || 0}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Study Hours
                  </p>
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Groups
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {groups.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/10 dark:border-emerald-800/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Goals Completed
                  </p>
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
                  <h2 className="text-xl font-semibold text-foreground">
                    Active Study Groups
                  </h2>
                  <Button asChild>
                    <Link to="/groups">Find New Groups</Link>
                  </Button>
                </div>

                {loading && <p>Loading your groups...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}
                {!loading && !error && groups.length === 0 && (
                  <p>No groups found. Join or create a group!</p>
                )}
                {!loading && !error && groups.length > 0 && (
                  <>
                    {groups.map((group) => (
                      <Card
                        key={group.groupId}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">
                                {group.name}
                              </h3>
                              <Badge variant="secondary">
                                {group.subjects.length > 0
                                  ? group.subjects.join(", ")
                                  : "No subjects"}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="w-4 h-4 mr-1" />
                              {group.memberCount}/{group.maxMembers} members
                            </div>
                          </div>

                          <div className="space-y-3">
                            {group.nextSession && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-2" />
                                Next session: {group.nextSession}
                              </div>
                            )}

                            {group.progress && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Group Progress
                                  </span>
                                  <span className="font-medium">
                                    {group.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={group.progress}
                                  className="h-2"
                                />
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => handleViewDetails(group.groupId)}
                              >
                                View Details
                              </Button>
                              {!group.isMember && (
                                <Button size="sm" variant="outline">
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  Request to Join
                                </Button>
                              )}
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
                  </>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Upcoming Sessions
                </h2>
                {groups.length === 0 && !loading && !error && (
                  <p>No upcoming sessions. Join a group to see sessions!</p>
                )}
                {groups.map(
                  (group, index) =>
                    group.nextSession && (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {group.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Study Session
                              </p>
                            </div>
                            <Badge variant="outline">{group.nextSession}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                )}
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Learning Progress
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-foreground">
                        Weekly Study Goal
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        On track
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progress this week
                        </span>
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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/groups">
                    <Users className="w-4 h-4 mr-2" />
                    Find Study Partners
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
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
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {achievement.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
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
                      <div
                        key={i}
                        className="w-3 h-3 bg-primary rounded-full mx-1"
                      />
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
