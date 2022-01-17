import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "wouter";
import { QueryClientProvider, QueryClient } from "react-query";
import { AuthProvider } from "./use/auth";

const queryClient = new QueryClient();

export default function Root() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </Router>
  );
}
