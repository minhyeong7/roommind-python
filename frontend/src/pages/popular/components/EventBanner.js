import React from "react";
import { events } from "../dummy/events";

export default function EventBanner() {
  return (
    <div className="event-banner">
      {events.map((event) => (
        <div className="event-card" key={event.id}>
          <img src={event.image} alt={event.title} />
          <p>{event.title}</p>
        </div>
      ))}
    </div>
  );
}
