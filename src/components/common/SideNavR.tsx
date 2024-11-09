"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import Footer from "./Footer";

const DesktopNav = () => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:h-full gap-4">
      <Card className=" flex flex-col h-full w-auto px-2 py-4 gap-4 ">
        {/*   <Stories />
      <FriendSuggestion />*/}
      </Card>
      <Footer />
    </div>
  );
};

export default DesktopNav;
