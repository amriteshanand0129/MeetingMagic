import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/meeting-summarys", { withCredentials: true });
        setMeetings(response.data.meetingSummarys);
      } catch (error) {
        console.error("Error fetching meeting summaries:", error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="border-2 border-gray-500 p-4 rounded-lg w-[90%] mx-auto mt-4">
      <h5 className="text-center">Meeting Summaries</h5>
      <hr />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {meetings.map((meeting) => (
            <tr key={meeting.id}>
              <td className="px-6 py-4 ">{meeting.summary}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(meeting.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
