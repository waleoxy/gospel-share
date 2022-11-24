import {
  Box,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { usePostQuery, useUserPostsQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post = () => {
  const [pId, setPId] = useState("");

  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const handleChangeText = (id: number) => {
    let uId = id.toString();
    setPId(uId);
  };

  useEffect(() => {}, []);

  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: pId.length === 0 ? intId : parseInt(pId),
    },
  });

  console.log("dat", data);

  const [userPostData] = useUserPostsQuery({
    variables: {
      limit: 15,
      id: data?.post?.creator.id as number,
    },
  });

  if (fetching) {
    return (
      <>
        <Navbar />
        <VStack>
          <Box>Loading...</Box>
        </VStack>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <Flex padding={"16"} justifyContent={"center"} alignItems={"flex-start"}>
        <Box display={"flex"} justifyContent={"space-between"} w={"900px"}>
          <Box maxW={"600px"}>
            <Heading>{data?.post?.title}</Heading>
            <Box>{data?.post?.text}</Box>
          </Box>
          {data?.post?.pixUrl && (
            <Box h={"64"}>
              <img
                src={data.post.pixUrl}
                style={{
                  height: "280px",
                  width: "350px",
                  marginTop: "20px",
                }}
                alt="pix"
              />
            </Box>
          )}
        </Box>{" "}
        <Box mt={"8"}>
          <Heading fontSize={"lg"} p={"2"} ml={"6"}>
            All posts by {data?.post?.creator.username}
          </Heading>
          <Flex
            direction={"column"}
            h={"80"}
            ml={"6"}
            pt={"3"}
            border={"1px"}
            width="250px"
            overflow={"auto"}>
            {userPostData.fetching ? (
              <div>Loading...</div>
            ) : (
              userPostData.data?.userPosts.posts.map((uPost) => (
                <List ml={"3"} pl={"5"}>
                  <ListItem listStyleType={"initial"} mt={"0.5"} key={uPost.id}>
                    <Link onClick={() => handleChangeText(uPost.id)}>
                      {uPost.title}
                    </Link>
                  </ListItem>
                </List>
              ))
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
