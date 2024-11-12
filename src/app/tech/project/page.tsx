"use client";
import { Card, CardBody } from "@nextui-org/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import GitHubLink from "./_components/GithubLink";
import GitHubProjects from "./_components/GithubProject";

const Project = () => {
  // Fetch user data using the Convex API
  const user = useQuery(api.users.get);

  // Handle loading state
  if (user === undefined) {
    return <p>Loading...</p>;
  }

  // Handle case when user is not in the "tech" role
  if (user?.role !== "tech") {
    return <p>Access Denied: You do not have permission to view this page.</p>;
  }

  // Render the card for users with the "tech" role
  return (
    <Card className="flex flex-col h-auto w-full items-center justify-center bg-secondary mt-4">
      <h1 className="text-3xl font-bold mb-8 text-center p-4">
        GitHub Project Management
      </h1>
      <CardBody>
        {user?.githubUsername ? (
          <GitHubProjects />
        ) : (
          <GitHubLink />
        )}
      </CardBody>
    </Card>
  );
};

export default Project;
