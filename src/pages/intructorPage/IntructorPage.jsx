import {useEffect, useState} from 'react';
import './InstructorPage.css';
import {requestApi} from "../../services/request/requestApi.js";
import {requestMethods} from "../../services/request/enums/requestMethods.js";
import CourseCard from "../dashboard/components/CourseCard.jsx";
import AnnouncementModal from "./components/AnnouncementModal.jsx";
import AssignmentModal from "./components/AssignmentModal.jsx";
import InviteStudentModal from "./components/InviteStudentModal.jsx";

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
                route: '/courses/create-announcement',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse.id,
                    ...data
                }
            });
            setShowAnnouncementModal(false);
            fetchCourses();
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement. Please try again.');
        }
    };

    const handleCreateAssignment = async (data) => {
        try {
            await requestApi({
                route: '/courses/create-assignment',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse.id,
                    ...data
                }
            });
            setShowAssignmentModal(false);
            fetchCourses();
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Failed to create assignment. Please try again.');
        }
    };

    const handleInviteStudent = async (email) => {
        try {
            await requestApi({
                route: '/courses/invite-student',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse.id,
                    email: email
                }
            });
            setShowInviteModal(false);
            fetchCourses();
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
                        <CourseCard
                            key={course.id}
                            course={course}
                            onCreateAnnouncement={() => {
                                setSelectedCourse(course);
                                setShowAnnouncementModal(true);
                            }}
                            onCreateAssignment={() => {
                                setSelectedCourse(course);
                                setShowAssignmentModal(true);
                            }}
                            onInviteStudent={() => {
                                setSelectedCourse(course);
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