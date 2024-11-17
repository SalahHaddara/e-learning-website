import axios from 'axios';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const response = await axios.post('/backend', formData);
        // console.log(response.data);
        console.log(formData);
        navigate('/login');
    }

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "username") {
            setFormData({...formData, username: value});
        } else if (name === "email") {
            setFormData({...formData, email: value});
        } else if (name === "password") {
            setFormData({...formData, password: value});
        } else if (name === "role") {
            setFormData({...formData, role: value});
        }
    };


    return (
        <div>
            <h2>Register</h2>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="username"></label>
                <input type="text" id="username" name="username" placeholder="username" value={formData.username}
                       onChange={handleChange}/>
                <label htmlFor="email"></label>
                <input type="email" id="email" name="email" placeholder="email" value={formData.email}
                       onChange={handleChange}/>
                <label htmlFor="password"></label>
                <input type="password" id="password" name="password" placeholder="password" value={formData.password}
                       onChange={handleChange}/>
                <label htmlFor="role"></label>
                <select name="role" id="role" value={formData.role} onChange={handleChange}>
                    <option value="student">student</option>
                    <option value="instructor">instructor</option>
                    <option value="admin">admin</option>
                </select>

                <button type="submit">Register</button>
            </form>

        </div>);
};

export default Register;