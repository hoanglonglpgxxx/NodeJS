/* eslint-disable*/
import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateInfo } from './updateSettings.js';

const MAP_BOX = document.getElementById('map');
const LOGIN_FORM = document.querySelector('.form--login');
const LOGOUT_BTN = document.querySelector('.nav__el--logout');
const USER_DATA_FORM = document.querySelector('.form-user-data');

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
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            updateInfo(name, email);
        });
    }
});