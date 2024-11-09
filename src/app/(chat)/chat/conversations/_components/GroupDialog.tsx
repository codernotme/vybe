"use client";

import { useQuery } from "convex/react";
import React, { useMemo } from "react";
import { z } from "zod";
import { api } from "../../../../../../convex/_generated/api";
import { UseMutationState } from "@/hooks/useMutationState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CirclePlusIcon, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@nextui-org/avatar";
import { Card } from "@/components/ui/card";

const createGroupFormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a group name"
  }),
  members: z.string().array().min(1, {
    message: "Please add at least one member"
  })
});

const GroupDialog = () => {
  const friends = useQuery(api.friends.get);
  const { mutate: createGroup, pending } = UseMutationState(
    api.conversation.createGroup
  );

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      members: []
    }
  });

  const members = form.watch("members", []);
  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend) => !members.includes(friend._id))
      : [];
  }, [members, friends]);

  const handleSubmit = async (
    values: z.infer<typeof createGroupFormSchema>
  ) => {
    await createGroup({
      name: values.name,
      members: values.members
    })
      .then(() => {
        toast.success("Group created");
        form.reset();
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
      <Dialog>
        <Tooltip>
          <TooltipTrigger>
            <Button size="icon" variant="outline" className="hover:bg-muted">
              <DialogTrigger asChild>
                <CirclePlusIcon className="w-6 h-6" />
              </DialogTrigger>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Hive</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="block">
          <DialogHeader>
            <DialogTitle>Create Hive</DialogTitle>
            <DialogDescription>
              Create a new hive by adding friends.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Group Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hive Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Hive name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add Friends */}
              <FormField
                control={form.control}
                name="members"
                render={() => (
                  <FormItem>
                    <FormLabel>Add Friends</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={unselectedFriends.length === 0}
                        >
                          <Button variant="outline" className="w-full">
                            Select Friends
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {unselectedFriends.map((friend) => (
                            <DropdownMenuCheckboxItem
                              key={friend._id}
                              className="flex items-center gap-2 p-2"
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  form.setValue("members", [
                                    ...members,
                                    friend._id
                                  ]);
                                }
                              }}
                            >
                              <Avatar src={friend.imageUrl} />
                              <h4 className="truncate">{friend.username}</h4>
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selected Members */}
              {members.length > 0 && (
                <Card className="flex items-center gap-3 overflow-x-auto p-2 no-scrollbar w-full h-24">
                  {friends
                    ?.filter((friend) => members.includes(friend._id))
                    .map((friend) => (
                      <div
                        key={friend._id}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="relative">
                          <Avatar src={friend.imageUrl} />
                          <X
                            className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer"
                            onClick={() =>
                              form.setValue(
                                "members",
                                members.filter((id) => id !== friend._id)
                              )
                            }
                          />
                        </div>
                        <p className="truncate text-sm">{friend.username}</p>
                      </div>
                    ))}
                </Card>
              )}

              {/* Submit Button */}
              <DialogFooter>
                <Button disabled={pending} type="submit" className="w-full">
                  Create Hive <ArrowRightIcon className="ml-2" />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupDialog;
