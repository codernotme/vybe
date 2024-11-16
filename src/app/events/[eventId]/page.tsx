import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getEventByIdAPI } from "../api/events";

export default function EventDetailPage() {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (eventId) getEventByIdAPI(eventId).then(setEvent);
  }, [eventId]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <span>{event.date}</span>
      <p>{event.location}</p>
    </div>
  );
}
