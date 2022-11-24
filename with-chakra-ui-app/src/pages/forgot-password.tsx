import { Flex, VStack, Checkbox, Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import InputField from "../components/InputField";
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { objToMap } from "../utils/objToMap";
import NextLink from "next/link";
import Layout from "../components/Layout";

const ForgotPassword: React.FunctionComponent<{}> = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = React.useState(false);

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={async (values) => {
          const response = await forgotPassword(values);

          setComplete(true);
        }}>
        {({ isSubmitting }) =>
          complete ? (
            <Box color="blue">
              A message has been sent to the submitted email{" "}
            </Box>
          ) : (
            <Form>
              <VStack spacing={3} align="flex-start">
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="email"
                />
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="teal"
                  width="full">
                  Forgot Password
                </Button>
              </VStack>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
