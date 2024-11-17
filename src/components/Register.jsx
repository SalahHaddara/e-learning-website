const Register = () => {
    return (
        <div>
            <h2>Register</h2>
            <form action="">
                <label htmlFor="username"></label>
                <input type="text" id="username" name="username" placeholder="username"/>
                <label htmlFor="email"></label>
                <input type="text" id="email" name="email" placeholder="email"/>
                <label htmlFor="password"></label>
                <input type="password" id="password" name="password" placeholder="password"/>
                <label htmlFor="role"></label>
                <select name="role" id="role">
                    <option value="student">student</option>
                    <option value="instructor">instructor</option>
                    <option value="admin">admin</option>
                </select>

                <button type="submit">Register</button>
            </form>

        </div>);
};

export default Register;