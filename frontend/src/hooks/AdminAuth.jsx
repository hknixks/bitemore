import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import baseUrl from '../BaseUrl';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/User.slice';

const useAdminAuthorization = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const token = localStorage.token;
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            axios.get(baseUrl + `/adminAuthorization`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }).then((res) => {
                if (res.data.status) {
                    const result = res.data.user
                    setUser(result);
                    dispatch(addUser(result));
                } else {
                    localStorage.removeItem('token')
                    navigate('/admin/login')
                }
            }).catch((err) => {
                if (err) {
                    enqueueSnackbar('token expire!', { variant: 'warning' });
                    navigate('/admin/login')
                }
                
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            navigate('/admin/login')
        }
    }, [])

    return { user, isLoading }
}

export default useAdminAuthorization;
