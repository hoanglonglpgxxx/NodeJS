/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

export const updateInfo = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/users/update-data',
            data: {
                name,
                email
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Information updated successfully!');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};