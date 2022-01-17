import { ReactNode, ReactText } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBoolean,
} from "@chakra-ui/react";
import { FiHome, FiCompass, FiMenu, FiUser, FiLoader, FiUsers, FiPhone } from "react-icons/fi";
import { IconType } from "react-icons";
import { Link as WouterLink } from "wouter";

import useAuth from "../use/auth";
import Link from "./Link";
import supabase from "../lib/supabase";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
  protected?: boolean;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, route: "/" },
  { name: "Dashboard", icon: FiCompass, route: "/dashboard", protected: true },
  { name: "Profile", icon: FiUsers, route: "/profile", protected: true },
  { name: "Verify Phone", icon: FiPhone, route: "/verify-phone", protected: true },
];

export default function SidebarWithHeader({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Drawer
        autoFocus={false} // eslint-disable-line jsx-a11y/no-autofocus
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} onClose={onClose} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Power Sense
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.route} icon={link.icon} href={link.route} protected={link.protected} onClick={onClose}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  href: string;
  onClick?: (..._: never) => void;
  protected?: boolean;
}
const NavItem = ({ icon, children, href, onClick, protected: protectedRoute = false, ...rest }: NavItemProps) => {
  const user = useAuth();
  if (!user && protectedRoute) return <></>;
  return (
    <Link href={href} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }} onClick={onClick}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="22"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  onClose: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const user = useAuth();
  const [isLoading, setLoading] = useBoolean(false);
  const handleSignOut = async () => {
    setLoading.on();
    await supabase.auth.signOut();
    setLoading.off();
  };
  const handleSignIn = async () => {
    setLoading.on();
    supabase.auth.signIn({ provider: "google" });
    setLoading.off();
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text display={{ base: "flex", md: "none" }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Power Sense
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              disabled={isLoading}
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
              marginRight={2}
            >
              {isLoading ? <FiLoader size={24} /> : <FiUser size={24} />}
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {user ? (
                <WouterLink to="/profile">
                  <MenuItem>Profile</MenuItem>
                </WouterLink>
              ) : null}
              {user ? (
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
              ) : (
                <MenuItem onClick={handleSignIn}>Sign in</MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
