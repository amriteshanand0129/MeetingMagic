import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/calendar-events", { withCredentials: true });
        const formattedEvents = response.data.calendarEvents.map((event) => ({
          title: event.title,
          start: `${event.start}T${event.time}`, 
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} height="600px" />
    </div>
  );
};

export default CalendarComponent;
