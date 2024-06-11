/* eslint-disable*/
import '@babel/polyfill';
import { login } from './login.js';
import { displayMap } from './mapbox.js';

const MAP_BOX = document.getElementById('map');
const LOGIN_FORM = document.querySelector('.form');

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
    }
});