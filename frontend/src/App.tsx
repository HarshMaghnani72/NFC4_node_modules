import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Landing } from "./pages/Landing";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Groups } from "./pages/Groups";
import { GroupDetail } from "./pages/GroupDetail";
import { VirtualRoom } from "./pages/VirtualRoom";
import { Chat } from "./pages/Chat";
import { Progress } from "./pages/Progress";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/group/:id" element={<GroupDetail />} />
          <Route path="/virtual-room" element={<VirtualRoom />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
