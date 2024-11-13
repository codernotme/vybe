"use client";
import { Card, CardBody } from "@nextui-org/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import GitHubLink from "./_components/GithubLink";
import GitHubProjects from "./_components/GithubProject";
import RepoSelection from "./_components/RepoSelection";
import PersonalWorkspace from "./_components/PersonalWorkspace";
import { Id } from '../../../../convex/_generated/dataModel';
import SideNavR from "./_components/SideNavR";

const Project = () => {
  const user = useQuery(api.users.get);

  // Fetch user's project workspace(s) if user is defined
  const projectWorkspaces = useQuery(api.workspace.getProjectWorkspaces);
  const projectId = projectWorkspaces && projectWorkspaces[0]?._id; // Assume the first project workspace for now

  if (user === undefined || projectWorkspaces === undefined) {
    return <p>Loading...</p>;
  }

  if (user?.role !== "tech") {
    return <p>Access Denied: You do not have permission to view this page.</p>;
  }

  return (
    <>
    <div className=" lg:flex lg:flex-row lg:h-full gap-4">
    <Card className="flex flex-col h-auto w-lg items-center justify-center bg-secondary mt-4">
      <h1 className="text-3xl font-bold mb-8 text-center p-4">
        GitHub Project Management
      </h1>
      <CardBody>
        {user.githubUsername ? (
          <>
            <GitHubProjects />
          </>
        ) : (
          <GitHubLink />
        )}
      </CardBody>
    </Card>
    {user.githubUsername ? (
          <>
            <SideNavR/>
          </>
        ) : (
          null
        )}
    </div>
    </>
  );
};

export default Project;
