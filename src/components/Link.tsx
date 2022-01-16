import { Link as ChakraLink, LinkProps as ChakraLinkProps } from "@chakra-ui/react";
import { LinkProps as RouterLinkProps, Link as RouterLink } from "wouter";

export default function Link({ href = "", ...props }: RouterLinkProps & ChakraLinkProps) {
  return <ChakraLink as={RouterLink} to={href} href={href} {...props} />;
}
