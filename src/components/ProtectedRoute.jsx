import {Navigate} from 'react-router-dom';
import {isAdmin} from '../services/auth';

const ProtectedRoute = ({children}) => {
    if (!localStorage.token || !isAdmin()) {
        return <Navigate to="/login"/>;
    }
    return children;
};

export default ProtectedRoute;