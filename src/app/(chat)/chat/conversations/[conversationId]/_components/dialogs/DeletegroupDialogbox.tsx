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
import { Trash2Icon } from "lucide-react";

type Props = {
  conversationId: Id<"conversations">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DeleteGroupDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: deleteGroup, pending } = UseMutationState(
    api.conversation.deleteGroup
  );

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup({ conversationId });
      toast.success("Group deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof ConvexError
          ? error.message
          : "An unexpected error occurred while deleting the group"
      );
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All messages will be deleted, and you
            will not be able to message this group anymore.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={handleDeleteGroup}
            className="flex items-center gap-2"
          >
            <Trash2Icon className="w-4 h-4" />
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGroupDialog;
