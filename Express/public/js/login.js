/* eslint-disable*/
import axios from 'axios';
import { showAlert, hideAlert } from './alert';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        console.log(res);
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        /* document.querySelector('label.error').textContent = err.response.data.message ? err.response.data.message : 'Email or password is missing';
        document.querySelector('label.error').style.display = 'block'; */
        showAlert('error', err.response.data.message);
    }
};