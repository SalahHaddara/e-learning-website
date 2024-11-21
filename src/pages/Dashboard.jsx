import {useState, useEffect} from 'react';
import './dashboard/Dashboard.css';
import {requestMethods} from "../services/request/enums/requestMethods.js";
import {requestApi} from "../services/request/requestApi.js";
import UserCard from "./dashboard/components/UserCard.jsx";
import CourseCard from "./dashboard/components/CourseCard.jsx";
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

    const handleDeleteCourse = async (courseId) => {
        try {
            await requestApi({
                route: '/courses/delete',
                method: requestMethods.DELETE,
                body: {course_id: courseId}
            });
            await fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleAssignInstructor = async (courseId, instructorId) => {
        try {
            await requestApi({
                route: '/courses/teaching',
                method: requestMethods.POST,
                body: {course_id: courseId, instructor_id: instructorId}
            });
            await fetchCourses();
            
        } catch (error) {
            console.error('Error assigning instructor:', error);
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

            <section className="section">
                <h2>Courses</h2>
                <button className="button" onClick={() => setShowCreateCourse(true)}>
                    Create New Course
                </button>
                <div className="grid">
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            instructors={instructors}
                            onAssignInstructor={handleAssignInstructor}
                            onDelete={handleDeleteCourse}
                        />
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