import React from "react";
import { useAttendanceManager } from "../hooks/useAttendaceManager";
import "../styles/AttendancePage.css";
import "../styles/adduser.css";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const AttendancePage = () => {
  const manager = useAttendanceManager(API_BASE);
  const downloadAttendanceCSV = () => {
    const rows = [["Name", "Month", "Present / Total Days", "Date of Joining"]];

    const selectedDate = new Date(manager.selectedDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = selectedDate.toLocaleString("default", { month: "long" });

    const interns = manager.filteredMembers
      .filter((m) => m.role === "intern")
      .sort((a, b) => a.name.localeCompare(b.name));

    interns.forEach((member) => {
      const attendanceArray = member.attendance || [];
      let presentCount = 0;

      attendanceArray.forEach((record) => {
        const recordDate = new Date(record.date);
        if (
          recordDate.getFullYear() === year &&
          recordDate.getMonth() === month &&
          record.present
        ) {
          presentCount++;
        }
      });

      rows.push([
        member.name,
        `${monthName} ${year}`,
        `="${presentCount}/${daysInMonth}"`,
        member.dateOfJoining
          ? new Date(member.dateOfJoining).toLocaleDateString()
          : "",
      ]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `monthly_attendance_${year}_${month + 1}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="attendance-page">
      <button
        onClick={() => manager.setShowAddUserForm((prev) => !prev)}
        disabled={manager.isLoading}
      >
        {manager.showAddUserForm ? "Close" : "Add New User"}
      </button>

      <button
        onClick={() => manager.setShowDeleteUserForm((prev) => !prev)}
        disabled={manager.isLoading}
      >
        {manager.showDeleteUserForm ? "Close Delete User" : "Delete User"}
      </button>
      {manager.showAddUserForm && (
        <div className="add-user-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              manager.handleAddUser();
            }}
          >
            <button
              className="closes"
              aria-label="Close form"
              disabled={manager.isLoading}
              type="button"
              onClick={() => manager.setShowAddUserForm(false)}
            >
              &times;
            </button>
            <h3>Add User</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={manager.newUser.name}
              onChange={(e) =>
                manager.setNewUser({ ...manager.newUser, name: e.target.value })
              }
              disabled={manager.isLoading}
              required
            />
            <br />
            <input
              type="email"
              placeholder="Email"
              value={manager.newUser.email}
              onChange={(e) =>
                manager.setNewUser({
                  ...manager.newUser,
                  email: e.target.value,
                })
              }
              disabled={manager.isLoading}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={manager.newUser.password}
              onChange={(e) =>
                manager.setNewUser({
                  ...manager.newUser,
                  password: e.target.value,
                })
              }
              disabled={manager.isLoading}
              required
            />
            <br />
            <select
              disabled={manager.isLoading}
              value={manager.newUser.mentorId}
              onChange={(e) =>
                manager.setNewUser({
                  ...manager.newUser,
                  mentorId: e.target.value,
                })
              }
              required
            >
              <option value="">Select Mentor</option>
              {manager.mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.name}
                </option>
              ))}
            </select>
            <br />
            <p className="joins">Joining Date:</p>
            <input
              type="date"
              value={manager.newUser.dateOfJoining}
              onChange={(e) =>
                manager.setNewUser({
                  ...manager.newUser,
                  dateOfJoining: e.target.value,
                })
              }
              disabled={manager.isLoading}
              required
            />
            <button type="submit" disabled={manager.isLoading}>
              {manager.isLoading ? "Creating..." : "Add User"}
            </button>
            {manager.addUserMessage && <p>{manager.addUserMessage}</p>}
          </form>
        </div>
      )}

      {manager.showDeleteUserForm && (
        <div className="add-user-form">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              manager.handleDeleteUser();
            }}
          >
            <button
              className="closes"
              aria-label="Close form"
              disabled={manager.isLoading}
              type="button"
              onClick={() => manager.setShowDeleteUserForm(false)}
            >
              &times;
            </button>
            <h3>Delete User</h3>
            <input
              type="text"
              placeholder="Search by name"
              value={manager.searchTermToDelete}
              onChange={(e) => manager.setSearchTermToDelete(e.target.value)}
              disabled={manager.isLoading}
            />
            <br />
            {manager.filteredMembersToDelete.length > 0 ? (
              <select
                disabled={manager.isLoading}
                value={manager.selectedMemberId}
                onChange={(e) => manager.setSelectedMemberId(e.target.value)}
                required
              >
                <option value="">Select Member</option>
                {manager.filteredMembersToDelete.map((mem) => (
                  <option key={mem._id} value={mem._id}>
                    {mem.name}
                  </option>
                ))}
              </select>
            ) : manager.searchTermToDelete ? (
              <p>No members found matching "{manager.searchTermToDelete}"</p>
            ) : null}
            <br />
            <button
              type="submit"
              disabled={manager.isLoading || !manager.selectedMemberId}
            >
              {manager.isLoading ? "Deleting..." : "Delete User"}
            </button>
            {manager.deleteUserMessage && <p>{manager.deleteUserMessage}</p>}
          </form>
        </div>
      )}

      <h2>View Attendance</h2>
      {manager.message && (
        <p className={`message ${manager.isLoading ? "processing" : ""}`}>
          {manager.message}
        </p>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by member name..."
          value={manager.searchTerm}
          onChange={(e) => manager.setSearchTerm(e.target.value)}
          disabled={manager.isLoading}
          className="search-input"
        />
        <input
          type="date"
          value={manager.selectedDate}
          onChange={(e) => manager.setSelectedDate(e.target.value)}
          disabled={manager.isLoading}
          className="date-picker"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Date</th>
            <th>Attendance</th>
            <th>Leave</th>
            <th>Joining Date</th>
          </tr>
        </thead>
        <tbody>
          {manager.filteredMembers
            .filter((m) => m.role === "intern")
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((member) => {
              const attendance = manager.fetchedAttendance[member._id];
              return (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{new Date(manager.selectedDate).toLocaleDateString()}</td>
                  <td
                    style={{
                      backgroundColor: attendance?.leaveReason
                        ? "rgb(215 200 88)"
                        : attendance?.present
                        ? "#d0f0c0"
                        : "rgb(197 168 166)",
                    }}
                  >
                    {attendance?.present ? "Yes" : "No"}
                  </td>
                  <td
                    style={{
                      backgroundColor: attendance?.leaveReason ? "white" : "",
                    }}
                  >
                    {attendance?.leaveReason || ""}
                  </td>
                  <td>
                    {member.dateOfJoining
                      ? new Date(member.dateOfJoining).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <div
        className="color-legend"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "40px",
          flexWrap: "wrap",
          marginTop: "30px",
        }}
      >
        <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
          <li style={{ marginBottom: "15px" }}>
            <span
              style={{
                backgroundColor: "#d0f0c0",
                color: "black",
                padding: "5px 10px",
                borderRadius: "5px",
                marginRight: "17px",
              }}
            >
              Present
            </span>{" "}
            - Present
          </li>
          <li style={{ marginBottom: "15px" }}>
            <span
              style={{
                backgroundColor: "rgb(215 200 88)",
                padding: "5px 10px",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            >
              On leave
            </span>{" "}
            - The person has notified in advance about their leave.
          </li>
          <li style={{ marginBottom: "15px" }}>
            <span
              style={{
                backgroundColor: "rgb(197 168 166)",
                color: "black",
                padding: "5px 10px",
                borderRadius: "5px",
                marginRight: "22px",
              }}
            >
              Absent
            </span>{" "}
            - Absent for the past week without any communication.
          </li>
        </ul>

        <button
          onClick={downloadAttendanceCSV}
          className="icon-only-btn"
          title="Download Attendance CSV"
          disabled={
            manager.filteredMembers.filter((m) => m.role === "intern")
              .length === 0
          }
          style={{
            background: " linear-gradient(135deg, #f92609, #f92609)",
            color: "#fff",
            marginTop: "20px",
            padding: "10px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            height: "fit-content",
          }}
        >
          Download Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
