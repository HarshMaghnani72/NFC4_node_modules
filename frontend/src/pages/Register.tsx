import { useState } from "react";
// import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowRight,
  User,
  Mail,
  Lock,
  GraduationCap,
  Clock,
  BookOpen,
  Languages,
  Brain,
  UserCheck,
} from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institute, setInstitute] = useState("");
  const [language, setLanguage] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [acceptInvites, setAcceptInvites] = useState("true");

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
      acceptInvites: acceptInvites === "true",
    };

    // Simulate API call
    console.log("Registration payload:", payload);

    // Show success message (simulate)
    alert("Registration successful! Redirecting to login...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                StudySync
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Already have an account?
              <button
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Create Your StudySync Account
              </CardTitle>
              <p className="text-lg text-gray-600">
                Tell us about yourself so we can find your perfect study matches
              </p>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="institute"
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Institution
                  </Label>
                  <Input
                    id="institute"
                    placeholder="Your university or school name"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Academic Preferences Section */}
              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Academic Preferences
                  </h3>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Study Subjects
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Select all subjects you're interested in studying
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant={
                          selectedSubjects.includes(subject)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer transition-colors text-sm py-2 px-3 ${
                          selectedSubjects.includes(subject)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                        }`}
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                        {selectedSubjects.includes(subject) && (
                          <X className="w-3 h-3 ml-2" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {selectedSubjects.length > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      {selectedSubjects.length} subject
                      {selectedSubjects.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center">
                      <Languages className="w-4 h-4 mr-1" />
                      Preferred Language
                    </Label>
                    <Select onValueChange={(val) => setLanguage(val)}>
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center">
                      <Brain className="w-4 h-4 mr-1" />
                      Learning Style
                    </Label>
                    <Select onValueChange={(val) => setLearningStyle(val)}>
                      <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select your learning style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visual">
                          Visual - Learn through images and diagrams
                        </SelectItem>
                        <SelectItem value="Auditory">
                          Auditory - Learn through listening and discussion
                        </SelectItem>
                        <SelectItem value="Kinesthetic">
                          Kinesthetic - Learn through hands-on activities
                        </SelectItem>
                        <SelectItem value="Mixed">
                          Mixed - Combination of learning styles
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Availability & Preferences Section */}
              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Availability & Preferences
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Available Time Slots
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Select all time slots when you're available to study
                  </p>
                  <Select
                    onValueChange={(val) => {
                      if (!selectedTimes.includes(val)) {
                        setSelectedTimes([...selectedTimes, val]);
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select your available time slots" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem
                          key={time}
                          value={time}
                          disabled={selectedTimes.includes(time)}
                        >
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedTimes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-600">
                        Selected time slots:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTimes.map((time) => (
                          <Badge
                            key={time}
                            className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                            onClick={() =>
                              setSelectedTimes(
                                selectedTimes.filter((t) => t !== time)
                              )
                            }
                          >
                            {time}
                            <X className="w-3 h-3 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                    <UserCheck className="w-4 h-4 mr-1" />
                    Accept Study Group Invites
                  </Label>
                  <Select
                    value={acceptInvites}
                    onValueChange={(val) => setAcceptInvites(val)}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        Yes - I want to receive study group invitations
                      </SelectItem>
                      <SelectItem value="false">
                        No - I prefer to initiate study groups myself
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    This controls whether other students can invite you to their
                    study groups
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 h-auto font-medium"
                  onClick={handleSubmit}
                >
                  <span
                    className="flex items-center justify-center"
                    onClick={() => navigate("/login")}
                  >
                    Create My Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </Button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional help */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Need help getting started?
              <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                Contact our support team
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
