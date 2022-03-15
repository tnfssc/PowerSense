import {
  Flex,
  Button,
  ButtonGroup,
  CircularProgress,
  Heading,
  RadioGroup,
  Radio,
  useToast,
  HStack,
} from "@chakra-ui/react";

import { useKey, useCourse } from "../../../use/courses";
import { useState, useEffect } from "react";
import { MCA } from "../../../../api/types/questionpapers/solutions.d";

export default function SubmitSoln({ courseId }: { courseId: number }) {
  const { data, error, isFetching } = useKey(courseId);
  const toast = useToast({ position: "bottom-left" });
  const {
    course: { data: course },
  } = useCourse(courseId);
  const [answers, setAnswers] = useState<Array<MCA>>([]);
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
      <Heading mb="6">Code: {questionPaperCode}</Heading>
      {answers.map((answer, index) => (
        <Flex key={index} mb="4">
          <Heading size="sm" mb="2">
            Question: {index + 1}
          </Heading>
          <RadioGroup
            ml="4"
            name={`${index}`}
            value={answer}
            onChange={(v) => {
              answers[index] = v as MCA;
              setAnswers((p) => [...p]);
            }}
          >
            <HStack>
              <Radio value="a">a</Radio>
              <Radio value="b">b</Radio>
              <Radio value="c">c</Radio>
              <Radio value="d">d</Radio>
            </HStack>
          </RadioGroup>
          {/* <Flex flexDir="column">
            {answer.solutions.map((solution, _index) => (
              <InputGroup key={_index} mb="2">
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
          </Flex> */}
        </Flex>
      ))}
      <ButtonGroup>
        <Button onClick={handleSave}>Save</Button>
      </ButtonGroup>
    </Flex>
  );
}
