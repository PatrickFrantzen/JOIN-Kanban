let mailForgotPassword;
let contacts = [];

async function initLogin() {
    await loadDataFromServer();
    await init();
    setTimeout(addClassList, 1000, 'login-overlay', 'd-none');
}

function switchOverview(idHide, idShow, classList) {
    addClassList(idHide, classList);
    removeClassList(idShow, classList);
}


async function signup() {
    let name = document.getElementById('signup-name');
    let email = document.getElementById('signup-email');
    let password = document.getElementById('signup-password');
    let color = await getNextFreeColor();
    getContactsinformationForNewUser();
    await addDataToUserInformation(name, email, password, color);
    switchOverview('signup', 'login', 'd-none');
}



//TODO: edit contacts structure, so this function will not longer be needed
function getContactsinformationForNewUser() {
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if (notGuestAccount(user)) {
            let name = user.fullname;
            let email = user.mail;
            let color = user.color;
            addContactsToNewUser(name, email, color);
        }
    }
}


function addContactsToNewUser(name, email, color){
    let contact = {fullname: name, mail: email, color: color};
    contacts.push(contact);
}


async function getNextFreeColor(){
    for (let i = 0; i < contactColors.length; i++) {
        let color = contactColors[i];
        if(!color.used){
            contactColors[i].used = true;
            await backend.setItem('contactColors', contactColors);
            return color.color;
        }
    }
}


async function addDataToUserInformation(name, email, password, color) {
    let userInfo = { fullname: name.value, password: password.value, mail: email.value, img: "img/contacts/newUser.png", color: color, contacts: contacts};
    userInformation.push(userInfo);
    await backend.setItem('userInformation', JSON.stringify(userInformation));
}


function login() {
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    let emailArray = getEmailDataFromJson();
    let index = getIndexOfArray(emailArray, email.value);
    checkLoginData(index, password);
}


//TODO: change alert to other user response
function checkLoginData(index, password) {
    if (index == -1) {
        alert('Your email is not registered yet, please sign up');
        switchOverview('login', 'signup', 'd-none');
    } else if (userInformation[index].password === password.value) {
        switchOtherHtml('summary.html?');
        checkIncognitoModeToLogin(index);
    } else {
        alert('Your password is not correct, please try again');
    }
}


function checkIncognitoModeToLogin(index) {
    try {
        setActiveUserToLocalStorage('activeUser', userInformation[index].fullname);
    }
    catch (e) {
        activeUserIndex = 2;
        activeUser = 'Guest Account';
    }
}


function guestLogin() {
    switchOtherHtml('summary.html?');
    activeUserIndex = 2;
    checkIncognitoModeToLogin(activeUserIndex);
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


async function forgotPassword() {
    mailForgotPassword = document.getElementById('mailForgotPassword').value;
    for (let i = 0; i < userInformation.length; i++) {
        let mail = userInformation[i].mail;
        if (mail == mailForgotPassword) {
            let userIndexForgotPassword = i;
            await backend.setItem('userIndexForgotPassword', userIndexForgotPassword);
        }
    }
}

async function changePassword() {
    let password = document.getElementById('reset-password');
    let confirmedPassword = document.getElementById('confirm-password');
    await checkNewPassword(password, confirmedPassword);
    showUserResponseOverlay('reset-password-overlay');
}



//TODO: change alert to other user response
async function checkNewPassword(password, confirmedPassword) {
    if (password.value === confirmedPassword.value) {
        await saveNewPassword(password);
        switchOtherHtml('index.html');
    } else {
        alert('The entered passwords do not match. Please repeat your entry');
    }
}

async function saveNewPassword(password) {
    userInformation[userIndexForgotPassword].password = password.value;
    await backend.setItem('userInformation', JSON.stringify(userInformation));
    await backend.setItem('userIndexForgotPassword', NaN);
}


function logout() {
    removeActiveUserFromLocalStorage();
    switchOtherHtml('index.html?');
    addClassList('signup', 'd-none');
    addClassList('forgotpassword', 'd-none');
    addClassList('resetpassword', 'd-none');
    removeClassList('login', 'd-none');
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

