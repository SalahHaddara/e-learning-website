import {useState, useEffect} from 'react';

import './Dashboard.css';
import {requestMethods} from "../services/request/enums/requestMethods.js";
import {requestApi} from "../services/request/requestApi.js";
import UserCard from "./dashboard/components/UserCard.jsx";
import CreateCourseModal from "./dashboard/components/CreateCourseModal.jsx";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await requestApi({
                route: '/users/list',
                method: requestMethods.GET
            });
            setUsers(response.users);
            setInstructors(response.users.filter(user => user.role === 'instructor'));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await requestApi({
                route: '/courses/stream',
                method: requestMethods.GET
            });
            setCourses(response.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleBanUser = async (userId) => {
        try {
            await requestApi({
                route: '/users/ban',
                method: requestMethods.POST,
                body: {user_id: userId}
            });
            await fetchUsers();
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleCreateCourse = async (courseData) => {
        try {
            await requestApi({
                route: '/courses/create',
                method: requestMethods.POST,
                body: courseData
            });
            await fetchCourses();
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };


    return (
        <div className="dashboard">
            <section className="section">
                <h2>Users</h2>
                <div className="grid">
                    {users.map(user => (
                        <UserCard key={user.id} user={user} onBan={handleBanUser}/>
                    ))}
                </div>
            </section>


            {showCreateCourse && (
                <CreateCourseModal
                    onClose={() => setShowCreateCourse(false)}
                    onCreate={handleCreateCourse}
                />
            )}
        </div>
    );
};

export default Dashboard;