import {useState, useEffect} from 'react';
import {requestApi} from '../../services/request';
import {requestMethods} from '../../services/requestMethods';
import AnnouncementModal from './components/AnnouncementModal';
import AssignmentModal from './components/AssignmentModal';
import InviteStudentModal from './components/InviteStudentModal';
import CourseCard from './components/CourseCard';
import './InstructorPage.css';

const InstructorPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="instructor-page">
            <h1>My Courses</h1>

            <div className="courses-grid">

            </div>

        </div>
    );
};

export default InstructorPage;