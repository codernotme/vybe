import { useEffect, useState } from "react";
import { getEventsAPI } from "./api/events";
import EventCard from "./components/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEventsAPI().then(setEvents);
  }, []);

  return (
    <div>
      <h1>All Events</h1>
      {events.length ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <p>No events found</p>
      )}
    </div>
  );
}
