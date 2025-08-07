import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/Task.css";
import { Search } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Task = () => {
  const [mentors, setMentors] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedIntern, setSelectedIntern] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("pending");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [animationMap, setAnimationMap] = useState({});

 
  const [searchTerm, setSearchTerm] = useState("");
 


 ;

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/mentors`);
        setMentors(res.data);
      } catch (err) {
        console.error("Failed to fetch mentors", err);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/members?populate=mentor`);
        setAllMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };
    fetchAllMembers();
  }, []);

  useEffect(() => {
    if (!selectedMentor) {
      setTeamMembers([]);
      setSelectedIntern("");
      return;
    }

    const filtered = allMembers.filter((member) => {
      if (!member || !member.mentor) {
        console.warn("Member with null mentor:", member);
        return false;
      }

      const mentorId =
        typeof member.mentor === "object" ? member.mentor._id : member.mentor;
      return mentorId === selectedMentor;
    });

    setTeamMembers(filtered);
    setTaskInput("");
    setAssignedTo("");
    setStatus("pending");
    setEditingTaskId(null);
    setSelectedIntern("");
  }, [selectedMentor, allMembers]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    fetchTasks();
  }, []);

 
  const getInternIdByName = (name) => {
    const intern = teamMembers.find((member) => member.name === name);
    return intern ? intern._id : "";
  };

  const getAssignedName = (task) => {
    if (task.assignedTo && typeof task.assignedTo === "object") {
      return task.assignedTo.name;
    }

    const teamMember = teamMembers.find((m) => m._id === task.assignedTo);
    if (teamMember) return teamMember.name;

    const allMember = allMembers.find((m) => m._id === task.assignedTo);
    return allMember ? allMember.name : "Unassigned";
  };

  const formatStatus = (status) => {
    return status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  const filteredTasks = tasks.filter((task) => {
    const taskAssignedTo =
      task.assignedTo === null || task.assignedTo === undefined
        ? undefined
        : typeof task.assignedTo === "object"
        ? task.assignedTo._id
        : task.assignedTo;

    if (selectedMentor) {
      const teamMemberIds = teamMembers.map((member) => member._id);
      if (!teamMemberIds.includes(taskAssignedTo)) return false;

      if (selectedIntern) {
        const selectedInternId = getInternIdByName(selectedIntern);
        return taskAssignedTo === selectedInternId;
      }
    }

    if (searchTerm) {
      const internName = getAssignedName(task).toLowerCase();
      const taskTitle = (task.title || task.task).toLowerCase();
      const dueDate = task.dueDate1
        ? new Date(task.dueDate1).toLocaleDateString().toLowerCase()
        : "";

      return (
        internName.includes(searchTerm.toLowerCase()) ||
        taskTitle.includes(searchTerm.toLowerCase()) ||
        dueDate.includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

  return (
    <div className="task-container">
      {/* Notification Setup Button */}
     
      <h1 className="app-heading">Interns Task Management Application</h1>

      <div className="top-header">
        <h2>
          <span className="spanto"> Reporting to: </span>
          <span className="report">Mr. Parikshit Bangde</span>
        </h2>
      </div>

      {/* Mentor Select */}
      <div className="section">
        <div className="filter-section">
          <div className="section mentor-select">
            <label htmlFor="mentor-select">Select Mentor:</label>
            <select
              id="mentor-select"
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
            >
              <option value="">-- Select Mentor --</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="section search-box">
        <label htmlFor="task-search">Search Tasks:</label>
        <div className="search-container">
          <input
            id="task-search"
            type="text"
            placeholder="Search by member name or task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </div>
      </div>

      {selectedMentor && (
        <>
          {/* Team Members */}
          <div className="section">
            <h3>
              <span className="teams">Team Members under Selected Mentor:</span>
            </h3>
            <ul className="team-list">
              {teamMembers.map((member) => (
                <li
                  key={member._id}
                  onClick={() => setSelectedIntern(member.name)}
                  style={{
                    cursor: "pointer",
                    textDecoration:
                      selectedIntern === member.name ? "underline" : "none",
                    fontWeight:
                      selectedIntern === member.name ? "bold" : "normal",
                  }}
                >
                  {member.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Task Form */}
         
        </>
      )}

      {/* Tasks List */}
      <div className="tasks-section">
        <h3>
          <span className="tasksmore">Tasks List</span>
        </h3>
        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`task-item ${animationMap[task._id] || ""}`}
              onAnimationEnd={() =>
                setAnimationMap((prev) => {
                  const updated = { ...prev };
                  delete updated[task._id];
                  return updated;
                })
              }
            >
              <div className="task-details">
                <h4>{task.title || task.task}</h4>
                <p>Assigned to: {getAssignedName(task)}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`status-label status-${task.status
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    {formatStatus(task.status)}
                  </span>
                </p>
                <p>
                  Assigned Date:{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p>
                  Due Date:{" "}
                  {task.dueDate1
                    ? new Date(task.dueDate1).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
             
            </div>
          ))
        )}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          window.location.reload();
        }}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default Task;