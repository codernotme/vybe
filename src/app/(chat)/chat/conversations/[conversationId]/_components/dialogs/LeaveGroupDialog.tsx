import React, { Dispatch, SetStateAction } from "react";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import { UseMutationState } from "@/hooks/useMutationState";
import { api } from "../../../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ExitIcon } from "@radix-ui/react-icons";

type Props = {
  conversationId: Id<"conversations">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const LeaveGroupDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: leaveGroup, pending } = UseMutationState(
    api.conversation.leaveGroup
  );

  const handleleaveGroup = async () => {
    leaveGroup({ conversationId })
      .then(() => {
        toast.success("Group left");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.message
            : "Unexpected error occurred"
        );
      });
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to leave this group?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.You will not be able to see any
              previous messages or send new messages to this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel </AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={handleleaveGroup}>
              <ExitIcon />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaveGroupDialog;
