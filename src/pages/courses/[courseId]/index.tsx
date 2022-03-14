import { chakra, Heading, Box, CircularProgress, Button, useToast, useBoolean, Link, Flex } from "@chakra-ui/react";
import { Redirect, useLocation } from "wouter";
import { useQueryClient } from "react-query";

import { useCourse } from "../../../use/courses";
import useAuth from "../../../use/auth";
import usePhones from "../../../use/phones";
import ERRORS from "../../../constants/errors";

import { isIITH } from "../../../../api-utils/common/iith";

const CourseInfo: React.FC<{ courseId: number }> = ({ courseId }) => {
  const user = useAuth()!;
  const { course, register } = useCourse(courseId);
  const queryClient = useQueryClient();
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
      setLoading.on();
      const res = await fetch("/api/courses/questionpaper/download", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ course_id: courseId }),
      });
      setLoading.off();
      queryClient.invalidateQueries(`course-${courseId}`);
      if (res.status === 404)
        return toast({
          title: "Coming soon",
          status: "info",
          position: "bottom-left",
        });
      if (res.status === 200) {
        const question_paper = (await res.json()).question_paper as string;
        window.open(question_paper, "_blank", "noopener noreferrer");
      } else {
        return toast({
          title: "Couldn't download",
          status: "error",
          position: "bottom-left",
        });
      }
      return;
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
          <Flex justifyContent="space-between">
            <Heading size="md">{course.data!.name}</Heading>
          </Flex>
          <chakra.p>{course.data!.description}</chakra.p>
          <Box h="4" />
          {!course.data!.registered ? (
            <Button onClick={handleRegister} isLoading={register.isLoading}>
              Register
            </Button>
          ) : (
            <>
              <chakra.p>
                {course.data?.question_paper_downloaded_at
                  ? `First downloaded on ${new Date(course.data.question_paper_downloaded_at).toLocaleString("en-IN")}`
                  : ""}
              </chakra.p>
              <Button onClick={handleDownloadQuestionPaper} isLoading={register.isLoading || loading}>
                {course.data?.paid ? `Download Question Paper` : `Pay Rs.${isIITH(user) ? "1.00" : "100.00"}`}
              </Button>
            </>
          )}
        </Box>
      )}
      {/* <Box h="4" />
      {course.data?.question_paper_downloaded_at && (
        <Link href={`/courses/${courseId}/submit`}>
          <Button>Submit Solution</Button>
        </Link>
      )} */}
    </Box>
  );
};

export default CourseInfo;
