import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Workforce from "./pages/Workforce.tsx";
import Dispatch from "./pages/Dispatch.tsx";
import Memory from "./pages/Memory.tsx";

import Signal from "./pages/Signal.tsx";
import Command from "./pages/Command.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workforce" element={<Workforce />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/memory" element={<Memory />} />
          
          <Route path="/signal" element={<Signal />} />
          <Route path="/command" element={<Command />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
