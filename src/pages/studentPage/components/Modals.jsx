import {useState} from 'react';
import PropTypes from 'prop-types';

export const CommentModal = ({onClose, onSubmit}) => {
    const [formData, setFormData] = useState({
        content: '',
        is_private: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}/>
            <div className="modal">
                <h2>Add Comment</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="content">Comment:</label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                content: e.target.value
                            }))}
                            required
                        />
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.is_private}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    is_private: e.target.checked
                                }))}
                            />
                            Make Private
                        </label>
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export const AssignmentSubmissionModal = ({assignment, onClose, onSubmit}) => {
    const [formData, setFormData] = useState({
        submission_text: '',
        attachment: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('submission_text', formData.submission_text);
        if (formData.attachment) {
            data.append('attachment', formData.attachment);
        }
        onSubmit(data);
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}/>
            <div className="modal">
                <h2>Submit Assignment</h2>
                <div className="assignment-details">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <p>Due: {new Date(assignment.due_date).toLocaleString()}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="submission_text">Submission Text:</label>
                        <textarea
                            id="submission_text"
                            value={formData.submission_text}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                submission_text: e.target.value
                            }))}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="attachment">Attachment (optional):</label>
                        <input
                            type="file"
                            id="attachment"
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                attachment: e.target.files[0]
                            }))}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

CommentModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

AssignmentSubmissionModal.propTypes = {
    assignment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        due_date: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};