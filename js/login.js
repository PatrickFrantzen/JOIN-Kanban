let mailForgotPassword;

async function initLogin() {
    await loadDataFromServer();
    init();
    setTimeout(addClassList, 2000, 'login-overlay', 'd-none');
}

function switchOverview(idHide, idShow, classList) {
    addClassList(idHide, classList);
    removeClassList(idShow, classList);
}


async function signup() {
    let name = document.getElementById('signup-name');
    let email = document.getElementById('signup-email');
    let password = document.getElementById('signup-password');
    switchOverview('signup', 'login', 'd-none');
    addDataToUserInformation(name, email, password);
}


function addDataToUserInformation(name, email, password){
    let userInfo = {fullname: name.value, password: password.value, email: email.value, img: "img/contacts/newUser.png", color: "", contacts: []};
    userInformation.push(userInfo);
    backend.setItem('userInformation', JSON.stringify(userInformation));
}


function login() {
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    let emailArray = getEmailDataFromJson();
    let index = getIndexOfArray(emailArray, email.value);
    checkLoginData(index, password);
}


function checkLoginData(index, password) {
    if (index == -1) {
        alert('Your email is not registered yet, please sign up');
        switchOverview('login', 'signup', 'd-none');
    } else if (userInformation[index].password === password.value) {
        switchOtherHtml('summary.html?');
        setActiveUserToLocalStorage('activeUser', userInformation[index].fullname);
    } else {
        alert('Your password is not correct, please try again');
    }
}


function guestLogin() {
    switchOtherHtml('summary.html?');
    activeUserIndex = 2;
    setActiveUserToLocalStorage('activeUser', userInformation[activeUserIndex].fullname);
}


function switchOtherHtml(htmlName) {
    window.location.href = htmlName;
}


function getIndexOfArray(array, value) {
    return array.indexOf(value);
}

function getEmailDataFromJson() {
    let emails = [];
    for (let i = 0; i < userInformation.length; i++) {
        emails.push(userInformation[i].mail);
    }
    return emails;
}


function forgotPassword() {
    mailForgotPassword = document.getElementById('mailForgotPassword').value;
    switchOverview('forgotpassword', 'resetpassword', 'd-none');
}

function changePassword() {
    let password = document.getElementById('reset-password');
    let confirmedPassword = document.getElementById('confirm-password');
    checkNewPassword(password, confirmedPassword);
}


function checkNewPassword(password, confirmedPassword) {
    if(password.value === confirmedPassword.value){
        for (let i = 0; i < userInformation.length; i++) {
            saveNewPassword(i, password);
        }
        switchOverview('resetpassword', 'login', 'd-none');
    } else {
        alert('The entered passwords do not match. Please repeat your entry');
    }
}

async function saveNewPassword(i, password){
    let user = userInformation[i];
    if(user.mail == mailForgotPassword){
        userInformation[i].password = password.value;
        await backend.setItem('userInformation', JSON.stringify(userInformation));
    }
}


function logout(){
    switchOtherHtml('index.html?'); 
    addClassList('signup', 'd-none');
    addClassList('forgotpassword', 'd-none');
    addClassList('resetpassword', 'd-none');
    removeClassList('login', 'd-none');
    removeActiveUserFromLocalStorage();
}


function setActiveUserToLocalStorage(key, user) {
    localStorage.setItem(key, user);
}


function getActiveUserFromLocalStorage(key) {
    return localStorage.getItem(key);
}


function removeActiveUserFromLocalStorage() {
    localStorage.removeItem('activeUser');
}
