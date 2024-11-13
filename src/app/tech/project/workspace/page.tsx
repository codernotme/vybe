import PersonalWorkspace from "../_components/PersonalWorkspace";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export default function WorkspacePage() {
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
    {projectId && (
    <PersonalWorkspace userId={user._id} projectId={projectId} />
  )}
    </>)
}
