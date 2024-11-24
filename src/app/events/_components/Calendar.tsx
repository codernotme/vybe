"use client"
import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Id } from "../../../../convex/_generated/dataModel"

interface Event {
  _id: Id<"events"> | undefined
  title: string
  description: string
  date: number
  location: string
  attendees: Id<"users">[] | string[]
}

interface CalendarProps {
  events: Event[]
}

export default function Calendar({ events }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const eventDates = events.map((event) => new Date(event.date))
  const selectedDateEvents = events.filter(
    (event) => new Date(event.date).toDateString() === selectedDate?.toDateString()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{ eventDay: eventDates }}
          modifiersStyles={{
            eventDay: { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" },
          }}
        />
        {selectedDateEvents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Events on {selectedDate?.toDateString()}:</h3>
            <ul className="list-disc pl-5">
              {selectedDateEvents.map((event) => (
                <li key={event._id}>{event.title}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

