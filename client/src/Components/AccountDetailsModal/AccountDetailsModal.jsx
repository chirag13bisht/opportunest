import React, { useState, useEffect } from "react";
import './AccountDetailsModal.css';
import axios from 'axios'; // Import axios

const AccountDetailsModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState(""); // Store the selected role
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [professionplace, setProfessionPlace] = useState("");
  const [userdata, setuserData] = useState("");
  const [email, setEmail] = useState(""); 

  const callAbout = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/user', {
        withCredentials: true,
      });

      setuserData(res.data);
      setEmail(res.data.email);

      if (res.status !== 200) {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    callAbout();
  }, [])

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setProfession(selectedRole); // Set profession based on role
  };

  // Modified handleSubmit function to include PostUserData
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/userdata', {
        email,
        firstname,
        lastname,
        profession,
        professionplace,
      });

      if (res.status === 422 || !res.data) {
        window.alert("Invalid submission");
        console.log("Invalid submission");
      } else {
        window.alert("Successfully added");
        console.log("Successfully added");
        onClose(); // Close the modal after successful submission
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  if (!isOpen) return null; // Do not render the modal if isOpen is false

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to OpportuNest!</h2>
        <p>Please help us personalize your experience.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            required
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            required
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="role">Are you a student or an employee?</label>
          <select id="role" name="role" value={role} onChange={handleRoleChange} required>
            <option value="">Select one</option>
            <option value="student">Student</option>
            <option value="employee">Employee</option>
          </select>

          {role === "student" && (
            <>
              <label htmlFor="collegeName">College Name:</label>
              <input
                type="text"
                id="collegeName"
                name="collegeName"
                placeholder="College Name"
                value={professionplace}
                onChange={(e) => setProfessionPlace(e.target.value)}
                required
              />
            </>
          )}

          {role === "employee" && (
            <>
              <label htmlFor="companyName">Company Name:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Company Name"
                value={professionplace}
                onChange={(e) => setProfessionPlace(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AccountDetailsModal;
