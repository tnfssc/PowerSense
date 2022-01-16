import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "wouter";

export default function Root() {
  return (
    <Router>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Router>
  );
}
