import { useContext } from "react"
import { UserContext } from "@/app/context/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, Trash2Icon, UserPlusIcon } from 'lucide-react'
import { Id } from "../../../../convex/_generated/dataModel"

interface Event {
  _id: Id<"events">;
  _creationTime: number;
  id?: Id<"events">;
  createdBy?: Id<"users">;
  attendees?: string[] | Id<"users">[];
  description: string;
  title: string;
  date: number;
  location: string;
}

interface EventCardProps {
  event: Event
  onDelete: (eventId: Id<"events">) => void
  onEnroll: (eventId: Id<"events">) => void
  currentUserId: string | null
  loading: boolean
}

export default function EventCard({ event, onDelete, onEnroll, currentUserId, loading }: EventCardProps) {
  const isUserEnrolled = event.attendees?.some(attendee => attendee === currentUserId) ?? false

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-2">{event.description}</p>
        <div className="flex items-center text-gray-500 mb-1">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <MapPinIcon className="mr-2 h-4 w-4" />
          <span>{event.location}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {event.createdBy === currentUserId && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(event._id)} disabled={loading}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        <Button
          variant={isUserEnrolled ? "secondary" : "default"}
          size="sm"
          onClick={() => onEnroll(event._id)}
          disabled={isUserEnrolled || loading}
        >
          <UserPlusIcon className="mr-2 h-4 w-4" />
          {isUserEnrolled ? "Enrolled" : "Enroll"}
        </Button>
      </CardFooter>
    </Card>
  )
}

