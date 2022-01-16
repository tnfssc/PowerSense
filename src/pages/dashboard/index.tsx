import { Flex, Heading } from "@chakra-ui/react";

import useAuth from "../../use/auth";
import Link from "../../components/Link";

export default function Dashboard() {
  const user = useAuth();
  return (
    <Flex flexDir="column">
      <Heading size="md">You are currently at Dashboard Page</Heading>
      <Heading>{user?.email}</Heading>
      <Heading>
        <Link to="/profile">Click here to go to Profile Page</Link>
      </Heading>
    </Flex>
  );
}
