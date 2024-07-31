import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
const AddUpdate = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('User created:', data);
            handleBackBtn()
        } catch (error) {
            console.log(error.message);
        }
    };
    const getUserById = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/${id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const userGetData = data.data
            console.log('User Fetch:', data);
            setUserData((prev) => ({
                ...prev,
                ...userGetData
            }));
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleBackBtn = () => {
        navigate('/users')
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => {
        if (id) {
            getUserById()
        }
    }, [id])
    return (
        <div>
            <h1>Add/Edit User</h1>
            <button onClick={handleBackBtn}>Back</button>

            <div>
                <div>{`${id ? 'Update' : 'Add'}`} User</div>
                <form>


                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        autoComplete="name"
                        placeholder="User Name"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="email"
                        value={userData.email}
                        autoComplete="email"
                        placeholder="User email"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        autoComplete="current-password"
                        placeholder="User password"
                        onChange={handleChange}
                    />
                </form>
                <button onClick={handleSubmit}>Add User</button>
            </div>
        </div>
    );
};

export default AddUpdate;

