import { Flex, Heading } from "@chakra-ui/react";

import Link from "../components/Link";
import useAuth from "../use/auth";

export default function Home() {
  const user = useAuth();
  return (
    <Flex flexDir="column">
      <Heading size="md">You are currently at Home Page</Heading>
      <Heading>
        {user ? (
          <Link to="/dashboard">Click here to go to dashboard</Link>
        ) : (
          "Sign in using the button on the top right"
        )}
      </Heading>
    </Flex>
  );
}
