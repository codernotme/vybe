"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/icons"

export default function GitHubLink() {
  const user = useQuery(api.users.get)
  const linkGitHubMutation = useMutation(api.github.linkGitHub)
  const [githubUsername, setGitHubUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Link Your GitHub</CardTitle>
        <CardDescription>Connect your GitHub account to showcase your projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter GitHub Username"
            value={githubUsername}
            onChange={(e) => setGitHubUsername(e.target.value)}
            className="flex-grow"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isLoading || !githubUsername.trim()}
        >
          {isLoading ? (
            "Linking..."
          ) : (
            <>
              <GithubIcon className="w-4 h-4 mr-2" />
              Link GitHub
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
