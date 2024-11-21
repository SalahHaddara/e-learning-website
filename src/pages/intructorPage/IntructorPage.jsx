import {useEffect, useState} from 'react';
import './InstructorPage.css';
import {requestApi} from "../../services/request/requestApi.js";
import {requestMethods} from "../../services/request/enums/requestMethods.js";
import CourseCard from "../dashboard/components/CourseCard.jsx";

const InstructorPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await requestApi({
                route: '/courses/instructor-courses',
                method: requestMethods.GET
            });
            setCourses(response.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
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
            // Optionally refresh course data
        } catch (error) {
            console.error('Error creating announcement:', error);
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
            // Optionally refresh course data
        } catch (error) {
            console.error('Error creating assignment:', error);
        }
    };

    const handleInviteStudent = async (email) => {
        try {
            await requestApi({
                route: '/courses/invite-student',
                method: requestMethods.POST,
                body: {
                    course_id: selectedCourse.id,
                    student_email: email
                }
            });
            setShowInviteModal(false);
            fetchCourses(); // Refresh to update student count
        } catch (error) {
            console.error('Error inviting student:', error);
        }
    };

    return (
        <div className="instructor-page">
            <h1>My Courses</h1>

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