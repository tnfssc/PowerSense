import { Flex, Heading, CircularProgress, Box, Button } from "@chakra-ui/react";

import Link from "../../components/Link";
import CoursesTable from "./courses/table";

import useAuth from "../../use/auth";
import useProfile from "../../use/profile";
import useCourses from "../../use/courses";

export default function Dashboard() {
  const user = useAuth()!;
  const { profile } = useProfile(user.id);
  const courses = useCourses();
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading>Dashboard Page</Heading>
      {profile.isLoading ? (
        <CircularProgress isIndeterminate />
      ) : (
        <Heading size="md">
          Signed in as <Link href="/profile">{profile.error ? user.email : profile.data?.displayName}</Link>
        </Heading>
      )}
      <Box h="10" />
      {courses.isLoading ? (
        <CircularProgress isIndeterminate />
      ) : courses.error ? (
        <Heading size="md">Error occured</Heading>
      ) : (
        <>
          <CoursesTable courses={courses.data ?? []} />
          <Flex mt="4">
            <Link href="/courses">
              <Button>View all courses</Button>
            </Link>
          </Flex>
        </>
      )}
    </Flex>
  );
}
