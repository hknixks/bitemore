import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
    import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import baseUrl from '../BaseUrl';
import { useDispatch } from 'react-redux';
import { addUser } from '../Redux/User.slice';

const useUserAuthorization = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const token = localStorage.token;
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            axios.get(baseUrl + `/userAuthorization`, {
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
                    navigate('/user/login')
                }
            }).catch((err) => {
                if (err) {
                    enqueueSnackbar('token expire!', { variant: 'warning' });
                    navigate('/user/login')
                }
                
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            navigate('/user/login')
        }
    }, [token])

    return { user, isLoading }
}

export default useUserAuthorization;
