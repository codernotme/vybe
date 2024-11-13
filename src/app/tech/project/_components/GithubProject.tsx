"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
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
  const reposPerPage = 4; // Adjust this value based on your screen height

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

            // If the fetched data is less than 100, we've reached the end
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

  // Filter repos based on search query
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * reposPerPage,
    currentPage * reposPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
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
    <div className="p-4 w-full">
      {/* Search Bar */}
      <Input
        label="Search"
        color="primary"
        variant="bordered"
        isClearable
        radius="lg"
        className="mb-4 w-[200]"
        placeholder="Type to search..."
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Repositories Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedRepos.length ? (
          paginatedRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
        ) : (
          <p className="text-center text-muted-foreground">
            No projects found.
          </p>
        )}
      </div>

      {/* Pagination Control */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="bordered"
            loop
            showControls
          />
        </div>
      )}
    </div>
  );
}

function getRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-indigo-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function RepoCard({ repo }: { repo: Repo }) {
  const cardColor = getRandomColor();

  return (
    <Card className={`flex flex-col justify-between p-4 ${cardColor}`}>
      <CardHeader>
        <CardTitle className="text-lg truncate">{repo.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between items-center mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" color="primary">
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>{repo.name}</DialogTitle>
              <DialogDescription>
                {repo.description || "No description provided."}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-4 h-[200px] rounded-md border p-4 overflow-auto">
              <div className="space-y-4">
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
                {repo.language && <div>Language: {repo.language}</div>}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Button variant="solid" >
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-col justify-between h-full">
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
