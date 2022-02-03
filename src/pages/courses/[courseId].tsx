import { Heading, Box, CircularProgress, Button, useToast, useBoolean, Link } from "@chakra-ui/react";
import { Redirect, useLocation } from "wouter";

import { useCourse } from "../../use/courses";
import usePhones from "../../use/phones";
import ERRORS from "../../constants/errors";

const CourseInfo: React.FC<{ courseId: number }> = ({ courseId }) => {
  const { course, register } = useCourse(courseId);
  const [loading, setLoading] = useBoolean(false);
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
    if (course.data?.paid) {
      return toast({
        title: "Coming soon",
        status: "info",
        position: "bottom-left",
      });
    }
    setLoading.on();
    try {
      const res = await fetch("/api/courses/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
        }),
      });
      const body = await res.json();
      setLoading.off();
      if (res.status !== 200) {
        console.error({ res, body });
        throw new Error();
      }
      return toast({
        title: "Please click the link below to pay",
        description: <Link href={body.payment_link}>{body.payment_link}</Link>,
        position: "bottom-left",
        duration: null,
        isClosable: true,
        status: "info",
      });
    } catch (error) {
      setLoading.off();
      return toast({
        title: "Some error occurred",
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
          {!course.data!.registered ? (
            <Button w="full" onClick={handleRegister} isLoading={register.isLoading}>
              Register
            </Button>
          ) : (
            <Button
              disabled={!course.data!.payment_link}
              w="full"
              onClick={handleDownloadQuestionPaper}
              isLoading={register.isLoading || loading}
            >
              {course.data?.paid ? "Download Question Paper" : "Pay to Download the Question Paper"}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CourseInfo;
