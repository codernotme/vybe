"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button, Card, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

interface WorkspaceSelectorProps {
  userId: Id<"users">;
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({ userId }) => {
  const router = useRouter();
  const workspaces = useQuery(api.workspace.getUserWorkspaces, { userId });

  if (!workspaces) return <div>Loading workspaces...</div>;

  return (
    <Card className="p-6">
      <h2>Select a Workspace</h2>
      {workspaces.map(
        (workspace) =>
          workspace && (
            <Card key={workspace._id} className="my-4 p-4">
              <h3 className="font-bold mb-2">{workspace.repoName}</h3>
              <Spacer y={1} />
              <Card className="bg-success-50 p-2">
                <p>
                  Status: <span className="font-bold">{workspace.status}</span>
                </p>
              </Card>
               <Spacer y={1} />
              <Button onClick={() => router.push(`/workspace/`)}>
                Open Workspace
              </Button>
            </Card>
          )
      )}
    </Card>
  );
};

export default WorkspaceSelector;
