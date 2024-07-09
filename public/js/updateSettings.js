/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

//type is either 'password' or 'data'
export const updateInfo = async (data, type) => {
    try {
        const url = type === 'password' ? 'update-password' : 'update-data';
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/${url}`,
            data
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Information updated successfully!');
            setTimeout(() => {
                location.reload(true);
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};