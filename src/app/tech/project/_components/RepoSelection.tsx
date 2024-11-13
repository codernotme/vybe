// src/components/RepoSelection.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@nextui-org/button";

// Define the Repo interface
interface Repo {
  name: string;
  url: string;
  description: string;
}

interface RepoSelectionProps {
  githubUsername: string;
}

// Function to fetch repos from GitHub
const fetchGithubRepos = async (githubUsername: string, page: number = 1): Promise<Repo[]> => {
  const response = await axios.get(
    `https://api.github.com/users/${githubUsername}/repos?per_page=100&page=${page}`
  );
  return response.data.map(
    (repo: { name: string; html_url: string; description: string }) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
    })
  );
};

const RepoSelection: React.FC<RepoSelectionProps> = ({ githubUsername }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use mutation for selecting repo
  const selectRepo = useMutation(api.github.selectRepo);

  // Use query for fetching user info
  const user = useQuery(api.users.get);

  // Fetch repositories when component mounts or githubUsername changes
  useEffect(() => {
    const fetchRepos = async () => {
      const fetchedRepos = await fetchGithubRepos(githubUsername);
      setRepos(fetchedRepos);
    };
    fetchRepos();
  }, [githubUsername]);

  // Filter the repositories based on search query
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting a repository
  const handleSelectRepo = async (repo: Repo) => {
    if (user && user._id) {
      await selectRepo({
        userId: user._id,
        repoName: repo.name,
        repoUrl: repo.url,
        description: repo.description,
      });
    } else {
      console.error("User ID is undefined");
    }
  };

  return (
    <div>
      <h2>Select GitHub Repository</h2>

      {/* Search bar for filtering repositories */}
      <input
        type="text"
        placeholder="Search repositories"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "8px", marginBottom: "16px", width: "100%" }}
      />

      {/* Display only first few filtered repositories */}
      <div>
        {filteredRepos.slice(0, 4).map((repo) => (
          <div key={repo.name} style={{ marginBottom: "10px" }}>
            <p>{repo.name}</p>
            <p>{repo.description}</p>
            <Button onClick={() => handleSelectRepo(repo)}>Select</Button>
          </div>
        ))}

        {/* If there are more than 4 repositories, show "Show more" */}
        {filteredRepos.length > 4 && (
          <div>
            <Button
              onClick={() => setSearchQuery("")} // Reset search to show all repos
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoSelection;


