const Login = () => {
    return (
        <div>
            <h2>Login</h2>
            <form action="">
                <label htmlFor="email"></label>
                <input type="text" id="email" name="email" placeholder="email"/>
                <label htmlFor="pasword"></label>
                <input type="pasword" id="pasword" name="pasword" placeholder="pasword"/>

                <button type="submit">Register</button>
            </form>

        </div>);
};

export default Login;