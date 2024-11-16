"use client";
import React from "react";
import AnonymousInput from "./AnonymousChat";
import AnonymousBody from "./AnonymousBody";
import { Card } from "@nextui-org/react";

const AnonymousPage = () => {
  return (
    <Card className="flex flex-col h-full max-w-4xl mx-auto p-4  rounded-md shadow-lg">
      <AnonymousBody />
      <AnonymousInput />
    </Card>
  );
};

export default AnonymousPage;
