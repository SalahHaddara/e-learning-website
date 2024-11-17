import './App.css'
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/register"/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
