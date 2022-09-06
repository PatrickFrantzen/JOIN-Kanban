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

function toggleClassList(id, classList) {
    document.getElementById(id).classList.toggle(classList);
}

function addClassList(id, classList) {
    document.getElementById(id).classList.add(classList);
}

function removeClassList(id, classList) {
    document.getElementById(id).classList.remove(classList);
}

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

function checkActiveHTML() {
    let path = window.location.pathname;
    for (let i = 0; i < menulinks.length; i++) {
        let name = menulinks[i];
        if (path == `/JOIN-Kanban/${name}.html`) {
            changeClassListMenuLinks(name);
        }
    }
}

function checkActiveUser() {
    activeUser = getActiveUserFromLocalStorage('activeUser');
    checkActiveUserIndex();
}

function checkActiveUserIndex() {
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let fullname = user.firstname + ' ' + user.lastname;
        if (fullname == activeUser) {
            activeUserIndex = i;
        }
    }
}

function renderProfileImage() {
    document.getElementById('profile-pic').src = userInformation[activeUserIndex].img;
}




