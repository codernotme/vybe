"use client";
import { Card, CardBody } from "@nextui-org/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import GitHubLink from "./_components/GithubLink";
import GitHubProjects from "./_components/GithubProject";

const Project = () => {
  const user = useQuery(api.users.get);
  if (user?.role === "tech") {
    return (
      <Card className="flex flex-col items-center justify-center bg-secondary p-4 mt-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          GitHub Project Management
        </h1>
        <CardBody>
          <GitHubLink />
          {/*          <GitHubProjects />
           */}{" "}
        </CardBody>
      </Card>
    );
  }
};

export default Project;
