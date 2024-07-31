import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const UserList = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json(); // Parse the response as JSON
            console.log(data.data); // Log the parsed data.data
            setUsers(data.data); // Set the user data
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    const addEditHandle = (id = '') => {
        navigate(`/users/add-update/?id=${id}`);

    }
    return (
        <div>
            <div>
                <h1>User List</h1>
                <button onClick={()=>addEditHandle()}>Add User</button>
            </div>
            <ul>
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id}>{user.name}
                            <button onClick={()=>addEditHandle(user.id)}> Edit </button>
                        </li>
                    ))
                ) : (
                    <li>No users found</li>
                )}
            </ul>
        </div>
    );
};

export default UserList;
