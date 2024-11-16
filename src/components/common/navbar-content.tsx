import React from "react";
import AddFriendDialog from "./AddFriendDialog";
import NavbarConvo from "./NavbarChat";
import Notification from "../notification/page";
import NavbarAnonymous from "./NavAnony";

export default function navbarcontent() {
  return (
    <div className="flex flex-row p-2 align-middle items-center">
      <AddFriendDialog />
      <NavbarConvo />
      <NavbarAnonymous />
      <Notification />
    </div>
  );
}
