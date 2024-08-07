/* eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateInfo } from './updateSettings.js';
import { bookingTour } from './stripe.js';

const MAP_BOX = document.getElementById('map');
const LOGIN_FORM = document.querySelector('.form--login');
const LOGOUT_BTN = document.querySelector('.nav__el--logout');
const USER_DATA_FORM = document.querySelector('.form-user-data');
const USER_PASSWORD_FORM = document.querySelector('.form-user-password');
const BOOKING_BTN = document.querySelector('#book-tour');

if (MAP_BOX) {
    const locations = JSON.parse(MAP_BOX.dataset.locations);
    displayMap(locations);
}

document.addEventListener('DOMContentLoaded', function () {
    if (LOGIN_FORM) {
        LOGIN_FORM.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    };

    if (LOGOUT_BTN) LOGOUT_BTN.addEventListener('click', logout);
    if (USER_DATA_FORM) {
        USER_DATA_FORM.addEventListener('submit', e => {
            e.preventDefault();
            const form = new FormData();
            form.append('name', document.getElementById('name').value);
            form.append('email', document.getElementById('email').value);
            form.append('photo', document.getElementById('photo').files[0]);
            console.log(document.getElementById('photo').files[0]);
            updateInfo(form, 'data');
        });
    }
    if (USER_PASSWORD_FORM) {
        USER_PASSWORD_FORM.addEventListener('submit', async e => {
            e.preventDefault();
            document.querySelector('.btn--save-password').textContent = 'Updating...';
            const currentPassword = document.getElementById('password-current').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('password-confirm').value;
            await updateInfo({ currentPassword, password, confirmPassword }, 'password');

            document.querySelector('.btn--save-password').textContent = 'Save password';
        });
    }
    if (BOOKING_BTN) {
        BOOKING_BTN.addEventListener('click', e => {
            e.target.textContent = 'Processing...';
            const { tourId } = e.target.dataset;
            bookingTour(tourId);
        });
    }
});