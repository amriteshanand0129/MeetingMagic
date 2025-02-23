import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Meeting from "./pages/meeting";
import History from "./pages/history";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  return (
    <Router>
      <Navbar message={message} setMessage={setMessage}/>
      {message && (
        <div className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"} alert-dismissible fade show text-center`} role="alert">
          {message.message}

          <button type="button" className="close float-right" data-dismiss="alert" aria-label="Close" onClick={() => setMessage("")}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home message={message} setMessage={setMessage}/>} />
        <Route path="/login" element={<Login message={message} setMessage={setMessage} />} />
        <Route path="/meeting" element={<Meeting message={message} setMessage={setMessage} />} />
        <Route path="/history" element={<History message={message} setMessage={setMessage}/>} />
      </Routes>
    </Router>
  );
}

export default App;
