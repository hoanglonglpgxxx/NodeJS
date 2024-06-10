/* eslint-disable*/
const login = (email, pass) => {
    alert(email, password);
};

document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});