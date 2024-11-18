import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Avatar } from "@nextui-org/avatar";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { CircleArrowLeftIcon, Settings2Icon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import LeaveGroupDialog from "./dialogs/LeaveGroupDialog";
import DeleteGroupDialog from "./dialogs/DeletegroupDialogbox";
import { Id } from "../../../../../../../convex/_generated/dataModel";

type Props = {
  imageUrl?: string;
  name: string;
  conversationId: Id<"conversations">;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};
const Header = ({ imageUrl, name, conversationId, options }: Props) => {
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const extendedOptions = [
    ...(options || []),
    {
      label: "Leave Group",
      destructive: true,
      onClick: () => setLeaveDialogOpen(true),
    },
    {
      label: "Delete Group",
      destructive: true,
      onClick: () => setDeleteDialogOpen(true),
    },
  ];

  return (
    <>
      <Card className="w-full  p-2 flex rounded-lg items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/chat/conversations`} className="block lg:hidden">
            <CircleArrowLeftIcon />
          </Link>
          <Avatar className="w-8 h-8" src={imageUrl} />
          <h2 className="font-semibold truncate">{name}</h2>
        </div>
        <div className="flex gap-2">
          {extendedOptions ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size={"icon"} variant="secondary">
                  <Settings2Icon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {extendedOptions.map((option, id) => {
                  return (
                    <DropdownMenuItem
                      key={option.label}
                      onClick={option.onClick}
                      className={cn("font-semibold", {
                        "text-destructive": option.destructive
                      })}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </Card>
      <LeaveGroupDialog
        conversationId={conversationId}
        open={leaveDialogOpen}
        setOpen={setLeaveDialogOpen}
      />
      <DeleteGroupDialog
        conversationId={conversationId}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
};

export default Header;