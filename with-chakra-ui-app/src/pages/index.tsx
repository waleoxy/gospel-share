import Navbar from "../components/Navbar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import {
  MeQuery,
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
  useUpdatePostMutation,
} from "../generated/graphql";
import NextLink from "next/link";
import {
  background,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";
import UpdootSection from "../components/UpdootSection";
import { useRouter } from "next/router";
import Image from "next/image";
import JesusPng from "../image/jesus.jpg";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const router = useRouter();

  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: variables.limit,
      cursor: variables.cursor,
    },
  });

  const [, deletePost] = useDeletePostMutation();
  const [_data] = useMeQuery();

  const handleUpdate = (id: number, pId: number) => {
    console.log("_da", _data);
    if (_data?.data?.me?.id === id) {
      router.push(`/update-post/${pId}`);
    }
    return null;
  };

  if (!fetching && !data) {
    return <Box>Query failed</Box>;
  }

  return (
    <>
      <Navbar />
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <>
          <Flex justify={"space-evenly"} p={"16"} alignItems={"flex-start"}>
            <VStack
              ml={"20"}
              mb={"20"}
              spacing={8}
              w={"600px"}
              align={"stretch"}>
              {" "}
              {data!.posts.posts.map((p) =>
                !p ? null : (
                  <Box
                    background={"blue.100"}
                    textColor={"gray.900"}
                    key={p.id}
                    p={5}
                    minW={"600"}
                    maxW={"900"}
                    shadow="md"
                    borderRadius={"lg"}
                    borderWidth="2px">
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}>
                      <Flex justifyContent={"flex-start"} alignItems={"center"}>
                        <UpdootSection post={p} />
                        <Box maxW={"md"}>
                          <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                            <Link>
                              <Heading fontSize={"xl"}>{p.title}</Heading>
                            </Link>
                          </NextLink>

                          <Text color={"darkblue"} textTransform={"capitalize"}>
                            Post by: {p.creator.username}
                          </Text>
                          <Text mt={4} color={"blackAlpha.900"}>
                            {p.textSnippet}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex
                        direction={"column"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}>
                        {" "}
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleUpdate(p.creatorId, p.id)}>
                          <EditIcon
                            fontSize={"medium"}
                            color={"blue.600"}
                            w={"6"}
                            h={"6"}
                          />
                        </IconButton>
                        <IconButton aria-label="delete">
                          <DeleteIcon
                            fontSize={"medium"}
                            color={"red.600"}
                            w={"6"}
                            h={"6"}
                            onClick={() => {
                              deletePost({ id: p.id });
                            }}
                          />
                        </IconButton>
                      </Flex>
                    </Flex>
                    {p.pixUrl && (
                      <Box h={"64"}>
                        <img
                          src={p.pixUrl}
                          style={{ height: "250px", width: "350px" }}
                          alt="pix"
                        />
                      </Box>
                    )}
                  </Box>
                )
              )}
            </VStack>{" "}
            <VStack>
              <Box h={"20"} w={"320px"} position={"relative"}>
                <Image
                  src={JesusPng}
                  height="90px"
                  width="320px"
                  objectFit="fill"
                />
                <Text
                  position={"absolute"}
                  color={"crimson "}
                  top={"14"}
                  left={"2"}
                  fontSize={"xl"}
                  fontWeight={"bold"}>
                  Community Lists
                </Text>
              </Box>
              <Box
                w={"320px"}
                h={"700px"}
                mr={"20"}
                background={"blue.100"}
                textColor={"gray.900"}
                p={5}
                shadow="md"
                borderRadius={"lg"}
                borderWidth="2px"></Box>
            </VStack>
          </Flex>
        </>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          {" "}
          <Button
            isLoading={fetching}
            background="darkcyan"
            m="auto"
            mb={6}
            variant={"outline"}
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor:
                  data.posts.posts[data.posts.posts.length - 1].created_at,
              })
            }>
            More Post
          </Button>
        </Flex>
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
