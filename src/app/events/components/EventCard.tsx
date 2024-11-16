export default function EventCard({ event }) {
    return (
      <div className="event-card">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <span>{event.date}</span>
        <p>{event.location}</p>
      </div>
    );
  }
  