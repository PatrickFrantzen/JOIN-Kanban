let mailForgotPassword;

async function initLogin() {
    await loadDataFromServer();
    await init();
    setTimeout(addClassList, 1000, 'login-overlay', 'd-none');
}

function switchOverview(idHide, idShow, classList) {
    addClassList(idHide, classList);
    removeClassList(idShow, classList);
}

/**
 * Getting name, email and password of new user
 */
async function signup() {
    let name = checkIfNameIsComplete('signup-name');
    let email = document.getElementById('signup-email');
    let password = document.getElementById('signup-password');
    let color = await getNextFreeColor();
    await addDataToUserInformation(name, email, password, color);
    switchOverview('signup', 'login', 'd-none');
}

/**
 * Function to prevent, that user only insert Forname or last name. Both is required.
 * @returns name of the new user
 */
function checkIfNameIsComplete(id) {
    let regName = /^[a-zA-Z]+( [a-zA-Z]+)+$/;
    let nametocheck = document.getElementById(id).value;
    if(!regName.test(nametocheck)){
        alert('Please enter your full name (first & last name).');
        document.getElementById(id).focus();
    }else{
        return document.getElementById(id);
    }
}

/**
 * To set a not used color for the new user
 * 
 * @returns color of new user
 */
async function getNextFreeColor() {
    let counter = 0;
    for (let i = 0; i < contactColors.length; i++) {
        let color = contactColors[i];
        if (!color.used) {
            contactColors[i].used = true;
            await backend.setItem('contactColors', JSON.stringify(contactColors));
            return color.color;
        }else counter++;
    }
}

/**
 * Pushing log in Data of new User to backend
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {string} password
 * @param {string} color 
 */
async function addDataToUserInformation(name, email, password, color) {
    let userInfo = { fullname: name.value, password: password.value, mail: email.value, img: "img/contacts/newUser.png", color: color, phone: '' };
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


/**
 * Checks if the password matches with userInformation and login
 * 
 * @param {number} index 
 * @param {string} password 
 */
function checkLoginData(index, password) {
    let text;
    if (index == -1) {
        loginMailError(text);
    } else if (userInformation[index].password === password.value) {
        switchOtherHtml('summary.html?');
        checkIncognitoModeToLogin(index);
    } else {
        loginPasswordError(text);
    }
}


function loginMailError(text) {
    text = 'Your email is not registered yet, please sign up';
    userResonse(text, 'login-user-response', 'login-user-response-text');
    switchOverview('login', 'signup', 'd-none');
    document.getElementById('login-password').value = '';
}


function loginPasswordError(text){
    text = 'Your password is not correct, please try again';
    userResonse(text, 'login-user-response', 'login-user-response-text');
}


function userResonse(text, id, idText) {
    document.getElementById(idText).innerHTML = text;
    showUserResponseOverlay(id);
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

function switchToLastHtml() {
    window.location.href = lastActiveHTML;
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
}


async function checkNewPassword(password, confirmedPassword) {
    let text;
    if (password.value === confirmedPassword.value) {
        await saveNewPassword(password);
        showUserResponseOverlay('reset-password-overlay');
        switchOtherHtml('index.html');
    } else {
        loginChangePasswordError(text);
    }
}


function loginChangePasswordError(text){
    text = 'The entered passwords do not match. Please repeat your entry';
    userResonse(text, 'login-user-response');
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

