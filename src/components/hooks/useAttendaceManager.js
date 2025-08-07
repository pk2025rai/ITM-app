// hooks/useAttendanceManager.js
import { useEffect, useState } from "react";

export const useAttendanceManager = (API_BASE) => {
  const [members, setMembers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [fetchedAttendance, setFetchedAttendance] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  


  // Add/Delete Form States
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', mentorId: '', dateOfJoining: '' });
  const [addUserMessage, setAddUserMessage] = useState('');
  const [deleteUserMessage, setDeleteUserMessage] = useState('');
  const [searchTermToDelete, setSearchTermToDelete] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [filteredMembersToDelete, setFilteredMembersToDelete] = useState([]);

  // Fetch members & mentors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersRes = await fetch(`${API_BASE}/api/members`);
        const membersData = await membersRes.json();
        setMembers(membersData);
        setFilteredMembers(membersData);

        const mentorsRes = await fetch(`${API_BASE}/api/mentors`);
        const mentorsData = await mentorsRes.json();
        setMentors(mentorsData);
      } catch (err) {
        console.error("Error fetching members or mentors:", err);
      }
    };
    fetchData();
  }, [API_BASE]);

  // Filter member search
  useEffect(() => {
    setFilteredMembers(
      members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, members]);

  // Filter member delete search
  useEffect(() => {
    if (searchTermToDelete.trim()) {
      setFilteredMembersToDelete(
        members.filter(m =>
          m.name.toLowerCase().includes(searchTermToDelete.toLowerCase())
        )
      );
    } else {
      setFilteredMembersToDelete([]);
    }
  }, [searchTermToDelete, members]);

  // Auto-fetch attendance on date/members change (exclude weekends)
  useEffect(() => {
    const day = new Date(selectedDate).getDay();
    if (day === 0 || day === 6) {
      setMessage("📅 Today is a weekend.");
      setFetchedAttendance({});
      return;
    }

    if (selectedDate && members.length > 0) {
      fetchAllAttendance(selectedDate);
    }
  }, [selectedDate, members]);

  // Fetch attendance for all members
  const fetchAllAttendance = async (selectedDate) => {
    setIsLoading(true);
    setMessage('');
    try {
      const parsedDate = new Date(selectedDate).toLocaleDateString();

      const attendanceResults = await Promise.all(
        members.map(async (member) => {
          const res = await fetch(`${API_BASE}/api/members/members/${member._id}/attendance`);
          if (res.ok) {
            const data = await res.json();
            const matching = data.attendance.find(item =>
              new Date(item.date).toLocaleDateString() === parsedDate
            );
            return {
              memberId: member._id,
              attendance: matching ? matching : { present: false, leaveReason: '' }
            };
          }
          return {
            memberId: member._id,
            attendance: { present: false, leaveReason: '' }
          };
        })
      );

      const attendanceRecords = {};
      attendanceResults.forEach(({ memberId, attendance }) => {
        attendanceRecords[memberId] = attendance;
      });

      setFetchedAttendance(attendanceRecords);
      setMessage("Attendance data fetched successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/Register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...newUser,
          role: "intern"
        })
      });

      const data = await res.json();

      if (res.ok) {
        setAddUserMessage("User added successfully.");
        setNewUser({ name: "", email: "", password: "", mentorId: '', dateOfJoining: '' });
        setShowAddUserForm(false);
        // Refresh member list
        const refreshRes = await fetch(`${API_BASE}/api/members`);
        const refreshed = await refreshRes.json();
        setMembers(refreshed);
        setFilteredMembers(refreshed);
      } else {
        setAddUserMessage(data.error || "Failed to add user.");
      }
    } catch (error) {
      setAddUserMessage(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedMemberId) return;
    try {
      const res = await fetch(`${API_BASE}/api/members/members/${selectedMemberId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setMembers(prev => prev.filter(m => m._id !== selectedMemberId));
        setFilteredMembers(prev => prev.filter(m => m._id !== selectedMemberId));
        setFilteredMembersToDelete(prev => prev.filter(m => m._id !== selectedMemberId));
        setFetchedAttendance(prev => {
          const updated = { ...prev };
          delete updated[selectedMemberId];
          return updated;
        });

        setDeleteUserMessage("Member deleted successfully.");
        setSelectedMemberId('');
        setSearchTermToDelete('');
        setShowDeleteUserForm(false);
      } else {
        const data = await res.json();
        setDeleteUserMessage(data.error || "Failed to delete user.");
      }
    } catch (err) {
      setDeleteUserMessage(err.message);
    }
  };

 


  return {
    members,
    mentors,
    filteredMembers,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    fetchedAttendance,
    message,
    isLoading,
    showAddUserForm,
    setShowAddUserForm,
    newUser,
    setNewUser,
    handleAddUser,
    addUserMessage,
    showDeleteUserForm,
    setShowDeleteUserForm,
    handleDeleteUser,
    deleteUserMessage,
    searchTermToDelete,
    setSearchTermToDelete,
    selectedMemberId,
    setSelectedMemberId,
    filteredMembersToDelete,
    
  };
};
