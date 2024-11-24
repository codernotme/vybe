'use client';

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import EventCard from "./_components/EventCard";
import EventForm from "./_components/EventForm";
import Calendar from "./_components/Calendar";
import { EventData } from './_types';

export default function EventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // Separate loading state
  const events = (useQuery(api.events.getEvents) || []).map(event => ({
    ...event,
    attendees: event.attendees || []
  }));
  const createEvent = useMutation(api.events.createEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const enrollEvent = useMutation(api.events.enrollEvent);
  const user = useQuery(api.users.get);

  const currentUserId = user?._id || null;

  const handleCreateEvent = async (eventData: EventData) => {
    setLoadingAction("create");
    try {
      await createEvent({ ...eventData, date: eventData.date.getTime() });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteEvent = async (eventId: Id<"events">) => {
    setLoadingAction(eventId);
    try {
      if (!eventId) throw new Error("Invalid event ID.");
      await deleteEvent({ eventId });
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEnrollEvent = async (eventId: Id<"events">) => {
    setLoadingAction(eventId);
    try {
      if (!currentUserId) throw new Error("User not authenticated.");
      if (!eventId) throw new Error("Invalid event ID.");
      await enrollEvent({ eventId });
    } catch (error) {
      console.error("Error enrolling in event:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => setShowForm((prev) => !prev)} disabled={loadingAction === "create"}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "Create Event"}
        </Button>
      </div>

      {showForm && (
        <EventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDeleteEvent}
                onEnroll={handleEnrollEvent}
                currentUserId={currentUserId}
                loading={loadingAction === event._id}
              />
            ))
          ) : (
            <p className="text-gray-500">No events found</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
          <Calendar events={events} />
        </div>
      </div>
    </div>
  );
}
