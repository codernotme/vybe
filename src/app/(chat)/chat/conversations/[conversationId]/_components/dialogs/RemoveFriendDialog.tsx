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

const RemoveFriendDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: removeFriend, pending } = UseMutationState(api.friend.remove);

  const handleRemoveFriend = async () => {
    removeFriend({ conversationId })
      .then(() => {
        toast.success("Friend removed");
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
              Are you sure you want to remove this friend?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All messages will be deleted and you
              will not be able to message this user. All group chats will still
              work as normal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel </AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={handleRemoveFriend}>
              <Trash2Icon />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RemoveFriendDialog;
