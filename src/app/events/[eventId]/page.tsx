"use client";
import { useRouter } from "next/router";
import { useQuery} from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export default function EventDetailPage() {
  const router = useRouter();
  const { eventId } = router.query;
  const event = useQuery(api.events.getEventById, { eventId: eventId as Id<"events"> });



  if (!event) return <p>Loading...</p>;

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>{event?.title}</h1>
      <p>{event?.description}</p>
      <span>{event?.date}</span>
      <p>{event?.location}</p>
    </div>
  );
}
