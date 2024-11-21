import {useState} from 'react';

const AnnouncementModal = ({onClose, onSubmit}) => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}/>
            <div className="modal">
                <h2>Create Announcement</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                title: e.target.value
                            }))}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content">Content:</label>
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
                    <div className="modal-buttons">
                        <button type="submit">Create</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AnnouncementModal;