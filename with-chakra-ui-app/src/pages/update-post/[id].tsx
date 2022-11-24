import { Box, Flex, VStack, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import * as React from "react";
import InputField from "../../components/InputField";
import Layout from "../../components/Layout";
import Navbar from "../../components/Navbar";
import {
  useCreatePostMutation,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import useIsAuth from "../../utils/useIsAuth";

const UpdatePost: React.FunctionComponent<{}> = ({}) => {
  const router = useRouter();
  const [, updatePost] = useUpdatePostMutation();

  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  useIsAuth();

  return (
    <>
      <Navbar />
      {fetching ? (
        <div>Loading...</div>
      ) : (
        <Formik
          initialValues={{
            title: data?.post?.title,
            text: data?.post?.text,
          }}
          onSubmit={async (values, { setErrors }) => {
            if (values?.title?.length !== 0) {
              const { error } = await updatePost({ id: intId, ...values });
              if (!error) {
                router.push("/");
              }
            }
          }}>
          {({ isSubmitting }) => (
            <Box
              m={"auto"}
              mt={"12"}
              maxW={"container.md"}
              padding={"6"}
              borderRadius={"md"}
              boxShadow={"dark-lg"}
              background={"blackAlpha.600"}>
              <Form>
                <VStack spacing={3} align="flex-start">
                  <InputField name="title" label="Title" placeholder="Title" />
                  <InputField
                    textarea
                    name="text"
                    height={"150px"}
                    label="Body"
                    placeholder="Text..."
                  />

                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    colorScheme="teal"
                    width="full">
                    Update Post
                  </Button>
                </VStack>
              </Form>
            </Box>
          )}
        </Formik>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(UpdatePost);
