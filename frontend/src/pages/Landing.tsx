// import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Users,
  Trophy,
  Calendar,
  MessageCircle,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Intelligent Matching",
      description:
        "Advanced algorithms analyze your learning preferences, schedule, and academic goals to connect you with ideal study partners.",
      highlight: "95% compatibility rate",
    },
    {
      icon: Users,
      title: "Dynamic Study Groups",
      description:
        "Create or join focused study sessions with classmates who complement your strengths and help fill knowledge gaps.",
      highlight: "Active community",
    },
    {
      icon: Target,
      title: "Goal-Oriented Sessions",
      description:
        "Set specific objectives for each study session and track your collective progress toward academic milestones.",
      highlight: "Track success",
    },
    {
      icon: Calendar,
      title: "Seamless Coordination",
      description:
        "Find mutual availability effortlessly with our intelligent scheduling that respects everyone's commitments.",
      highlight: "Zero conflicts",
    },
    {
      icon: MessageCircle,
      title: "Collaborative Workspace",
      description:
        "Access shared digital study rooms with interactive tools, document collaboration, and focus-enhancing features.",
      highlight: "Real-time sync",
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description:
        "Stay motivated with meaningful progress markers that celebrate both individual growth and group accomplishments.",
      highlight: "Stay motivated",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Pre-Med Student",
      content:
        "StudySync helped me find the perfect chemistry study group. We went from struggling individually to acing our exams together.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Major",
      content:
        "The scheduling feature is a game-changer. No more endless back-and-forth trying to coordinate study times with my group.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Reviews
              </a>
              <Button variant="ghost">Sign In</Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-16 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Study smarter with the
              <span className="text-blue-600 block">right study partners</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with compatible study partners, form effective groups, and
              achieve better academic results through collaborative learning
              that actually works.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
              >
                <span
                  className="flex items-center"
                  onClick={() => navigate("/register")}
                >
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for effective group study
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thoughtfully designed tools that make collaborative learning
              natural and productive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get started in three simple steps
            </h2>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Tell us about your study needs
                </h3>
                <p className="text-gray-600 text-lg">
                  Share your courses, learning style, availability, and academic
                  goals so we can find your ideal matches.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Connect with compatible partners
                </h3>
                <p className="text-gray-600 text-lg">
                  Our matching system introduces you to students who complement
                  your strengths and share your commitment level.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Start achieving better results
                </h3>
                <p className="text-gray-600 text-lg">
                  Use our collaborative tools to coordinate sessions, track
                  progress, and celebrate your group's academic success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to transform how you study?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who've discovered the power of effective
            study partnerships.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 h-auto"
          >
            <span
              className="flex items-center"
              onClick={() => navigate("/register")}
            >
              Start Your Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </span>
          </Button>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • Set up in under 2 minutes
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  StudySync
                </span>
              </div>
              <p className="text-gray-600 max-w-md">
                Empowering students worldwide through intelligent study group
                formation and collaborative learning.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Mobile App
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Community
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © 2024 StudySync. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-600">
              <a href="#" className="hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
