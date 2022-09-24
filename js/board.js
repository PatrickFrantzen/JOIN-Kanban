let currentDraggedElement;
let search = [];
let projectstatus = ['toDo', 'progress', 'feedback', 'done'];


/**
 * Initialization of HTML-Page Board
 * 
 */
async function initTasks() {
    await loadDataFromServer();
    await init();
    await includeHTML('include-addtask-html');
    renderProfileImage();
    renderCards();
    renderCategoriesInHTML();
    renderAssignableMembersInHTML();
}


/**
 * Function to render the Task Area
 * First, Area is cleared. Second all Tasks are loaded from allTask-Array
 * Third, DragContainer for Drag and Drop is created.
 * 
 */
function renderCards() {
    clearCards();
    createCards();
    createDragContainer();
}


/**
 * Function to clear the Task Area
 */
 function clearCards() {
    for (let i = 0; i < projectstatus.length; i++) {
        let status = projectstatus[i];
        document.getElementById(`${status}-card`).innerHTML = '';
    }
}


/**
 * Function to get iterate through allTasks-Array
 */
function createCards() {
    for (let i = 0; i < allTasks.length; i++) {
        let singleTask = allTasks[i];
        getTaskDetails(i, singleTask);
    }
}


/**
 * Function to create a Drag Container in every Status Area
 */
function createDragContainer() {
    for (let i = 0; i < projectstatus.length; i++) {
        let status = projectstatus[i];
        document.getElementById(`${status}-card`).innerHTML += renderDragContainer(status);
    }
}


/**
 * Function to get all Task information from JSON Array 
 * Generating differnt parts of a task.
 * 
 * @param {number} i 
 * @param {string} singleTask 
 */
function getTaskDetails(i, singleTask) {
    let title = singleTask.title;
    let description = singleTask.description;
    let category = singleTask.category;
    let date = singleTask.duedate;
    let prio = singleTask.prio;
    let members = getMembers(singleTask);
    let status = singleTask.status;
    let subtasks = singleTask.subtasks;
    let completedsubtasks = singleTask.finishedsubtasks;
    createOverlay(i, title, description, category, date, prio, members, status, subtasks, completedsubtasks, singleTask);
}

function createOverlay(i, title, description, category, date, prio, members, status, subtasks, completedsubtasks, singleTask) {
    createTask(i, title, description, category, date, prio, status, subtasks, completedsubtasks);
    createAssignedMemberArea(members, singleTask, i);
    createPriority(prio, i);
}

function createTask(id, title, description, category, date, prio, status, subtasks, completedsubtasks) {
    document.getElementById(`${status}-card`).innerHTML += renderSingleCard(id, title, description, category, date, prio, subtasks, completedsubtasks);
    document.getElementById(`assigned-area-${id}`).innerHTML = renderMembersOfTaskArea(id);
    createSubtaskArea(id, subtasks, completedsubtasks);
}

function createSubtaskArea(id, subtasks, completedsubtasks) {
    if (subtasks == '') {
        document.getElementById(`progressbar-${id}`).innerHTML = `<div></div>`;
    } else {
        let numberOfSubtasks = subtasks.length;
        let numberOfFinishedSubtasks = completedsubtasks.length;
        document.getElementById(`progressbar-${id}`).innerHTML = renderProgressbarArea(id, numberOfSubtasks, numberOfFinishedSubtasks);
        renderBarProgress(id, numberOfSubtasks, numberOfFinishedSubtasks);
    }
}

function renderBarProgress(id, numberOfSubtasks, numberOfFinishedSubtasks) {
    document.getElementById(`bar-${id}`).style.width = ((numberOfFinishedSubtasks/numberOfSubtasks)*100) + "%";
}

function createAssignedMemberArea(members, singleTask, id) {
    if (singleTask.member.length == 1) {
        getfirstMember(members, singleTask, id);
    } else {
        getfirstMember(members, singleTask, id);
        getOtherMembers(members, singleTask, id);
    }
}

function createPriority(prio, id) {
    priorityForBoard(prio, id);
}


function getMembers(singleTask) {
    let taskmembers = [];
    for (let i = 0; i < singleTask.member.length; i++) {
        let member = singleTask.member[i];
        let firstLetters = getFirstLetters(member);
        taskmembers.push(firstLetters);
    }
    return taskmembers;
}

function getfirstMember(members, singleTask, id) {
    let firstMember = members[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-${id}`).classList.add(`bg-contact-${color}`);
}


function getOtherMembers(members, singleTask, id) {
    for (let i = 1; i < singleTask.member.length; i++) {
        let memberOfTask = singleTask.member[i];
        let memberOfInitialArray = members[i];
        let color = checkForColor(memberOfTask);
        document.getElementById(`assigned-area-${id}`).innerHTML += renderAdditionalMembers(memberOfInitialArray, id);
        document.getElementById(`other-member-${id}`).classList.add(`bg-contact-${color}`);
    }
}


function checkForFirstMemberColor(singleTask) {
for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let name = user.fullname;
        let color = user.color;
        let firstmember = singleTask.member[0];
        if (name == firstmember) {
            let userColor = color;
            return userColor;
        }
    }
}


function checkForColor(memberOfTask) {
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let name = user.fullname;
        let color = user.color;
        if (name == memberOfTask) {
            let userColor = color;
            return userColor;
        }
    }
}


function getFirstLetters(member) {
    let fullname = member.split(' ');
    for (let i = 0; i < fullname.length; i++) {
        let firstLetter = fullname[0].charAt(0);
        let lastLetter = fullname[1].charAt(0);
        let initials = firstLetter + lastLetter;
        return initials;
    }
}

function priorityForBoard(prio, id) {
    switch (prio) {
        case 'urgent':
            document.getElementById(`prio-${id}`).src = "img/add_task/arrow_urgent.svg";
            break;
        case 'medium':
            document.getElementById(`prio-${id}`).src = "img/add_task/medium.svg";
            break;
        case 'low':
            document.getElementById(`prio-${id}`).src = "img/add_task/arrow_low.svg";
            break;
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(status) {
    allTasks[currentDraggedElement]['status'] = status;
    renderCards();
    await backend.setItem('allTasks', JSON.stringify(allTasks));
}


function startDragging(id) {
    currentDraggedElement = id;
}


function showDragCard() {
    for (let i = 0; i < projectstatus.length; i++) {
        let status = projectstatus[i];
        document.getElementById(`${status}-dragcard`).classList.remove('d-none');
    }
}


function searchTasks() {
    let searchInput = document.getElementById('search').value;
    for (let i = 0; i < allTasks.length; i++) {
        let task = allTasks[i];
        searchForCriteria(task, searchInput, i);
    }
    renderSearchedTasks();
}

function searchForCriteria(task, searchInput, i) {
    if (task.title.includes(searchInput) || task.prio.includes(searchInput) || checkSearchForMembers(task, searchInput)) {
        if (getIndexFromArray(search, i) == -1)
            search.push(i);
    } else {
        let index = getIndexFromArray(search, i);
        if (index >= 0)
            search.splice(index, 1);
    }
}

function checkSearchForMembers(task, searchInput) {
    for (let i = 0; i < task.member.length; i++) {
        let member = task.member[i];
        if (member.includes(searchInput))
            return true;
    }
}

function getIndexFromArray(array, value) {
    let index = array.indexOf(value);
    return index;
}


function renderSearchedTasks() {
    clearCards();
    for (let i = 0; i < search.length; i++) {
        let singleTask = allTasks[search[i]];
        getTaskDetails(search[i], singleTask);
    }
}


function openAddTaskForm(status){
    boardStatus = status;
    removeClassList('add-task-overlay-board', 'd-none');
}

function editTask(id, status) {
    boardStatus = status;
    let edittask = allTasks[id];
    let title = edittask.title;
    let description = edittask.description;
    let category = edittask.category;
    let date = edittask.duedate;
    let prio = edittask.prio;
    let members = getMembers(edittask);
    let editstatus = edittask.status;
    let subtasks = edittask.subtasks;
    let completedsubtasks = edittask.finishedsubtasks;
    removeClassList('add-task-overlay-board', 'd-none');
    renderEditLayout(title, description, category, date, prio, members, editstatus, subtasks, completedsubtasks);
}

function renderEditLayout(title, description, category, date, prio, members, status, subtasks, completedsubtasks) {
    document.getElementById('title').value = title;
    document.getElementById('describtion').value = description;
    setValue(category);

}

function setValue(category) {
    clearCategoryInput();
    let content = document.getElementById(category).innerHTML;
    document.getElementById('category-output').innerHTML = content;
}