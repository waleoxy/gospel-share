import * as React from "react";
import { Form, Formik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Link,
  VStack,
} from "@chakra-ui/react";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { objToMap } from "../utils/objToMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import Layout from "../components/Layout";

const Login: React.FunctionComponent<{}> = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Container maxW="md" mt={"20"} background={"gray.900"} padding={"6"}>
      <Formik
        initialValues={{
          password: "",
          usernameOrEmail: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(objToMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={3} align="flex-start">
              <InputField
                name="usernameOrEmail"
                label="Username or Email"
                placeholder="Username or Email"
              />
              <InputField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
              <Flex w={"full"} justifyContent={"space-between"}>
                <Checkbox
                  borderColor="gray.200"
                  color="whiteAlpha.500"
                  id="rememberMe"
                  name="rememberMe"
                  colorScheme="purple">
                  Remember me
                </Checkbox>
                <NextLink href="/forgot-password">
                  <Link color="red">forgot password?</Link>
                </NextLink>
              </Flex>

              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="teal"
                width="full">
                Login
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
