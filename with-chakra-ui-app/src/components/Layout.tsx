import { Flex, Box, Stack } from "@chakra-ui/react";
import * as React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  variant: "small" | "regular";
  children: any;
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  variant,
}) => {
  return (
    <Stack background={"wheat"}>
      <Navbar />
      {children}
    </Stack>
  );
};

export default Layout;
