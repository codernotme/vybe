"use client";
import { BellIcon, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Request from "./Request";
import { Badge } from "../ui/badge";
import styled from "styled-components";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalContent } from "@nextui-org/modal";
import { useDisclosure } from "@nextui-org/react";
function Notification() {
  const requests = useQuery(api.requests.get) || "";
  const requestsCount = useQuery(api.requests.count);

  // State for controlling modal visibility
  const {isOpen, onOpen, onOpenChange} = useDisclosure();


  const paths = useMemo(
    () => [
      {
        name: "Notifications",
        href: "/notification",
        icon: <BellIcon />,
        count: requestsCount && requestsCount > 0 ? requestsCount : null,
      },
    ],
    [requestsCount]
  );

  const path = paths[0];

  return (
    <main>
      <HoverCard>
        {/* HoverCardTrigger for hover interaction */}
        <HoverCardTrigger>
          <StyledWrapper>
            <Button onPress={onOpen}>
              <div className="relative align-middle cursor-pointer text-secondary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="currentColor"
                    d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7zm-2 0v-7a6 6 0 1 0-12 0v7h12zm-9 4h6v2H9v-2z"
                  />
                </svg>{" "}
                {path.count && (
                  <Badge className="absolute top-0 right-0 px-2">
                    {path.count}
                  </Badge>
                )}
              </div>
            </Button>
          </StyledWrapper>
        </HoverCardTrigger>

        {/* HoverCardContent for hover preview */}
        <HoverCardContent className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg max-h-72 overflow-auto p-4 bg-background shadow-lg rounded-md">
          {requests ? (
            requests.length > 0 ? (
              requests.map((request) => (
                <Request
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageUrl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              ))
            ) : (
              <p className="w-full h-full flex items-center justify-center text-gray-500">
                No requests found
              </p>
            )
          ) : null}
        </HoverCardContent>
      </HoverCard>

      {/* Modal for click interaction */}
      <Modal
        isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}
        placement="center"
        className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg max-h-72 overflow-auto p-4 bg-background shadow-lg rounded-md"
      >
        <ModalContent>
        {(onClose) => (
          <>
        <ModalHeader className="flex flex-col gap-1">Notifications</ModalHeader>
        <ModalBody>
          {requests ? (
            requests.length > 0 ? (
              requests.map((request) => (
                <Request
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageUrl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No requests found</p>
            )
          ) : (
            <Loader2 className="animate-spin" />
          )}
        </ModalBody>
        <ModalFooter>
          <Button onPress={onClose} color="danger" variant="light">Close</Button>
        </ModalFooter>
          </>
        )}
          </ModalContent>
      </Modal>
    </main>
  );
}

const StyledWrapper = styled.div`
  Button {
    background: none;
    border: none;
    padding: 15px;
    border-radius: 10px;
    cursor: pointer;
  }

  Button:hover {
    background: rgba(170, 170, 170, 0.062);
    transition: 0.5s;
  }
`;

export default Notification;
