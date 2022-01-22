import { Flex, Heading, Button } from "@chakra-ui/react";

import useAuth from "../use/auth";
import Link from "../components/Link";

export default function Home() {
  const user = useAuth();
  return (
    <>
      <Flex flexDir="column" w="100%" alignItems="center">
        <Heading>Home Page</Heading>
        {user ? (
          <Heading size="md">Signed In as {user.email}</Heading>
        ) : (
          <Link to="/login">
            <Button>Sign in</Button>
          </Link>
        )}
      </Flex>
    </>
  );
}
