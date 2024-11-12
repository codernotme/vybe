"use client"
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";

export default function GitHubProjects() {
  const user  = useQuery(api.users.get);
  const githubUsername = user?.githubUsername || "";

  // Define interface for repositories
  interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
  }

  const [repos, setRepos] = useState<Repo[]>([]);

  // Fetch GitHub repos only if the user has a GitHub ID
  const fetchedRepos = useQuery(api.github.getGitHubRepos, { githubUsername });

  // Effect to handle fetched data
  useEffect(() => {
    if (fetchedRepos && githubUsername) {
      setRepos(fetchedRepos);
    }
  }, [fetchedRepos, githubUsername]);

  if (!repos.length) return <p>No projects found.</p>;

  return (
    <div className="grid gap-4">
      {repos.map((repo) => (
        <div key={repo.id} className="card">
          <h3>{repo.name}</h3>
          <p>{repo.description}</p>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View Repository</a>
        </div>
      ))}
    </div>
  );
}
