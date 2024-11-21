import {useEffect, useState} from 'react';
import './InstructorPage.css';
import {requestApi} from "../../services/request/requestApi.js";
import {requestMethods} from "../../services/request/enums/requestMethods.js";
import AnnouncementModal from "./components/AnnouncementModal.jsx";
import AssignmentModal from "./components/AssignmentModal.jsx";
import InviteStudentModal from "./components/InviteStudentModal.jsx";
import InstructorCourseCard from "./components/CourseCard.jsx";

const InstructorPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await requestApi({
                route: '/courses/instructor-courses',
                method: requestMethods.GET
            });

            if (response && response.courses) {
                setCourses(response.courses);
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again later.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAnnouncement = async (data) => {
        try {
            await requestApi({
                route: '/announcements/create',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse,
                    ...data
                }
            });
            setShowAnnouncementModal(false);
            await fetchCourses();
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement. Please try again.');
        }
    };

    const handleCreateAssignment = async (data) => {
        try {
            await requestApi({
                route: '/assignments/create',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse,
                    ...data
                }
            });
            setShowAssignmentModal(false);
            await fetchCourses();
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Failed to create assignment. Please try again.');
        }
    };

    const handleInviteStudent = async (email) => {
        try {
            await requestApi({
                route: '/courses/invite',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse,
                    email: email
                }
            });
            setShowInviteModal(false);
            await fetchCourses();
        } catch (error) {
            console.error('Error inviting student:', error);
            alert('Failed to invite student. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading courses...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="instructor-page">
            <h1>My Courses</h1>

            {courses.length === 0 ? (
                <div className="no-courses">
                    No courses found. Contact an administrator to be assigned to courses.
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map(course => (
                        <InstructorCourseCard
                            key={course.id}
                            course={course}
                            onCreateAnnouncement={() => {
                                setSelectedCourse(course.id);
                                setShowAnnouncementModal(true);
                            }}
                            onCreateAssignment={() => {
                                setSelectedCourse(course.id);
                                setShowAssignmentModal(true);
                            }}
                            onInviteStudent={() => {
                                setSelectedCourse(course.id);
                                setShowInviteModal(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {showAnnouncementModal && (
                <AnnouncementModal
                    onClose={() => setShowAnnouncementModal(false)}
                    onSubmit={handleCreateAnnouncement}
                />
            )}

            {showAssignmentModal && (
                <AssignmentModal
                    onClose={() => setShowAssignmentModal(false)}
                    onSubmit={handleCreateAssignment}
                />
            )}

            {showInviteModal && (
                <InviteStudentModal
                    onClose={() => setShowInviteModal(false)}
                    onSubmit={handleInviteStudent}
                />
            )}
        </div>
    );
};

export default InstructorPage;