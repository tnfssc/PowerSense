import { Heading, Box, CircularProgress, Button, useToast } from "@chakra-ui/react";
import { Redirect } from "wouter";

import { useCourse } from "../../use/courses";
import ERRORS from "../../constants/errors";

const CourseInfo: React.FC<{ courseId: number }> = ({ courseId }) => {
  const { course, register } = useCourse(courseId);
  const toast = useToast();
  const handleRegister = async () => {
    try {
      await register.mutateAsync();
      toast({
        title: "Success",
        description: "You have successfully registered for this course.",
        status: "success",
        position: "bottom-left",
      });
    } catch (error) {
      toast({
        title: "Couldn't register",
        status: "error",
        position: "bottom-left",
      });
    }
  };
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
          <Button w="full" onClick={handleRegister} disabled={course.data!.registered} isLoading={register.isLoading}>
            {course.data!.registered ? "Already registered" : "Register"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CourseInfo;
