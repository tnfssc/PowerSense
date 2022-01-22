import { useState } from "react";
import { Flex, Heading, Button, Input, useToast, useBoolean } from "@chakra-ui/react";
import { Redirect, useLocation } from "wouter";

import supabase from "../../lib/supabase";
import useAuth from "../../use/auth";

const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return regex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 8;
};

export default function LoginPage() {
  const [loading, setLoading] = useBoolean(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useAuth();
  const [, setLocation] = useLocation();
  const toast = useToast({ position: "bottom-left" });
  if (user) return <Redirect to="/dashboard" />;

  const handleSignInWithGoogle = async () => {
    supabase.auth.signIn({ provider: "google" });
  };

  const handleSignInWithEmail = async () => {
    if (!validateEmail(email)) {
      return toast({
        title: "Invalid email",
        status: "error",
      });
    }
    if (!validatePassword(password)) {
      return toast({
        title: "Invalid password",
        status: "error",
      });
    }
    try {
      setLoading.on();
      const res = await supabase.auth.signIn({ email, password });
      setLoading.off();
      if (!res.user && res.error?.message === "Invalid login credentials") {
        setLoading.on();
        await supabase.auth.signUp({ email, password });
        setLoading.off();
        setLocation("/");
        return toast({
          title: "Confirmation Email Sent",
          description: "Please confirm your email to login. Please use the latest email only.",
          status: "success",
        });
      }
      if (!res.user && res.error?.message === "Email not confirmed") {
        return toast({
          title: "Email not confirmed",
          description: "Please confirm your email to login.",
          status: "error",
        });
      }
      if (res.error) {
        console.error(res.error);
        return toast({
          title: "Some error occured",
          status: "error",
        });
      }
      if (res.user) {
        return setLocation("/dashboard");
      }
    } catch (error) {
      console.error(error);
      return toast({ title: "Some error occured", status: "error" });
    }
  };

  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading>Login Page</Heading>
      <Flex flexDir="column" mt="8">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mt="4"
        />
        <Button w="full" onClick={handleSignInWithEmail} mt="4" isLoading={loading}>
          Login
        </Button>
        <Flex w="full" justifyContent="center" padding="5">
          <Flex>or</Flex>
        </Flex>
        <Button w="full" onClick={handleSignInWithGoogle} isLoading={loading}>
          Login with Google
        </Button>
      </Flex>
    </Flex>
  );
}
