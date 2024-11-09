import React from "react";
import AddFriendDialog from "./AddFriendDialog";
import NavbarConvo from "./NavbarChat";
import Notification from "../notification/page";

export default function navbarcontent() {
  return (
    <div className="flex flex-row p-2 align-middle items-center">
      <AddFriendDialog />
      <NavbarConvo />
      <Notification />
    </div>
  );
}
