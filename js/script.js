let menulinks = ['summary', 'board', 'add_task', 'contacts', 'imprint'];
let activeUser;
let activeUserIndex;
let userIndexForgotPassword;
let contacts = [];



async function init() {
    await includeHTML('w3-include-html');
    checkActiveHTML();
    checkActiveUser();
}

async function loadDataFromServer() {
    setURL('https://gruppe-306.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    putLoadedDataToArray()
}

async function putLoadedDataToArray() {
    userInformation = await JSON.parse(jsonFromServer.userInformation) || [];
    contactColors = await JSON.parse(JSON.stringify(jsonFromServer.contactColors)) || [];
    userIndexForgotPassword = await jsonFromServer.userIndexForgotPassword;
    allTasks = await JSON.parse(jsonFromServer.allTasks) || [];
    allCategories = await JSON.parse(jsonFromServer.allCategories) || [];
    contacts = JSON.parse(jsonFromServer.contacts) || [];
}


/**
 * @param {string} id 
 * @param {string} classList 
 */
function toggleClassList(id, classList) {
    document.getElementById(id).classList.toggle(classList);
}


/**
 * @param {string} id 
 * @param {string} classList 
 */
function addClassList(id, classList) {
    document.getElementById(id).classList.add(classList);
}

function addValue(id, text) {
    document.getElementById(id).value = text;
}

function changeInnerHTML(id, string) {
    document.getElementById(id).innerHTML = string;
}

/**
 * @param {string} id 
 * @param {string} classList 
 */
function removeClassList(id, classList) {
    document.getElementById(id).classList.remove(classList);
}


/**
 * checks current html side to call function for changing bg on 
 * menu link in navbar
 */
function checkActiveHTML() {
    let path = window.location.pathname;
    for (let i = 0; i < menulinks.length; i++) {
        let name = menulinks[i];
        if (path == `/${name}.html`) {
            changeClassListMenuLinks(name);
        }
    }
}


/**
 * fonts and img of active menu link changes color to white
 * @param {string} id 
 */
function changeClassListMenuLinks(id) {
    for (let i = 0; i < menulinks.length; i++) {
        let menulink = menulinks[i];
        removeClassList(menulink, 'menulink-active');
        removeClassList(`${menulink}-icon`, 'filter-white');
        removeClassList(`${menulink}-text`, 'color-white');
    }
    addClassList(id, 'menulink-active');
    addClassList(`${id}-icon`, 'filter-white');
    addClassList(`${id}-text`, 'color-white');
}


/**
 * gets active user from localstorage
 * and sets it in global variable activeUser
 */
function checkActiveUser() {
    checkIncognitoMode();
    if(activeUser == 'Guest Account'){
        activeUserIndex = 2;
    } else {
        checkActiveUserIndex();
    }
}

function checkIncognitoMode() {
    try {
        activeUser = getActiveUserFromLocalStorage('activeUser');
        if(!activeUser){
            activeUser = 'Guest Account' 
        }
    }
    catch(e){
       console.log(e); 
    }
}


/**
 * gets index of active user of json array userInformation
 * and sets it in global variable activeUserIndex
 */
function checkActiveUserIndex() {
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let name = user.fullname;
        if (name == activeUser) {
            activeUserIndex = i;
        }
    }
}


/**
 * renders profile img in the header, depending on active user
 */
function renderProfileImage() {
    document.getElementById('profile-pic').src = userInformation[activeUserIndex].img;
}

/**
 * Function when clicking outside the menu, the menu is closed
 * 
 * @param {string} box 
 * @param {string} id 
 */
function dropdown(box, id) {
    toggleClassList(id, 'd-none');
    document.addEventListener('click', function handleClickOutsideBox(event) {
    let area = document.getElementById(`${box}`);
        if (!area.contains(event.target)) 
            addClassList(`${id}`, 'd-none')
})
};
