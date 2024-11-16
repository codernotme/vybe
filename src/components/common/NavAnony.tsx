"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@nextui-org/navbar";
import { usePathname } from "next/navigation"; // Assuming usePathname is a hook to get the current pathname
import styled from "styled-components";
import { User2Icon, VenetianMask } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const NavbarAnonymous = () => {
  const pathname = usePathname();

  const paths = [
    {
      name: "Chat",
      href: "/anonymousChat",
      icon: <VenetianMask />,
      active: pathname === "/anonymousChat"
    }
    // Add more paths here if needed
  ];
  const user = useQuery(api.users.get);

  if (user?.role === "member" || user?.role === "tech") {
  return (
    <main className="flex flex-row justify-between items-center h-auto w-auto px-2 py-2">
      <Navbar className="flex flex-col h-full w-auto border-none gap-4">
        <ul className="flex flex-row gap-4">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Link href={path.href}>
                <StyledWrapper>
                  <Button className="text-secondary-foreground">
                  <VenetianMask />
                  </Button>
                </StyledWrapper>
              </Link>
            </li>
          ))}
        </ul>
      </Navbar>
    </main>
  );
  } else {
    return null;
  }
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

export default NavbarAnonymous;
