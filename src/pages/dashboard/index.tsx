import { Flex, Heading, CircularProgress } from "@chakra-ui/react";

import useAuth from "../../use/auth";
import useProfile from "../../use/profile";
import Link from "../../components/Link";

export default function Dashboard() {
  const user = useAuth()!;
  const { profile } = useProfile();
  return (
    <Flex flexDir="column">
      <Heading size="md">You are currently at Dashboard Page</Heading>
      {profile.isLoading ? (
        <CircularProgress isIndeterminate />
      ) : (
        <>
          <Heading>{profile.error ? user.email : profile.data?.displayName}</Heading>
          <Heading>
            <Link to="/profile">Click here to go to Profile Page</Link>
          </Heading>
        </>
      )}
    </Flex>
  );
}
