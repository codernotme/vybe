import { useState } from "react";
import {
  Button,
  Input,
  Card,
  Dropdown,
  Spacer,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "sonner";

const RoleChanger = () => {
  const [username, setUsername] = useState("");
  const [newRole, setNewRole] = useState("member");
  const updateRole = useMutation(api.roles.updateUserRole);

  // Toast display function
  const showToast = (message: string, type: "success" | "error") => {
    toast[type](message, {
      duration: 3000,
    });
  };

  // Role update handler
  const handleRoleChange = async () => {
    if (!username.trim()) {
      showToast("Username cannot be empty!", "error");
      return;
    }
    try {
      const response = await updateRole({ username, newRole });
      showToast(response.message || "Role updated successfully!", "success");
      resetForm();
    } catch (error) {
      showToast((error as Error).message || "An error occurred!", "error");
    }
  };

  // Reset form function
  const resetForm = () => {
    setUsername("");
    setNewRole("member");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h3>Change User Role</h3>
      </CardHeader>
      <CardBody>
        {/* Username Input */}
        <Input
          fullWidth
          label="Username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Spacer y={1} />

        {/* Role Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button>
              {newRole.charAt(0).toUpperCase() + newRole.slice(1)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Role Selection"
            selectionMode="single"
            selectedKeys={new Set([newRole])}
            onSelectionChange={(key) =>
              setNewRole(Array.from(key)[0] as string)
            }
          >
            <DropdownItem key="member">Member</DropdownItem>
            <DropdownItem key="mentor">Mentor</DropdownItem>
            <DropdownItem key="tech">Tech</DropdownItem>
            <DropdownItem key="community">Community</DropdownItem>
            <DropdownItem key="admin">Admin</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardBody>
      <CardFooter>
        <Button variant="solid" color="danger" onClick={resetForm}>
          Reset
        </Button>
        <Spacer x={3} />
        <Button variant="solid" onClick={handleRoleChange}>
          Update Role
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleChanger;
