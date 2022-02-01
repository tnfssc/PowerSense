import { Flex, Heading, CircularProgress, useToast, Button } from "@chakra-ui/react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";

import useAuth from "../../use/auth";
import usePhones from "../../use/phones";
import useProfile, { ProfileType } from "../../use/profile";

import "./index.css";
import Link from "../../components/Link";

const validationSchema = yup.object({
  id: yup.string().required("ID is required"),
  displayName: yup.string().required("Display name is required"),
  designation: yup.string(),
  role: yup.string(),
  organization: yup.string(),
  department: yup.string(),
  rollNumber: yup.string(),
  upiId: yup.string(),
});

export default function Profile() {
  const user = useAuth()!;
  const toast = useToast();
  const {
    profile: { data: profile, isLoading },
    mutation: { mutate, isLoading: mutationLoading },
  } = useProfile(user?.id);

  const handleSubmit = (values: ProfileType) => {
    mutate(values, {
      onError: (error) => {
        toast({
          status: "error",
          title: error.message,
          position: "bottom-left",
        });
      },
      onSuccess: () => {
        toast({
          status: "success",
          title: "Profile updated",
          position: "bottom-left",
        });
      },
    });
  };
  const { phone } = usePhones(user.id);

  if (isLoading) return <CircularProgress isIndeterminate />;
  return (
    <Flex flexDir="column" alignItems="center" w="full">
      <Heading>Profile Page</Heading>
      {user?.email?.endsWith("@iith.ac.in") ? <Heading size="md">You belong to IITH</Heading> : <></>}
      <Flex w="full" justifyContent="flex-end">
        <Link href="/verify-phone">
          <Button isLoading={phone.isLoading}>{phone.data?.phone ?? "Link phone"}</Button>
        </Link>
      </Flex>
      <Formik initialValues={profile!} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="form">
            <InputControl name="displayName" label="Name" />
            <InputControl name="designation" label="Designation" />
            <InputControl name="role" label="Role" />
            <InputControl name="organization" label="Organization" />
            <InputControl name="department" label="Department" />
            <InputControl name="rollNumber" label="Roll Number" />
            {/* <InputControl name="upiId" label="UPI ID" /> */}
            <SubmitButton w="full" isLoading={mutationLoading}>
              Submit
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </Flex>
  );
}
