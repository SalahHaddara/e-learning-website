import PropTypes from 'prop-types';

const StudentCourseCard = ({course, onViewAnnouncements, onViewAssignments, onAddComment}) => {
    return (
        <div className="card">
            <div className="course-header">
                <h3>{course.title}</h3>
                <span className="status">{course.status === "1" ? "Active" : "Inactive"}</span>
            </div>
            <p className="description">{course.description || 'No description available'}</p>
            <p>Instructor: {course.instructor_name || 'Not assigned'}</p>
            <p>Created: {new Date(course.create_time).toLocaleDateString()}</p>

            <div className="card-actions">
                <button
                    className="button primary"
                    onClick={() => onViewAnnouncements(course.id)}
                >
                    View Announcements
                </button>
                <button
                    className="button primary"
                    onClick={() => onViewAssignments(course.id)}
                >
                    View Assignments
                </button>
                <button
                    className="button secondary"
                    onClick={() => onAddComment(course.id)}
                >
                    Add Comment
                </button>
            </div>
        </div>
    );
};

StudentCourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        status: PropTypes.string,
        create_time: PropTypes.string,
        instructor_name: PropTypes.string
    }).isRequired,
    onViewAnnouncements: PropTypes.func.isRequired,
    onViewAssignments: PropTypes.func.isRequired,
    onAddComment: PropTypes.func.isRequired
};

export default StudentCourseCard;