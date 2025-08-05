import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Clock,
  Star,
  Search,
  Filter,
  MapPin,
  Calendar,
  Brain,
  UserPlus,
  Eye,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import axios from "axios";

export const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  const handleCreateGroup = async () => {
    if (
      !groupName ||
      !subject ||
      !description ||
      !maxMembers ||
      !learningStyle
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const payload = {
        name: groupName.trim(),
        subject,
        description: description.trim(),
        members: ["6891d86ce620d2f9b413146f"],
        maxMembers: parseInt(maxMembers),
        learningStyle,
      };

      const response = await fetch(
        "https://d6fdd0f8061f.ngrok-free.app/group/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create group.");
      }

      const data = await response.json();
      console.log("Group created:", data);
      alert("Group created successfully!");

      setGroupName("");
      setSubject("");
      setDescription("");
      setMaxMembers("");
      setLearningStyle("");
    } catch (error) {
      console.error("Error creating group:", error.message);
      alert(`Failed to create group: ${error.message}`);
    }
  };

  const recommendedGroups = [
    {
      id: 1,
      name: "Linear Algebra Warriors",
      subject: "Mathematics",
      description:
        "Conquering matrices and vector spaces together. Perfect for intermediate level students.",
      members: 4,
      maxMembers: 6,
      rating: 4.8,
      learningStyle: "Visual",
      timeSlot: "2:00-4:00 PM",
      days: ["Mon", "Wed", "Fri"],
      matchScore: 95,
      tags: ["Peer Learning", "Practice Problems", "Group Study"],
    },
    {
      id: 2,
      name: "Quantum Mechanics Study Circle",
      subject: "Physics",
      description:
        "Diving deep into quantum phenomena and mathematical formulations.",
      members: 3,
      maxMembers: 5,
      rating: 4.9,
      learningStyle: "Mixed",
      timeSlot: "6:00-8:00 PM",
      days: ["Tue", "Thu"],
      matchScore: 88,
      tags: ["Advanced Level", "Problem Solving", "Theory Focus"],
    },
    {
      id: 3,
      name: "Organic Chemistry Lab Partners",
      subject: "Chemistry",
      description:
        "Practice reactions, mechanisms, and lab techniques together.",
      members: 5,
      maxMembers: 8,
      rating: 4.7,
      learningStyle: "Kinesthetic",
      timeSlot: "10:00-12:00 PM",
      days: ["Mon", "Wed"],
      matchScore: 82,
      tags: ["Lab Work", "Hands-on", "Collaborative"],
    },
  ];

  const allGroups = [
    ...recommendedGroups,
    {
      id: 4,
      name: "Spanish Conversation Club",
      subject: "Languages",
      description: "Practice Spanish conversation in a supportive environment.",
      members: 6,
      maxMembers: 10,
      rating: 4.6,
      learningStyle: "Auditory",
      timeSlot: "5:00-6:30 PM",
      days: ["Daily"],
      matchScore: 75,
      tags: ["Conversation", "Cultural Exchange", "Beginner Friendly"],
    },
    {
      id: 5,
      name: "Data Structures & Algorithms",
      subject: "Computer Science",
      description: "Solve coding challenges and master algorithms together.",
      members: 7,
      maxMembers: 12,
      rating: 4.9,
      learningStyle: "Visual",
      timeSlot: "7:00-9:00 PM",
      days: ["Tue", "Thu", "Sat"],
      matchScore: 90,
      tags: ["Coding", "Problem Solving", "Interview Prep"],
    },
  ];

  const filteredGroups = allGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const GroupCard = ({
    group,
    isRecommended = false,
  }: {
    group: any;
    isRecommended?: boolean;
  }) => (
    <Card
      className={`hover:shadow-lg transition-shadow ${
        isRecommended ? "ring-2 ring-primary/20" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-lg">
                {group.name}
              </h3>
              {isRecommended && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Brain className="w-3 h-3 mr-1" />
                  {group.matchScore}% Match
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="mb-2">
              {group.subject}
            </Badge>
            <p className="text-muted-foreground text-sm mb-3">
              {group.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                {group.members}/{group.maxMembers}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {group.rating}
              </div>
            </div>
            <Badge variant="outline">{group.learningStyle}</Badge>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            {group.timeSlot} • {group.days.join(", ")}
          </div>

          <div className="flex flex-wrap gap-1">
            {group.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              Request to Join
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Find Your Study Group
          </h1>
          <p className="text-muted-foreground">
            Discover study groups that match your learning style and schedule
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by subject, group name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Learning Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              <SelectItem value="Visual">Visual</SelectItem>
              <SelectItem value="Auditory">Auditory</SelectItem>
              <SelectItem value="Kinesthetic">Kinesthetic</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommended">AI Recommended</TabsTrigger>
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="create">Create Group</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  AI-Powered Recommendations
                </h2>
              </div>
              <p className="text-muted-foreground">
                Based on your learning style, subjects, and schedule, here are
                the best matching study groups for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedGroups.map((group) => (
                <GroupCard key={group.id} group={group} isRecommended />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create a New Study Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    placeholder="Enter a catchy group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="computer-science">
                        Computer Science
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Describe your group's focus and goals"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Members</label>
                    <Select onValueChange={setMaxMembers}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="8">8 members</SelectItem>
                        <SelectItem value="12">12 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Learning Style
                    </label>
                    <Select onValueChange={setLearningStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Primary style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visual">Visual</SelectItem>
                        <SelectItem value="Auditory">Auditory</SelectItem>
                        <SelectItem value="Kinesthetic">Kinesthetic</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreateGroup}>
                  Create Study Group
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
