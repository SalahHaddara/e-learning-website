import {useState} from 'react';

const InviteStudentModal = ({onClose, onSubmit}) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email);
    };

    return (
        <>
            <div className="backdrop" onClick={onClose}/>
            <div className="modal">
                <h2>Invite Student</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Student Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter student's email"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Invite</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default InviteStudentModal;