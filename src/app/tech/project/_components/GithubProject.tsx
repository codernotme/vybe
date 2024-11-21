"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Star, GitFork, Eye } from "lucide-react";
import { Pagination } from "@nextui-org/pagination";
import { SearchIcon } from "@/components/icons";
import { Input, Button } from "@nextui-org/react";

type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
};

export default function GitHubProjects() {
  const user = useQuery(api.users.get);
  const githubUsername = user?.githubUsername;
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 6;

  useEffect(() => {
    const fetchRepos = async () => {
      if (githubUsername) {
        try {
          setLoading(true);
          let page = 1;
          const allRepos: Repo[] = [];
          let fetchMore = true;

          while (fetchMore) {
            const response = await fetch(
              `https://api.github.com/users/${githubUsername}/repos?per_page=100&page=${page}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch GitHub repositories");
            }
            const data: Repo[] = await response.json();
            allRepos.push(...data);

            if (data.length < 100) {
              fetchMore = false;
            } else {
              page += 1;
            }
          }

          setRepos(allRepos);
        } catch (error) {
          console.error("Error fetching repositories:", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRepos();
  }, [githubUsername]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * reposPerPage,
    currentPage * reposPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Failed to load repositories.</p>
    );
  }

  if (!githubUsername) {
    return (
      <p className="text-center text-muted-foreground">
        Please link your GitHub account.
      </p>
    );
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          label="Search"
          color="primary"
          variant="bordered"
          isClearable
          radius="lg"
          placeholder="Search repositories..."
          startContent={
            <SearchIcon className="text-gray-400" />
          }
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRepos.length ? (
          paginatedRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No projects found.
          </p>
        )}
      </div>

      {/* Pagination Control */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="bordered"
          />
        </div>
      )}
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Card className="p-4 shadow-lg border rounded-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold truncate">{repo.name}</CardTitle>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {repo.description || "No description provided."}
        </p>
      </CardHeader>
      <CardFooter className="flex justify-between items-center mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{repo.name}</DialogTitle>
              <DialogDescription>
                {repo.description || "No description provided."}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-4 h-40">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>{repo.stargazers_count} stars</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GitFork className="h-4 w-4" />
                  <span>{repo.forks_count} forks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{repo.watchers_count} watchers</span>
                </div>
                {repo.language && (
                  <div>Language: {repo.language}</div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Button variant="solid" size="sm">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="animate-pulse p-4 border rounded-lg">
          <CardHeader>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardFooter className="flex justify-between mt-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
