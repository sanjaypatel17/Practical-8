import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    axios.post(API_URL, newTask).then((res) => {
      setTasks([...tasks, res.data]);
      setNewTask({ title: "", description: "", status: "pending" });
    });
  };

  const updateTask = (id, updatedData) => {
    axios.put(`${API_URL}/${id}`, updatedData).then((res) => {
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    });
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div className="container">
      <h1 className="title">Task Manager</h1>
      <div className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newTask.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleChange}
        />
        <select name="status" value={newTask.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <div className="task-actions">
              <button
                className="toggle-btn"
                onClick={() =>
                  updateTask(task.id, {
                    ...task,
                    status: task.status === "pending" ? "completed" : "pending",
                  })
                }
              >
                Toggle Status
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
