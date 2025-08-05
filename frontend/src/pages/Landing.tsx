import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Trophy, Calendar, MessageCircle, Target } from "lucide-react";

export const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Matchmaking",
      description: "Smart algorithm matches you with compatible study partners based on learning styles and goals."
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Join or create study groups with peers who share your academic interests and schedule."
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn XP points, badges, and climb leaderboards as you achieve study milestones."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Integrated calendar helps you find optimal study times that work for everyone."
    },
    {
      icon: MessageCircle,
      title: "Virtual Study Rooms",
      description: "Collaborate in real-time with whiteboards, screen sharing, and focus timers."
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor your study goals, track hours, and celebrate achievements with your group."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-6">
            Find Your Perfect
            <span className="text-primary block">Study Squad</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join the future of collaborative learning. Our AI-powered platform connects you with 
            compatible study partners to ace your exams together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Students Love StudySync
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of intelligent study group formation and collaborative learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-card/50 hover:bg-card transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already discovered their perfect study groups.
          </p>
          <Button size="lg" asChild className="text-lg">
            <Link to="/register">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">StudySync</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 StudySync. Empowering collaborative learning worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
};