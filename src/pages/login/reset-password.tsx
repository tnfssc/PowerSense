import { Flex, Heading, Input, useBoolean, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useLocation } from "wouter";
import * as yup from "yup";

import supabase from "../../lib/supabase";

const validatePassword = (newPassword: string, confirmPassword: string) => {
  if (newPassword !== confirmPassword) return false;
  return yup.string().required().min(8).isValidSync(newPassword);
};

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast({ position: "bottom-left" });
  const [loading, setLoading] = useBoolean(false);

  const handleSendResetPasswordLink = async () => {
    if (!validatePassword(newPassword, confirmPassword)) {
      return toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long. Passwords must match.",
        status: "error",
      });
    }
    try {
      setLoading.on();
      const { error } = await supabase.auth.api.updateUser(supabase.auth.session()!.access_token, {
        password: newPassword,
      });
      setLoading.off();
      if (error) {
        return toast({
          title: "Some error occurred",
          status: "error",
        });
      }
      setLocation("/dashboard");
      return toast({
        title: "Password updated",
        status: "success",
      });
    } catch (error) {
      setLoading.off();
      return toast({
        title: "Some error occurred",
        status: "error",
      });
    }
  };

  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading>Reset Password Page</Heading>
      <Flex flexDir="column" mt="8">
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          mt="2"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Flex>
      <Button onClick={handleSendResetPasswordLink} mt="4" isLoading={loading}>
        Update Password
      </Button>
    </Flex>
  );
}
