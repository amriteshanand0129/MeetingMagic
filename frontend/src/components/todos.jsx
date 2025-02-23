import React, { useEffect, useState } from "react";
import axios from "axios";

const Todo = ({ message, setMessage }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/todo-tasks", { withCredentials: true });
        const sortedTodos = response.data.todoTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setTodos(sortedTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const markAsDone = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/todo-tasks/${id}`, {}, { withCredentials: true });

      setTodos(todos.filter((todo) => todo._id.toString() !== id));
      setMessage({ message: response.data.message, type: "success" });
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error marking todo as done:", error);
    }
  };

  return (
    <div className="border-2 border-gray-500 p-4 rounded-lg w-[90%] mx-auto mt-4">
      <h5 className="text-center">Todo List</h5>
      <hr />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {todos.map((todo) => (
            <tr key={todo._id}>
              <td className="px-6 py-4 whitespace-nowrap">{todo.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(todo.due_date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => markAsDone(todo._id)}>
                  Mark as Done
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Todo;
