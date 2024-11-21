import {useEffect, useState} from 'react';
import {requestApi} from "../../services/request/requestApi.js";
import {requestMethods} from "../../services/request/enums/requestMethods.js";
import StudentCourseCard from "./components/StudentCourseCard";
import {AssignmentSubmissionModal, CommentModal} from "./components/Modals";
import './StudentPage.css';

const StudentPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await requestApi({
                route: '/courses/enrolled',
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
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (data) => {
        try {
            await requestApi({
                route: '/comments/create',
                method: requestMethods.POST,
                body: {
                    courses_id: selectedCourse,
                    ...data
                }
            });
            setShowCommentModal(false);

        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    };

    const handleAssignmentSubmission = async (data) => {
        try {
            const formData = new FormData();
            formData.append('assignment_id', selectedAssignment.id);
            formData.append('submission_text', data.get('submission_text'));
            if (data.get('attachment')) {
                formData.append('attachment', data.get('attachment'));
            }

            await requestApi({
                route: '/assignments/submit',
                method: requestMethods.POST,
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowAssignmentModal(false);

        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert('Failed to submit assignment. Please try again.');
        }
    };

    const handleViewAnnouncements = async (courseId) => {
        try {
            const response = await requestApi({
                route: '/courses/announcements',
                method: requestMethods.GET,
                params: {course_id: courseId}
            });
            setAnnouncements(response.announcements);
            // Show announcements in a modal or new view
        } catch (error) {
            console.error('Error fetching announcements:', error);
            alert('Failed to load announcements. Please try again.');
        }
    };

    const handleViewAssignments = async (courseId) => {
        try {
            const response = await requestApi({
                route: '/courses/assignments',
                method: requestMethods.GET,
                params: {course_id: courseId}
            });
            setAssignments(response.assignments);

        } catch (error) {
            console.error('Error fetching assignments:', error);
            alert('Failed to load assignments. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading">Loading courses...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="student-page">
            <h1>My Courses</h1>

            {courses.length === 0 ? (
                <div className="no-courses">
                    No courses found. Please enroll in some courses.
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map(course => (
                        <StudentCourseCard
                            key={course.id}
                            course={course}
                            onViewAnnouncements={handleViewAnnouncements}
                            onViewAssignments={handleViewAssignments}
                            onAddComment={() => {
                                setSelectedCourse(course.id);
                                setShowCommentModal(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {showCommentModal && (
                <CommentModal
                    onClose={() => setShowCommentModal(false)}
                    onSubmit={handleAddComment}
                />
            )}

            {showAssignmentModal && selectedAssignment && (
                <AssignmentSubmissionModal
                    assignment={selectedAssignment}
                    onClose={() => {
                        setShowAssignmentModal(false);
                        setSelectedAssignment(null);
                    }}
                    onSubmit={handleAssignmentSubmission}
                />
            )}
        </div>
    );
};

export default StudentPage;