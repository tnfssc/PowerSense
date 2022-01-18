import { Heading, Box, CircularProgress, Button, useToast } from "@chakra-ui/react";
import { Redirect } from "wouter";

import { useCourse } from "../../use/courses";
import ERRORS from "../../constants/errors";

const CourseInfo: React.FC<{ courseId: number }> = ({ courseId }) => {
  const { course } = useCourse(courseId);
  const toast = useToast();
  return (
    <Box>
      <Heading>Course Info</Heading>
      {course.isLoading ? (
        <CircularProgress isIndeterminate />
      ) : course.error ? (
        course.error.details === ERRORS.SINGLE_ROW_NOT_FOUND.details ? (
          <Redirect to="/dashboard" />
        ) : (
          <Heading>Some error occured</Heading>
        )
      ) : (
        <Box>
          <Box h="10" />
          <Heading size="lg">{course.data!.name}</Heading>
          <Heading size="md">{course.data!.description}</Heading>
          <Box h="4" />
          <Button
            w="full"
            onClick={() => toast({ position: "bottom-left", title: "Coming Soon", status: "info" })}
            disabled={course.data!.registered}
          >
            {course.data!.registered ? "Already registered" : "Register"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CourseInfo;
