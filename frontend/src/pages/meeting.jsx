import axios from "axios";
import React, { useState, useEffect } from "react";

const Meeting = ({ message, setMessage }) => {
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [editAnalysis, setEditAnalysis] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPart);
        } else {
          interimTranscript += transcriptPart;
        }
      }
    };

    if (recording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [recording]);

  const analyzeTranscript = async () => {
    setAnalyzing(true);
    try {
      const response = await axios.post("http://localhost:8080/analyze", { transcript }, { withCredentials: true });
      setMessage({ type: "success", message: response.data.message });
      setAnalysis(response.data.analysis);
    } catch (error) {
      setMessage({ type: "error", message: "Transcript Analysis Failed: " + error.response?.data?.error });
    } finally {
      setAnalyzing(false);
    }
  };

  const openEditModal = () => {
    setEditAnalysis({ ...analysis });
    setShowModal(true);
  };

  const handleEditChange = (section, index, field, value) => {
    const updatedAnalysis = { ...editAnalysis };
    if (Array.isArray(updatedAnalysis[section])) {
      updatedAnalysis[section][index][field] = value;
    } else {
      updatedAnalysis[section] = value;
    }
    setEditAnalysis(updatedAnalysis);
  };

  const saveChanges = async () => {
    setAnalysis(editAnalysis);
    setShowModal(false);

    try {
      const response = await axios.put("http://localhost:8080/save-analysis", editAnalysis, { withCredentials: true });
      setMessage({ type: "success", message: response.data.message });
      setAnalysis(null);
      setTranscript("");
    } catch (error) {
      setMessage({ type: "error", message: "Failed to save changes: " + error.response?.data?.error });
    }
  };

  return (
    <>
      <div className="items-center justify-center text-center w-[90%] mx-auto my-20 border-2 border-black p-4 rounded-xl">
        <h3>Record a new meeting</h3>
        <div className="w-[30%] mx-auto mt-[20px] flex justify-between">
          <button className={`btn btn-${recording ? "danger" : "primary"}`} onClick={() => setRecording(!recording)}>
            {recording ? "Stop Recording" : "Start Recording"}
          </button>

          <button className="btn btn-success" onClick={analyzeTranscript} disabled={recording || !transcript.trim() || analyzing}>
            Analyze Meeting Transcript
          </button>
          {analyzing && (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
        <br />
        <textarea className="w-full size-80 border-1 border-gray-700 rounded-xl p-2" value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Your meeting transcript will appear here" />
      </div>

      {analysis && (
        <div className="items-center justify-center text-center w-[90%] mx-auto my-20 border-2 border-black p-4 rounded-xl">
          <h3>Meeting Analysis</h3>
          <button className="btn btn-warning my-3 float-right" onClick={openEditModal}>
            Edit Analysis
          </button>
          <div className="text-left">
            <hr />
            <p className="text-lg font-medium">Summary</p>
            <hr />
            <p>{analysis.summary}</p>

            <hr />
            <p className="text-lg font-medium">Calendar Events</p>
            <hr />
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {analysis.calendar_events.map((event, index) => (
                  <tr key={index}>
                    <td>{event.title}</td>
                    <td>{event.start}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />
            <p className="text-lg font-medium">Emails</p>
            <hr />
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>To</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {analysis.emails.map((email, index) => (
                  <tr key={index}>
                    <td>{email.to}</td>
                    <td>{email.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr />
            <p className="text-lg font-medium">Todo Tasks</p>
            <hr />
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {analysis.todo_tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.title}</td>
                    <td>{task.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bootstrap Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-backdrop show" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>

          <div className="modal-dialog modal-lg" style={{ maxWidth: "80%", zIndex: 1050 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Analysis</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-lg font-medium">Summary</p>
                <textarea className="form-control size-50" value={editAnalysis.summary} onChange={(e) => handleEditChange("summary", null, null, e.target.value)} />
                <br />

                <p className="text-lg font-medium">Calendar Events</p>
                <div className="d-flex justify-content-around">
                  <p className="text-lg border rounded-4xl py-1 bg-black text-white w-32 text-center">Title</p>
                  <p className="text-lg border rounded-4xl py-1 bg-black text-white w-32 text-center">Date</p>
                </div>
                {editAnalysis.calendar_events.map((event, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between">
                      <input className="form-control my-2 mx-2" value={event.title} onChange={(e) => handleEditChange("calendar_events", index, "title", e.target.value)} />
                      <input className="form-control my-2 mx-2 mx-2" value={event.start} onChange={(e) => handleEditChange("calendar_events", index, "start", e.target.value)} />
                    </div>
                  </div>
                ))}
                <br />

                <p className="text-lg font-medium">Emails</p>
                <div className="d-flex justify-content-around">
                  <p className="text-lg border rounded-4xl py-1 bg-black text-white w-32 text-center">Receiver</p>
                  <p className="text-lg border rounded-4xl py-1 bg-black text-white w-32 text-center">Subject</p>
                </div>
                {editAnalysis.emails.map((email, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between">
                      <input className="form-control my-2 mx-2" value={email.to} onChange={(e) => handleEditChange("emails", index, "to", e.target.value)} />
                      <input className="form-control my-2 mx-2" value={email.subject} onChange={(e) => handleEditChange("emails", index, "subject", e.target.value)} />
                    </div>
                  </div>
                ))}
                <br />

                <p className="text-lg font-medium">Todo Tasks</p>
                <div className="d-flex justify-content-around">
                  <p className="text-lg border rounded-4xl py-1 bg-black text-white w-32 text-center">Title</p>
                  <p className="text-lg border rounded-4xl py-1 bg-black text-white w-32 text-center">Due Date</p>
                </div>
                {editAnalysis.todo_tasks.map((task, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-between">
                      <input className="form-control my-2 mx-2" value={task.title} onChange={(e) => handleEditChange("todo_tasks", index, "title", e.target.value)} />
                      <input className="form-control my-2 mx-2" value={task.due_date} onChange={(e) => handleEditChange("todo_tasks", index, "due_date", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={saveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Meeting;
