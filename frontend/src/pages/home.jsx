import React from "react";
import CalendarComponent from "../components/calendar";
import Todo from "../components/todos";
import Email from "../components/emails";

const Home = ({ message, setMessage}) => {
  return (
    <div>
      <CalendarComponent></CalendarComponent>
      <Todo message={message} setMessage={setMessage}></Todo>
      <Email message={message} setMessage={setMessage}></Email>
    </div>
  );
};

export default Home;
