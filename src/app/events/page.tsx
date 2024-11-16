"use client";
import { useEffect, useState } from "react";
import EventCard from "./_components/EventCard";
import EventForm from "./_components/EventForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const getEventsAPI = useQuery(api.events.getEvents);
  const createEventAPI = useMutation(api.events.createEvent);

  useEffect(() => {
    if (getEventsAPI) {
      setEvents(getEventsAPI.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location
      })));
    }
  }, [getEventsAPI]);

  interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
  }

  interface EventFormProps {
    onSubmit: (eventData: EventData) => void;
  }

  interface EventData {
    title: string;
    description: string;
    date: string;
    location: string;
  }

  const handleCreateEvent = async (eventData: EventData): Promise<void> => {
    await createEventAPI(eventData);
    const updatedEvents: Event[] = getEventsAPI ? getEventsAPI.map(event => ({
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      createdBy: event.createdBy // Ensure createdBy is included
    })) : [];
    setEvents(updatedEvents);
  };

  return (
    <div>
      <h1>All Events</h1>
      <EventForm onSubmit={handleCreateEvent} />
      {events.length ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
}

