import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wheat, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institute, setInstitute] = useState("");
  const [language, setLanguage] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "History",
    "Literature",
    "Economics",
    "Psychology",
    "Philosophy",
  ];

  const timeSlots = [
    "6:00-8:00 AM",
    "8:00-10:00 AM",
    "10:00-12:00 PM",
    "12:00-2:00 PM",
    "2:00-4:00 PM",
    "4:00-6:00 PM",
    "6:00-8:00 PM",
    "8:00-10:00 PM",
  ];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async () => {
    const fullName = `${firstName} ${lastName}`;
    const payload = {
      name: fullName,
      email,
      password,
      institute,
      subjects: selectedSubjects,
      language,
      availability: selectedTimes,
      learningStyle,
    };

    try {
      const res = await fetch(
        "http://localhost:8000/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "🎉 Registration Successful!",
          description: "You will be redirected to login shortly.",
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        if (data.error?.toLowerCase().includes("user already exists")) {
          toast({
            title: "User Already Registered",
            description: "Redirecting to login page...",
            variant: "destructive",
          });

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast({
            title: "Registration Failed",
            description: data.error || "Something went wrong.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Network Error",
        description: "Unable to connect to server.",
        variant: "destructive",
      });
    }
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
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institute">Institution</Label>
              <Input
                id="institute"
                placeholder="Your university or school name"
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Preferred Subjects</Label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject}
                    variant={
                      selectedSubjects.includes(subject) ? "default" : "outline"
                    }
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
              <Select onValueChange={(val) => setLanguage(val)}>
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
                {timeSlots.map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={time}
                      checked={selectedTimes.includes(time)}
                      onCheckedChange={() => toggleTimeSlot(time)}
                    />
                    <Label htmlFor={time} className="text-sm">
                      {time}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Learning Style</Label>
              <Select onValueChange={(val) => setLearningStyle(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your learning style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="Auditory">Auditory</SelectItem>
                  <SelectItem value="Kinesthetic">Kinesthetic</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full text-lg py-6" onClick={handleSubmit}>
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
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
