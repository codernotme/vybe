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
import React from "react";

type Props = {
  imageUrl?: string;
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
};

const Header = ({ imageUrl, name, options }: Props) => {
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
          {options ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size={"icon"} variant="secondary">
                  <Settings2Icon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {options.map((option, id) => {
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
    </>
  );
};

export default Header;
