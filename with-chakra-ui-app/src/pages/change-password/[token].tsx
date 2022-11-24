import { Flex, VStack, Checkbox, Button, Box, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../../components/InputField";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { objToMap } from "../../utils/objToMap";
import NextLink from "next/link";
import Layout from "../../components/Layout";

const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          newPassword: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            const errorMap = objToMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <VStack spacing={3} align="flex-start">
              <InputField
                name="newPassword"
                label="New Password"
                placeholder="New Password"
                type="password"
              />
              {tokenError ? (
                <Flex>
                  <Box mr={2} color="red">
                    {tokenError}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Link>reset token</Link>
                  </NextLink>
                </Flex>
              ) : null}
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
                Change Password
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
