import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Star, Clock, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";

// Define TypeScript interface for user data
interface User {
  availability: {
    start: string;
    end: string;
  };
  _id: string;
  name: string;
  email: string;
  institute: string;
  subjects: string[];
  language: string;
  learningStyle: string;
  studyHours: number;
  tasksCompleted: number;
  xp: number;
  acceptInvites: boolean;
  badges: string[];
  ratings: any[];
}

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://31401729b953.ngrok-free.app/user/profile', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data: User = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Format availability times
  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-destructive">Error: {error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Fallback in case user is null but no error (shouldn't happen)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user.name}'s Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your study preferences and track your progress
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Institute</p>
                    <p className="text-foreground">{user.institute}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Study Preferences Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Study Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Subjects</p>
                  <div className="flex gap-2 mt-1">
                    {user.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Language</p>
                  <p className="text-foreground">{user.language}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning Style</p>
                  <p className="text-foreground">{user.learningStyle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accept Group Invites</p>
                  <p className="text-foreground">{user.acceptInvites ? "Yes" : "No"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available</p>
                    <p className="text-foreground">
                      {formatTime(user.availability.start)} - {formatTime(user.availability.end)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">XP Points</p>
                  <p className="text-foreground font-semibold">{user.xp}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Study Hours</p>
                  <p className="text-foreground font-semibold">{user.studyHours}h</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                  <p className="text-foreground font-semibold">{user.tasksCompleted}</p>
                </div>
              </CardContent>
            </Card>

            {/* Badges Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badges</CardTitle>
              </CardHeader>
              <CardContent>
                {user.badges.length > 0 ? (
                  user.badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                      <Star className="w-5 h-5 text-primary" />
                      <p className="text-foreground">{badge}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No badges earned yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link to="/profile/edit">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/groups">
                    <User className="w-4 h-4 mr-2" />
                    Find Study Groups
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};