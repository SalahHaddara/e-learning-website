import './App.css'
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InstructorPage from "./pages/intructorPage/IntructorPage.jsx";
import StudentPage from "./pages/studentPage/StudentsPage.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login"/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRole="admin">
                            <Dashboard/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/instructor" element={
                        <ProtectedRoute allowedRole="instructor">
                            <InstructorPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="/student " element={
                        <ProtectedRoute allowedRole="student">
                            <StudentPage/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
