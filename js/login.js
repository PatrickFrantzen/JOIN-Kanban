let users = [
    {
        "name": "Nadia Knofius",
        "email": "nadia.knofius@gmail.com",
        "password": "katze123"
    },
    {
        "name": "Patrick Frantzen",
        "email": "patrick.frantzen@gmail.com",
        "password": "mara456"
    }
];

function switchOverview(idHide, idShow, classList) {
    addClassList(idHide, classList);
    removeClassList(idShow, classList);
}


function addUser() {
    let name = document.getElementById('signup-name');
    let email = document.getElementById('signup-email');
    let password = document.getElementById('signup-password');
    users.push({ name: name.value, email: email.value, password: password.value });
    switchOverview('signup', 'login', 'd-none');
}


function login() {
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    let emailArray = getEmailDataFromJson();
    let index = getIndexOfArray(emailArray, email.value);
    checkLoginData(index, password);
}


function checkLoginData() {
    if (index == -1) {
        alert('Your email is not registered yet, please sign up');
        switchOverview('login', 'signup', 'd-none');
    } else if (users[index].password === password.value) {
        window.location.href = 'summary.html';
    } else {
        alert('Your password is not correct, please try again');
    }
}


function getIndexOfArray(array, value) {
    return array.indexOf(value);
}

function getEmailDataFromJson() {
    let emails = [];
    for (let i = 0; i < users.length; i++) {
        emails.push(users[i].email);
    }
    return emails;
}