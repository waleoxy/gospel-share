import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import * as React from "react";
import {
  PostSnippetFragment,
  PostsQuery,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FunctionComponent<UpdootSectionProps> = ({
  post,
}) => {
  const [{ data }, vote] = useVoteMutation();
  console.log("vt", data?.vote);

  return (
    <Flex
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      mr={4}>
      <IconButton
        aria-label="upVote"
        background={post.voteStatus === 1 ? "green.300" : "azure"}
        onClick={() => {
          vote({
            postId: post.id,
            value: 1,
          });
        }}>
        <ChevronUpIcon w={"8"} h={"auto"} />
      </IconButton>
      <Text fontSize={"lg"} fontWeight={"semibold"}>
        {post.points}
      </Text>{" "}
      <IconButton
        aria-label="downVote"
        background={post.voteStatus === -1 ? "red.300" : "azure"}
        onClick={() => {
          vote({
            postId: post.id,
            value: -1,
          });
        }}>
        <ChevronDownIcon w={"8"} h={"auto"} />
      </IconButton>
    </Flex>
  );
};

export default UpdootSection;
