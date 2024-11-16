interface Event {
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="event-card">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <span>{event.date}</span>
      <p>{event.location}</p>
    </div>
  );
}
