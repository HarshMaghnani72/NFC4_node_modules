import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Moon, Sun, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-foreground">StudySync</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/groups"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/groups") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Find Groups
          </Link>
          <Link
            to="/virtual-room"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/virtual-room") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Study Rooms
          </Link>
          <Link
            to="/progress"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/progress") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Progress
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/chat">
              <Bell className="w-4 h-4" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile & Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};