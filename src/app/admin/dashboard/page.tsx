"use client";
import { Card, user } from "@nextui-org/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const AdminPage = () => {
  const user = useQuery(api.users.get);
  if (user?.role !== "admin") {
    return (
      <Card className="min-h-screen flex flex-col items-center justify-center bg-secondary p-6 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
        {/* RoleChanger Component */}
      </Card>
    );
  }
};

export default AdminPage;
