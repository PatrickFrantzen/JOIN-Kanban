let menulinks = [
    'summary', 'board', 'add_task', 'contacts', 'imprint', 'privacy'];

let activeUser;
let activeUserIndex;

async function init() {
    await includeHTML();
    checkActiveHTML();
    checkActiveUser();
    renderProfileImage();
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
        if (path == `/JOIN-Kanban/${name}.html`) {
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
    activeUser = getActiveUserFromLocalStorage('activeUser');
    checkActiveUserIndex();
}


/**
 * gets index of active user of json array userInformation
 * and sets it in global variable activeUserIndex
 */
function checkActiveUserIndex() {
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let fullname = user.firstname + ' ' + user.lastname;
        if (fullname == activeUser) {
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




