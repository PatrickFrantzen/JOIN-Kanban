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
    let title = singleTask.tasktitle;
    let description = singleTask.taskdescription;
    let category = singleTask.taskcategory;
    let date = singleTask.duedate;
    let prio = singleTask.taskprio;
    let members = getMembers(singleTask);
    let status = singleTask.projectstatus;
    let subtasks = singleTask.tasksubtasks;
    let completedsubtasks = singleTask.finishedsubtasks;
    createTask(i, title, description, category, date, prio, status, subtasks, completedsubtasks, singleTask);
    createAssignedMemberArea(members, singleTask, i);
    createPriority(prio, i);
    
}


function createTask(id, title, description, category, date, prio, status, subtasks, completedsubtasks) {
    document.getElementById(`${status}-card`).innerHTML += renderSingleCard(id, title, description, category, date, prio, subtasks, completedsubtasks);
    document.getElementById(`assigned-area-${id}`).innerHTML = renderMembersOfTaskArea(id);
    createSubtaskArea(id, subtasks, completedsubtasks);
}

function openDialog(id, title, description, category, date, prio) {
    let singledisplayTask = allTasks[id]
    let displaysubtasks = allTasks[id].tasksubtasks;
    let displaycompletedsubtasks = allTasks[id].finishedsubtasks;
    let displaymembers = getMembers(allTasks[id]);
    document.getElementById('task-display').classList.remove('d-none');
    document.getElementById('task-display').innerHTML = renderDisplay(id);
    document.getElementById(`display-${id}`).classList.remove('d-none');
    document.getElementById(`display-${id}`).innerHTML = renderDisplayContent(id, title, description, category, date, prio);
    document.getElementById(`assigned-display-area-${id}`).innerHTML = renderMembersOfTaskAreaDisplay(id);
    createAssignedMemberAreaDisplay(displaymembers, singledisplayTask, id);
    getSubtasks(id, title, description, category, date, prio, displaysubtasks);
    createDisplayPriority(prio, id);
    checkForCheckbox(id, displaysubtasks, displaycompletedsubtasks);
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


function createAssignedMemberArea(members, singleTask, id) {
    if (singleTask.taskmember.length == 1) {
        getfirstMember(members, singleTask, id);
    } else {
        getfirstMember(members, singleTask, id);
        getOtherMembers(members, singleTask, id);
    }
}

function createAssignedMemberAreaDisplay(members, singleTask, id) {
    if (singleTask.taskmember.length == 1) {
        getfirstMemberDisplay(members, singleTask, id);
    } else {
        getfirstMemberDisplay(members, singleTask, id);
        getOtherMembersDisplay(members, singleTask, id);
    }
}



function renderBarProgress(id, numberOfSubtasks, numberOfFinishedSubtasks) {
    document.getElementById(`bar-${id}`).style.width = ((numberOfFinishedSubtasks/numberOfSubtasks)*100) + "%";
}


function getSubtasks(id, title, description, category, date, prio, displaysubtasks) {
    for (let i = 0; i < displaysubtasks.length; i++) {
        let displaysubtask = displaysubtasks[i];
        document.getElementById(`subtasks-display-${id}`).innerHTML += renderSubTasks(id, i, title, description, category, date, prio, displaysubtask);
    }
}


function checkboxToggle(id, i, title, description, category, date, prio, displaysubtask) {
    if (document.getElementById(`checkbox-${id}-${i}`).checked == true) {
        saveFinishedSubtask(id, i, title, description, category, date, prio, displaysubtask);
    } else {
        resetFinishedSubtask(id, i, title, description, category, date, prio, displaysubtask);
    }
}


async function saveFinishedSubtask(id, i, title, description, category, date, prio, displaysubtask) {
    allTasks[id].finishedsubtasks.push(displaysubtask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id, i, title, description, category, date, prio, displaysubtask);
}

async function resetFinishedSubtask(id, i, title, description, category, date, prio, displaysubtask) {
    let x = allTasks[id].finishedsubtasks.indexOf(displaysubtask);
    allTasks[id].finishedsubtasks.splice(x, 1);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id, i, title, description, category, date, prio, displaysubtask);
}
    

function getfirstMember(members, singleTask, id) {
    let firstMember = members[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-${id}`).classList.add(`bg-contact-${color}`);
}

function getfirstMemberDisplay(members, singleTask, id) {
    let firstMember = members[0];
    let firstMemberFullName = singleTask.taskmember[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-display-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-name-display-${id}`).innerHTML = firstMemberFullName;
    document.getElementById(`first-member-display-${id}`).classList.add(`bg-contact-${color}`);
}


function getOtherMembers(members, singleTask, id) {
    for (let i = 1; i < singleTask.taskmember.length; i++) {
        let memberOfTask = singleTask.taskmember[i];
        let memberOfInitialArray = members[i];
        let color = checkForColor(memberOfTask);
        document.getElementById(`assigned-area-${id}`).innerHTML += renderAdditionalMembers(memberOfInitialArray, id);
        document.getElementById(`other-member-${id}`).classList.add(`bg-contact-${color}`);
    }
}

function getOtherMembersDisplay(members, singleTask, id) {
    for (let i = 1; i < singleTask.taskmember.length; i++) {
        let memberOfTask = singleTask.taskmember[i];
        let memberOfInitialArray = members[i];
        let color = checkForColor(memberOfTask);
        document.getElementById(`assigned-list-${id}`).innerHTML += renderAdditionalMembersDisplay(memberOfInitialArray, id);
        document.getElementById(`other-member-name-display-${id}`).innerHTML = memberOfTask;
        document.getElementById(`other-member-display-${id}`).classList.add(`bg-contact-${color}`);
    }
}


function checkForFirstMemberColor(singleTask) {

    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let name = user.fullname;
        let color = user.color;
        let firstmember = singleTask.taskmember[0];
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


function getMembers(singleTask) {
    let taskmembers = [];
    for (let i = 0; i < singleTask.taskmember.length; i++) {
        let member = singleTask.taskmember[i];
        let firstLetters = getFirstLetters(member);
        taskmembers.push(firstLetters);
    }
    return taskmembers;
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


function createPriority(prio, id) {
    priorityForBoard(prio, id);
}

function createDisplayPriority(prio, id) {
    priorityForDisplay(prio, id);
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


function priorityForDisplay(prio, id) {
    switch (prio) {
        case 'urgent':
            priorityForDisplayUrgent(prio, id);
            break;

        case 'medium':
            priorityForDisplayMedium(prio, id);
            break;

        case 'low':
            priorityForDisplayLow(prio, id);
            break;
    }
}


function priorityForDisplayUrgent(prio, id) {
    document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
    document.getElementById(`prio-display-name-${id}`).innerHTML = 'Urgent';
    document.getElementById(`prio-img-${id}`).src = "img/add_task/arrow_urgent_white.svg";
}


function priorityForDisplayMedium(prio, id) {
    document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
    document.getElementById(`prio-display-name-${id}`).innerHTML = 'Medium';
    document.getElementById(`prio-img-${id}`).src = "img/add_task/medium_white.svg";
}


function priorityForDisplayLow(prio, id) {
    document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
    document.getElementById(`prio-display-name-${id}`).innerHTML = 'Low';
    document.getElementById(`prio-img-${id}`).src = "img/add_task/arrow_low_white.svg";
}


function allowDrop(ev) {
    ev.preventDefault();
}


async function moveTo(status) {
    allTasks[currentDraggedElement]['projectstatus'] = status;
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


function closeDialog(id) {
    document.getElementById('task-display').classList.add('d-none');
    document.getElementById(`display-${id}`).classList.add('d-none');
    document.getElementById(`display-content-${id}`).classList.add('d-none');
}




function checkForCheckbox(id, subtasks, completedsubtasks) {
    for (let i = 0; i < subtasks.length; i++) {
        if (completedsubtasks.includes(subtasks[i])) 
            document.getElementById(`checkbox-${id}-${i}`).checked = true;
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
    if (task.tasktitle.includes(searchInput) || task.taskprio.includes(searchInput) || checkSearchForMembers(task, searchInput)) {
        if (getIndexFromArray(search, i) == -1)
            search.push(i);
    } else {
        let index = getIndexFromArray(search, i);
        if (index >= 0)
            search.splice(index, 1);
    }
}


function checkSearchForMembers(task, searchInput) {
    for (let i = 0; i < task.taskmember.length; i++) {
        let member = task.taskmember[i];
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

