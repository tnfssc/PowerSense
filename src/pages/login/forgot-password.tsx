import { Flex, Heading, Input, useBoolean, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import * as yup from "yup";

import supabase from "../../lib/supabase";

const validateEmail = (email: string) => {
  return yup.string().email().required().isValidSync(email);
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const toast = useToast({ position: "bottom-left" });
  const [loading, setLoading] = useBoolean(false);

  const handleSendResetPasswordLink = async () => {
    if (!validateEmail(email)) {
      return toast({
        title: "Invalid email",
        status: "error",
      });
    }
    try {
      setLoading.on();
      const { error } = await supabase.auth.api.sendMagicLinkEmail(email);
      setLoading.off();
      if (error) {
        return toast({
          title: "Some error occurred",
          status: "error",
        });
      }
      return toast({
        title: "Login using the link",
        description: "Please check your email to login with the link.",
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
      <Heading>Forgot Password Page</Heading>
      <Flex flexDir="column" mt="8">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Flex>

      <Button onClick={handleSendResetPasswordLink} mt="4" isLoading={loading}>
        Send Link
      </Button>
    </Flex>
  );
}
