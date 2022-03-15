import { Flex, Input, Button, Box, useToast, FormLabel } from "@chakra-ui/react";
import { useState } from "react";

import usePhones from "../../use/phones";
import useAuth from "../../use/auth";

export default function VerifyPhone() {
  const user = useAuth()!;
  const {
    phone: { data, error },
    invalidate,
  } = usePhones(user.id);
  const [phone, setPhone] = useState("+91");
  const [askCode, setAskCode] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const handleGetCode = async () => {
    setIsLoading(true);
    const { status } = await fetch("/api/verify/getCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: phone }),
    });
    if (status === 200) {
      setAskCode(true);
    } else {
      if (status === 400) {
        toast({
          title: "Invalid phone number",
          description: "Please enter a valid phone number",
          status: "error",
          position: "bottom-left",
        });
      } else {
        toast({
          title: "Some error occured",
          status: "error",
          position: "bottom-left",
        });
      }
    }
    setIsLoading(false);
  };
  const handleVerify = async () => {
    setIsLoading(true);
    const { status } = await fetch("/api/verify/verifyCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: phone, code }),
    });
    if (status === 200) {
      toast({ title: "Verification Successful", status: "success", position: "bottom-left" });
      await invalidate();
      setPhone("");
      setAskCode(false);
    } else {
      if (status === 400) {
        toast({ title: "Invalid verification code", status: "error", position: "bottom-left" });
      } else {
        toast({ title: "Some error occured", status: "error", position: "bottom-left" });
      }
    }
    setCode("");
    setIsLoading(false);
  };
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      {!error && data ? `Your phone number is ${data.phone}. Change it using the form below` : <></>}
      <Box h="10" />
      <Flex w="full" alignItems="center">
        <FormLabel>Phone&nbsp;number:</FormLabel>
        <Input
          disabled={askCode || isLoading}
          placeholder="Phone number with country code"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button isLoading={isLoading} onClick={handleGetCode} disabled={askCode}>
          Send OTP
        </Button>
      </Flex>
      <Box h="10" />
      {askCode ? (
        <Flex w="full">
          <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} disabled={isLoading} />
          <Button isLoading={isLoading} onClick={handleVerify}>
            Verify
          </Button>
        </Flex>
      ) : (
        <></>
      )}
    </Flex>
  );
}
