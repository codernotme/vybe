"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Navbar } from "@nextui-org/navbar";
import { usePathname } from "next/navigation"; // Assuming usePathname is a hook to get the current pathname
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import styled from "styled-components";

const NavbarConvo = () => {
  const pathname = usePathname();

  const paths = [
    {
      name: "Chat",
      href: "/chat/conversations",
      icon: <ChatBubbleIcon />,
      active: pathname === "/chat/conversations"
    }
    // Add more paths here if needed
  ];

  return (
    <main className="flex flex-row justify-between items-center h-auto w-auto px-2 py-2">
      <Navbar className="flex flex-col h-full w-auto border-none gap-4">
        <ul className="flex flex-row gap-4">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href}>
                <StyledWrapper>
                  <Button className="text-secondary-foreground">
                    <ChatBubbleIcon className="h-5 w-5" />
                  </Button>
                </StyledWrapper>
              </Link>
            </li>
          ))}
        </ul>
      </Navbar>
    </main>
  );
};

const StyledWrapper = styled.div`
  Button {
    background: none;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

  Button:hover {
    background: rgba(170, 170, 170, 0.062);
    transition: 0.5s;
  }
`;

export default NavbarConvo;
