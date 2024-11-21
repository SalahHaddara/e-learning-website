import './../Dashboard.css';

const UserCard = ({user, onBan}) => {
    return (
        <div className="card">
            <h3>{user.username}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.status ? 'Active' : 'Banned'}</p>
            {user.status && (
                <button className="button delete" onClick={() => onBan(user.id)}>
                    Ban User
                </button>
            )}
        </div>
    );
};

export default UserCard;