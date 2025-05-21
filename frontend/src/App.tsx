import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { createBrowserRouter, RouterProvider } from 'react-router';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Index />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  );
};

export default App;
