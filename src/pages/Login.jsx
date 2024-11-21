import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {requestApi} from "../services/request/requestApi.js";
import {requestMethods} from "../services/request/enums/requestMethods.js";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const response = await axios.post('http://localhost/e-learning-website/backend/login.php',
    //         JSON.stringify(formData),
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //     console.log(response.data);
    //     console.log(formData);
    //     navigate('/dashboard');
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestApi({
                route: '/login',
                method: requestMethods.POST,
                body: formData
            });

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            switch (response.user.role) {
                case 'admin':
                    navigate('/dashboard');
                    break;
                case 'instructor':
                    navigate('/instructor');
                    break;
                case 'student':
                    navigate('/student');
                    break;
                default:
                    console.error('Invalid user role');
            }
        } catch (error) {
            console.error(error.message || 'Login failed');
        }
    };

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
                       onChange={handleChange} required/>
                <label htmlFor="password"></label>
                <input type="password" id="password" name="password" placeholder="password" value={formData.password}
                       onChange={handleChange} required/>

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
