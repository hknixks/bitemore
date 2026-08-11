import * as Yup from 'yup';

export const profileSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

export const passwordSchema = Yup.object().shape({
    password: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().required('New Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});