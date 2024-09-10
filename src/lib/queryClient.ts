import { toast } from "@/components/ui/use-toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // cache-level queries error handler
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      // cache-level mutations error handler
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    },
  }),
});

export default queryClient;
