import {useState} from 'react';

const CreateCourseModal = ({onClose, onCreate}) => {
    const [courseData, setCourseData] = useState({title: '', description: ''});

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(courseData);
        onClose();
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}/>
            <div className="modal">
                <h2>Create New Course</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Course Title"
                        value={courseData.title}
                        onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                    />
                    <textarea
                        placeholder="Description"
                        value={courseData.description}
                        onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                    />
                    <button className="button" type="submit">Create</button>
                    <button className="button" type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </>
    );
};

export default CreateCourseModal;