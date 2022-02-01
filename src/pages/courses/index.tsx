import { Flex, Heading, CircularProgress } from "@chakra-ui/react";

import useCourses from "../../use/courses";

import CoursesTable from "./courses/table";

export default function Dashboard() {
  const courses = useCourses(true);
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading mb="4">All Courses Page</Heading>
      {courses.isLoading ? (
        <CircularProgress isIndeterminate />
      ) : courses.error ? (
        <Heading size="md">Error occured</Heading>
      ) : (
        <CoursesTable courses={courses.data ?? []} />
      )}
    </Flex>
  );
}
