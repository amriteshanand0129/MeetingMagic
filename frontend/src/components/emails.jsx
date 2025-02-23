import React, { useEffect, useState } from "react";
import axios from "axios";

const Email = ({message, setMessage}) => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/emails", { withCredentials: true });
        setEmails(response.data.emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const markAsSent = async (id) => {
    try {
      const response = await axios.post(`http://localhost:8080/mark-email-as-sent/${id}`, {}, { withCredentials: true });
      setEmails(emails.filter((email) => email._id.toString() !== id));
      setMessage({ message: response.data.message, type: "success" });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error marking email as sent:", error);
    }
  };

  return (
    <div className="border-2 border-gray-500 p-4 rounded-lg w-[90%] mx-auto my-4">
      <h5 className="text-center">Emails List</h5>
      <hr />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {emails.map((email) => (
            <tr key={email._id}>
              <td className="px-6 py-4 whitespace-nowrap">{email.to}</td>
              <td className="px-6 py-4 whitespace-nowrap">{email.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap">{email.body}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => markAsSent(email._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Mark as Sent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Email;
