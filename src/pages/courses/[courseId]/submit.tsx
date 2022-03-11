import { Flex, CircularProgress } from "@chakra-ui/react";

import { useKey } from "../../../use/courses";

export default function SubmitSoln({ courseId }: { courseId: number }) {
  const { data, error, isFetching } = useKey(courseId);
  if (isFetching) return <CircularProgress isIndeterminate />;
  if (error || !data)
    return (
      <Flex flexDir="column" w="100%" alignItems="center">
        Error
      </Flex>
    );
  return (
    <Flex flexDir="column" w="100%" alignItems="center">
      {courseId}
    </Flex>
  );
}
