import axios from 'axios';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost/e-learning-website/backend/login.php',
            JSON.stringify(formData),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        console.log(response.data);
        console.log(formData);
        navigate('/dashboard');
    }
    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "email") {
            setFormData({...formData, email: value});
        } else if (name === "password") {
            setFormData({...formData, password: value});
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="email"></label>
                <input type="email" id="email" name="email" placeholder="email" value={formData.email}
                       onChange={handleChange}/>
                <label htmlFor="password"></label>
                <input type="password" id="password" name="password" placeholder="password" value={formData.password}
                       onChange={handleChange}/>

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
