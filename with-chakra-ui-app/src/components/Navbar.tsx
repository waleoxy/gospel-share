import { Avatar, Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import * as React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import gsLogo from "../image/gospelSharLogo.png";
import { PlusSquareIcon } from "@chakra-ui/icons";

interface NavbarProps {}

const Navbar: React.FunctionComponent<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  let body = null;
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box textTransform={"capitalize"} mr={2}>
          {data.me.username}
        </Box>
        <Button
          onClick={() => logout({})}
          isLoading={logoutFetching}
          variant="link">
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      position="sticky"
      zIndex={2}
      top={0}
      bg="cyan.900"
      padding={2}
      alignItems={"center"}>
      <NextLink href="/">
        <Link>
          <Box display={"flex"} alignItems={"center"}>
            <Image
              style={{ marginTop: "2px" }}
              src={gsLogo}
              width="22px"
              height="26px"
            />
            <Heading fontSize={"3xl"}>GospelShare</Heading>
          </Box>
        </Link>
      </NextLink>
      <NextLink href={`/create-post`}>
        <Link>
          <Button ml={"8"} mt={"2"} variant={"ghost"}>
            <PlusSquareIcon />
            Share a post
          </Button>
        </Link>
      </NextLink>
      <Flex ml={"auto"} alignItems={"center"} gap={"2"}>
        <Avatar h={"6"} w={"6"} cursor={"pointer"} />
        {body}
      </Flex>
    </Flex>
  );
};

export default Navbar;
