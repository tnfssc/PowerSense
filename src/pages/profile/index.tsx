import { Flex, Heading, useBoolean, CircularProgress, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";
import { useLocation } from "wouter";

import useAuth from "../../use/auth";
import supabase from "../../lib/supabase";

type Profile = {
  id: string;
  displayName: string;
  designation: string;
  role: string;
  organization: string;
  department: string;
  rollNumber: string;
  phone: string;
  upiId: string;
};

const validationSchema = yup.object({
  id: yup.string().required("ID is required"),
  displayName: yup.string().required("Display name is required"),
  designation: yup.string(),
  role: yup.string(),
  organization: yup.string(),
  department: yup.string(),
  rollNumber: yup.string(),
  phone: yup.string(),
  upiId: yup.string(),
});

export default function Profile() {
  const user = useAuth();
  const toast = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setLoading] = useBoolean(false);
  const [profile, setProfile] = useState<Profile>({
    id: user?.id as string,
    displayName: "",
    designation: "",
    role: "",
    organization: "",
    department: "",
    rollNumber: "",
    phone: "",
    upiId: "",
  });
  useEffect(() => {
    setLoading.on();
    supabase
      .from<Profile>("profiles")
      .select("*")
      .single()
      .then(({ error, data }) => {
        if (error || !data) {
          console.error("user not found", { error });
        } else {
          setProfile(data);
        }
      })
      .then(() => setLoading.off());
  }, [setLoading, user]);

  const handleSubmit = async (values: Profile) => {
    const { error } = await supabase.from<Profile>("profiles").upsert(values);
    if (error) console.error("error", error);
    else setLocation("/dashboard");
    toast({
      title: "Profile updated",
      isClosable: true,
      position: "bottom-left",
    });
  };

  if (isLoading) return <CircularProgress isIndeterminate />;
  return (
    <Flex flexDir="column">
      <Heading>Profile Page</Heading>
      <Formik initialValues={profile} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <InputControl name="displayName" label="Name" />
            <InputControl name="designation" label="Designation" />
            <InputControl name="role" label="Role" />
            <InputControl name="organization" label="Organization" />
            <InputControl name="department" label="Department" />
            <InputControl name="rollNumber" label="Roll Number" />
            <InputControl name="phone" label="Phone" />
            <InputControl name="upiId" label="UPI ID" />
            <SubmitButton isLoading={isSubmitting}>Submit</SubmitButton>
          </Form>
        )}
      </Formik>
    </Flex>
  );
}
