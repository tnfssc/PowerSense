import { Heading, Box, CircularProgress, Button, useToast } from "@chakra-ui/react";
import { Redirect, useLocation } from "wouter";
import { useEffect } from "react";

import { useCourse } from "../../use/courses";
import usePhones from "../../use/phones";
import ERRORS from "../../constants/errors";

const CourseInfo: React.FC<{ courseId: number }> = ({ courseId }) => {
  useEffect(() => {
    fetch(`/api/courses/is-registered`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id: courseId }),
    });
  }, [courseId]);
  const { course, register } = useCourse(courseId);
  const toast = useToast();
  const { phone } = usePhones();
  const [, setLocation] = useLocation();
  const handleRegister = async () => {
    if (!phone.data?.phone) {
      setLocation("/verify-phone");
      return toast({
        title: "Please verify your phone number first",
        status: "error",
      });
    }
    try {
      await register.mutateAsync();
      return toast({
        title: "Success",
        description: "You have successfully registered for this course.",
        status: "success",
        position: "bottom-left",
      });
    } catch (error) {
      return toast({
        title: "Couldn't register",
        status: "error",
        position: "bottom-left",
      });
    }
  };

  const handleDownloadQuestionPaper = async () => {
    window.open(course.data!.payment_link!, "_blank", "noopener noreferrer");
    return toast({
      title: "Coming soon",
      status: "info",
      position: "bottom-left",
    });
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
          {!course.data!.registered ? (
            <Button w="full" onClick={handleRegister} isLoading={register.isLoading}>
              Register
            </Button>
          ) : (
            <Button
              disabled={!course.data!.payment_link}
              w="full"
              onClick={handleDownloadQuestionPaper}
              isLoading={register.isLoading}
            >
              Download Question Paper
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CourseInfo;
