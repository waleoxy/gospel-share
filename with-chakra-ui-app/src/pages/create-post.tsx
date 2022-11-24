import { AttachmentIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, Flex, VStack, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import * as React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import PixInsertModal from "../components/pixModal";
import { storage } from "../firebase";
import { uploadString, ref, getDownloadURL } from "@firebase/storage";
import {
  useCreatePostMutation,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import useIsAuth from "../utils/useIsAuth";

const CreatePost: React.FunctionComponent<{}> = ({}) => {
  const router = useRouter();
  const [pixToPost, setPixToPost] = React.useState(null as any);
  const [isPix, setIsPix] = React.useState(false);
  const [pixUrl, setPixUrl] = React.useState("");

  const [, createPost] = useCreatePostMutation();

  const addPixToPost = (event: { target: { files: Blob[] } }) => {
    const fileReader = new FileReader();
    if (event.target.files[0]) {
      fileReader.readAsDataURL(event.target.files[0]);
    }
    fileReader.onload = (readerEvent) => {
      setPixToPost(readerEvent.target?.result);
    };

    setIsPix(true);
  };

  useIsAuth();

  return (
    <>
      {" "}
      <Navbar />
      <Formik
        initialValues={{
          title: "",
          text: "",
          pixUrl: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          if (pixToPost) {
            const storageRef = ref(storage, `${pixToPost?.slice(0, 50)}`);
            const uploadTask = uploadString(storageRef, pixToPost, "data_url");
            uploadTask.then(async function () {
              const downloadURL = await getDownloadURL(storageRef);
              console.log("File available at", downloadURL);
              values.pixUrl = downloadURL;
              if (values?.title?.length !== 0) {
                console.log("val", values, pixToPost);
                const { error } = await createPost(values);
                if (!error) {
                  router.push("/");
                  setIsPix(false);
                }
              }
            });
          } else if (values?.title?.length !== 0) {
            // setPixUrl(downloadURL);

            console.log("val", values, pixToPost);
            const { error } = await createPost(values);
            if (!error) {
              router.push("/");
              setIsPix(false);
            }
          }

          // values.file = "downloadURL";
        }}>
        {({ isSubmitting }) => (
          <Box
            m={"auto"}
            mt={"12"}
            maxW={"container.md"}
            padding={"6"}
            background={"blackAlpha.600"}
            borderRadius={"md"}
            boxShadow={"dark-lg"}>
            <Form>
              <VStack spacing={3} align="flex-start">
                <InputField
                  type="text"
                  name="title"
                  label="Title"
                  placeholder="Title"
                />
                <InputField
                  textarea
                  type="textarea"
                  name="text"
                  label="Body"
                  height={"150px"}
                  placeholder="Text..."
                />

                <AttachmentIcon />
                <input onChange={addPixToPost as any} type="file" />
                {isPix && <PixInsertModal pixToPost={pixToPost} />}

                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="teal"
                  width="full">
                  Create Post
                </Button>
              </VStack>
            </Form>
          </Box>
        )}
      </Formik>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
