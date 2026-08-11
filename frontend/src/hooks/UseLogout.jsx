import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/User.slice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function useLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(addUser(null));
        localStorage.removeItem('token');
        navigate('/');  
    };

    return handleLogout;
}

export default useLogout;