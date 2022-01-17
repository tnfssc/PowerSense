import { Flex, Heading, CircularProgress } from "@chakra-ui/react";

import useAuth from "../../use/auth";
import useProfile from "../../use/profile";
import Link from "../../components/Link";

export default function Dashboard() {
  const user = useAuth()!;
  const { profile } = useProfile();
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading>Dashboard Page</Heading>
      {profile.isLoading ? (
        <CircularProgress isIndeterminate />
      ) : (
        <Heading size="md">
          Signed in as <Link to="/profile">{profile.error ? user.email : profile.data?.displayName}</Link>
        </Heading>
      )}
    </Flex>
  );
}
