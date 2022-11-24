import * as React from "react";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  VStack,
} from "@chakra-ui/react";
import InputField from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { objToMap } from "../utils/objToMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import Layout from "../components/Layout";

interface RegisterProps {}

const Register: React.FunctionComponent<RegisterProps> = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Container maxW="md" mt={"20"} background={"gray.900"} padding={"6"}>
      <Formik
        initialValues={{
          password: "",
          username: "",
          email: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(objToMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={3} align="flex-start">
              <InputField
                name="username"
                label="Username"
                placeholder="Username"
              />
              <InputField name="email" label="Email" placeholder="Email" />
              <InputField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
              <Checkbox
                borderColor="gray.200"
                color="gray.800"
                id="rememberMe"
                name="rememberMe"
                colorScheme="purple">
                Remember me?
              </Checkbox>
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="teal"
                width="full">
                Register
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
