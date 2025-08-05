import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export const Register = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "History", "Literature", "Economics", "Psychology", "Philosophy"
  ];

  const timeSlots = [
    "6:00-8:00 AM", "8:00-10:00 AM", "10:00-12:00 PM", "12:00-2:00 PM",
    "2:00-4:00 PM", "4:00-6:00 PM", "6:00-8:00 PM", "8:00-10:00 PM"
  ];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-foreground">
              Join StudySync
            </CardTitle>
            <p className="text-muted-foreground">
              Create your profile to get matched with perfect study partners
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your.email@university.edu" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a strong password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institute">Institution</Label>
              <Input id="institute" placeholder="Your university or school name" />
            </div>

            <div className="space-y-3">
              <Label>Preferred Subjects</Label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <Badge
                    key={subject}
                    variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject}
                    {selectedSubjects.includes(subject) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(time => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={selectedTimes.includes(time)}
                      onCheckedChange={() => toggleTimeSlot(time)}
                    />
                    <Label htmlFor={time} className="text-sm">{time}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Learning Style</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual (diagrams, charts, images)</SelectItem>
                  <SelectItem value="auditory">Auditory (listening, discussions)</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic (hands-on, movement)</SelectItem>
                  <SelectItem value="mixed">Mixed (combination of styles)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full text-lg py-6">
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};