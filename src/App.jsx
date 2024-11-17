import './App.css'
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" component={Login}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
