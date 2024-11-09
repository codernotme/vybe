"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useNavigation } from "../../hooks/useNavcard";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { motion } from "framer-motion";
import { ArrowBigRightDashIcon, X } from "lucide-react";
import styled from "styled-components";

const DesktopNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const paths = useNavigation();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Collapsible Card for desktop view */}
      <motion.div
        animate={{ width: isCollapsed ? "auto" : "250px" }}
        className="hidden lg:flex lg:flex-col lg:justify-between lg:h-full lg:w-auto lg:px-2 lg:py-4 "
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Card className="flex flex-col h-full w-auto px-4 py-6 gap-4 mx-auto">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleNavbar}
            className="self-end mb-4"
          >
            {isCollapsed ? <ArrowBigRightDashIcon /> : <X />}
          </Button>
          <nav>
            <ul className="flex flex-col gap-4">
              {paths.map((path, id) => (
                <li key={id} className="relative">
                  <Link
                    href={path.href}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <StyledWrapper>
                          <Button
                            size="icon"
                            variant={path.active ? "default" : "outline"}
                            className="text-secondary-foreground"
                          >
                            {path.icon}
                          </Button>
                        </StyledWrapper>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent>
                          <span>{path.name}</span>
                        </TooltipContent>
                      )}
                    </Tooltip>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="ml-2 text-base"
                      >
                        <Link href={path.href}>{path.name}</Link>
                      </motion.span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Card>
      </motion.div>

      {/* Bottom navigation for mobile view */}
      <div className="fixed bottom-0 left-0 right-0 w-full h-14 bg-background lg:hidden z-50">
        <Card className="flex flex-col h-full w-auto gap-4 mx-auto">
          <div className="flex items-center justify-around h-full">
            {paths.map((path, id) => (
              <Link
                key={id}
                href={path.href}
                className="flex items-center gap-2"
              >
                <Tooltip>
                  <TooltipTrigger>
                    <StyledWrapper>
                      <Button
                        size="icon"
                        variant={path.active ? "default" : "outline"}
                        className="text-secondary-foreground"
                      >
                        {path.icon}
                      </Button>
                    </StyledWrapper>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{path.name}</span>
                  </TooltipContent>
                </Tooltip>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
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

export default DesktopNav;
