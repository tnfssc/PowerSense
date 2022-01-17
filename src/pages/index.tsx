import { Flex, Heading, Button } from "@chakra-ui/react";

import useAuth from "../use/auth";
import supabase from "../lib/supabase";

export default function Home() {
  const user = useAuth();
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading>Home Page</Heading>
      {user ? (
        <Heading size="md">Signed In as {user.email}</Heading>
      ) : (
        <Button colorScheme="blackAlpha" onClick={() => supabase.auth.signIn({ provider: "google" })}>Sign in</Button>
      )}
    </Flex>
  );
}
