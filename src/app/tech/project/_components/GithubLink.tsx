import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
// import { linkGitHub } from "../../../../../convex/github";

export default function GitHubLink() {
    const user = useQuery(api.users.get);

  const linkGitHubMutation = useMutation(api.github.linkGitHub);
  const [githubUsername, setGitHubUsername] = useState('');

  const handleLink = async () => {
    if (user && githubUsername) {
      await linkGitHubMutation({ clerkId: user.clerkId, githubUsername });
      alert("GitHub linked successfully!");
    }
  };

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Enter GitHub Username"
        value={githubUsername}
        onChange={(e) => setGitHubUsername(e.target.value)}
        className="input"
      />
      <Button color="primary" variant="shadow" onClick={handleLink} className="btn">
        Link GitHub
      </Button>
    </div>
  );
}
