"use client";
import { useParams } from "next/navigation"; // For Next.js 13+ app router

import { useQuery } from "convex/react";
import PersonalWorkspace from "@/app/tech/project/_components/PersonalWorkspace";
import { api } from "../../../../convex/_generated/api";

export default function WorkspacePage() {

  const { id: projectId } = useParams(); // Get the project workspace ID from the route
  const user = useQuery(api.users.get);
  const projectWorkspaces = useQuery(api.workspace.getProjectWorkspaces);

  // Validate projectId
  if (!projectId) {
    return <p>Workspace ID not provided.</p>;
  }

  // Handle loading state
  if (user === undefined || projectWorkspaces === undefined) {
    return <p>Loading...</p>;
  }

  // Handle error state
  if (!user) {
    return <p>Error: Failed to fetch user data.</p>;
  }

  if (!projectWorkspaces) {
    return <p>Error: Failed to fetch project workspaces.</p>;
  }

  // Authorization check
  if (user?.role !== "tech") {
    return <p>Access Denied: You do not have permission to view this page.</p>;
  }

  // Find the project workspace matching the projectId
  const projectWorkspace = projectWorkspaces.find((workspace) => workspace._id === projectId);

  // Render the PersonalWorkspace component if the specific project workspace is found
  if (projectWorkspace) {
    return <PersonalWorkspace userId={user._id} projectId={projectWorkspace._id} />;
  } else {
    return <p>Workspace not found or access denied.</p>;
  }
}
