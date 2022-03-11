import {
  Flex,
  Button,
  ButtonGroup,
  CircularProgress,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";

import { useKey, useCourse } from "../../../use/courses";
import { useState, useEffect } from "react";
import { Paper } from "../../../../api/types/questionpapers/solutions.d";

export default function SubmitSoln({ courseId }: { courseId: number }) {
  const { data, error, isFetching } = useKey(courseId);
  const toast = useToast({ position: "bottom-left" });
  const {
    course: { data: course },
  } = useCourse(courseId);
  const [answers, setAnswers] = useState<Paper>([]);
  useEffect(() => {
    if (data && course?.answers !== undefined) {
      const [, questions] = Object.entries(data)[0];
      setAnswers(course?.answers ?? questions);
    }
  }, [data, course?.answers]);
  if (isFetching) return <CircularProgress isIndeterminate />;
  if (error || !data || !course)
    return (
      <Flex flexDir="column" w="100%" alignItems="center">
        Error
      </Flex>
    );
  const [questionPaperCode] = Object.entries(data)[0];
  const handleSave = async () => {
    const { status } = await fetch("/api/courses/questionpaper/save", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ answers, course_id: courseId }),
    });
    if (status === 200) {
      toast({
        title: "Success",
        description: "Your answers have been saved",
        status: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
      });
    }
  };
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      <Heading>Code: {questionPaperCode}</Heading>
      {answers.map((answer, index) => (
        <Flex key={index} flexDir="column">
          <Heading size="sm">Question: {index + 1}</Heading>
          <Flex flexDir="column">
            {answer.solutions.map((solution, _index) => (
              <InputGroup key={_index}>
                <InputLeftAddon>{solution.name}</InputLeftAddon>
                <Input
                  placeholder="Value"
                  value={solution.value}
                  onChange={(e) => {
                    answers[index].solutions[_index].value = e.target.value;
                    setAnswers((p) => [...p]);
                  }}
                />
                <InputRightAddon>{solution.units}</InputRightAddon>
              </InputGroup>
            ))}
          </Flex>
        </Flex>
      ))}
      <ButtonGroup>
        <Button onClick={handleSave}>Save</Button>
      </ButtonGroup>
    </Flex>
  );
}
