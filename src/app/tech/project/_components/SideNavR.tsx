"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import GitHubLink from "./GithubLink";
import GitHubProjects from "./GithubProject";
import RepoSelection from "./RepoSelection";
import PersonalWorkspace from "./PersonalWorkspace";
import WorkspaceSelector from "./WorkspaceSelector";
const SideNavR = () => {
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
    <div className="hidden lg:flex lg:flex-col lg:h-full">
      <div className=" flex flex-col h-full w-[500px] px-2 py-4 gap-4 ">
      {user.githubUsername ? (
          <>
            <RepoSelection githubUsername={user.githubUsername} />
            <WorkspaceSelector userId={user._id as any} />
          </>
        ) : (
          null
        )}
      </div>
    </div>
  );
};

export default SideNavR;
