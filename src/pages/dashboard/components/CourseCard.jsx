const CourseCard = ({course, instructors, onAssignInstructor, onDelete}) => {
    return (
        <div className="card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <select
                onChange={(e) => onAssignInstructor(course.id, e.target.value)}
                value={course.instructor_id || ''}
            >
                <option value="">
                    Select Instructor
                </option>
                {instructors.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                        {instructor.username}
                    </option>
                ))}
            </select>
            <button className="button delete" onClick={() => onDelete(course.id)}>
                Delete Course
            </button>
        </div>
    );
};

export default CourseCard;