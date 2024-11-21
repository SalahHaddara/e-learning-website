import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children, allowedRole}) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login"/>;
    }

    if (user.role !== allowedRole) {

        switch (user.role) {
            case 'admin':
                return <Navigate to="/dashboard"/>;
            case 'instructor':
                return <Navigate to="/instructor"/>;
            case 'student':
                return <Navigate to="/student"/>;
            default:
                return <Navigate to="/login"/>;
        }
    }

    return children;
};

export default ProtectedRoute;