"use client";
import { Card, user } from "@nextui-org/react";
import RoleChanger from "./_components/RoleChanger";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const AdminPage = () => {
  const user = useQuery(api.users.get);
  if (user?.role === "admin") {
    return (
      <Card className="flex flex-col items-center justify-center bg-secondary p-4 mt-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          User Role Management
        </h1>
        {/* RoleChanger Component */}
        <RoleChanger />
      </Card>
    );
  }
};

export default AdminPage;
