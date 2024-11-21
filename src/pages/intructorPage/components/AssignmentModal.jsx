import InviteStudentModal from "./InviteStudentModal.jsx";

const AssignmentModal = ({onClose, onSubmit}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}/>
            <div className="modal">
                <h2>Create Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="due_date">Due Date:</label>
                        <input
                            type="datetime-local"
                            id="due_date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Create</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};
export default InviteStudentModal;