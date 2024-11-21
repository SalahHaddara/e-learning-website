import PropTypes from 'prop-types';

const InstructorCourseCard = ({course, onCreateAnnouncement, onCreateAssignment, onInviteStudent}) => {
    return (
        <div className="card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Created: {new Date(course.create_time).toLocaleDateString()}</p>
            <p>Students Enrolled: {course.student_count || 0}</p>

            <div className="card-actions">
                <button
                    className="button primary"
                    onClick={() => onCreateAnnouncement(course.id)}
                >
                    Create Announcement
                </button>
                <button
                    className="button primary"
                    onClick={() => onCreateAssignment(course.id)}
                >
                    Create Assignment
                </button>
                <button
                    className="button secondary"
                    onClick={() => onInviteStudent(course.id)}
                >
                    Invite Student
                </button>
            </div>
        </div>
    );
};

InstructorCourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        create_time: PropTypes.string,
        student_count: PropTypes.number
    }).isRequired,
    onCreateAnnouncement: PropTypes.func.isRequired,
    onCreateAssignment: PropTypes.func.isRequired,
    onInviteStudent: PropTypes.func.isRequired
};

export default InstructorCourseCard;