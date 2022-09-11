let currentDraggedElement;
let search = [];

async function initTasks() {
    await loadDataFromServer();
    await init();
    renderProfileImage();
    renderCards();
}

function renderCards() {
    clearCards();
    for (let i = 0; i < allTasks.length; i++) {
        let singleTask = allTasks[i];
        getTaskDetails(i, singleTask);
    }
}

function clearCards() {
    document.getElementById('toDo-card').innerHTML = '';
    document.getElementById('progress-card').innerHTML = '';
    document.getElementById('progress-card').innerHTML = renderEmtptyContainer();
    document.getElementById('feedback-card').innerHTML = '';
    document.getElementById('feedback-card').innerHTML = renderEmtptyContainer();
    document.getElementById('done-card').innerHTML = '';
    document.getElementById('done-card').innerHTML = renderEmtptyContainer();
}

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
    createTask(i, title, description, category, date, prio, status);
    createDisplay(i, title, description, category, date, prio, members, singleTask);
    createSubtaskArea(i, subtasks, completedsubtasks);
    createAssignedMemberArea(members, singleTask, i);
    createPriority(prio, i);
    checkForCheckbox(i, subtasks, completedsubtasks);
}

function createTask(id, title, description, category, date, prio, status) {
    document.getElementById(`${status}-card`).innerHTML += renderSingleCard(id, title, description, category, date, prio);
    document.getElementById(`assigned-area-${id}`).innerHTML = renderMembersOfTaskArea(id);
}

function createDisplay(id, title, description, category, date, prio) {
    document.getElementById('task-display').innerHTML += renderDisplay(id);
    document.getElementById(`display-${id}`).innerHTML = renderDisplayContent(id, title, description, category, date, prio);
    document.getElementById(`assigned-display-area-${id}`).innerHTML = renderMembersOfTaskAreaDisplay(id);

}

function createSubtaskArea(id, subtasks, completedsubtasks) {
    if (subtasks == '') {
        document.getElementById(`progressbar-${id}`).innerHTML = `<div></div>`;
    } else {
        let numberOfSubtasks = subtasks.length;
        let numberOfFinishedSubtasks = completedsubtasks.length;
        document.getElementById(`progressbar-${id}`).innerHTML = renderProgressbarArea(numberOfSubtasks, numberOfFinishedSubtasks);
    }
    getSubtasks(subtasks, id);
}

function createAssignedMemberArea(members, singleTask, id) {
    if (singleTask.taskmember.length == 1) {
        getfirstMember(members, singleTask, id);
    } else {
        getfirstMember(members, singleTask, id);
        getOtherMembers(members, singleTask, id);
    }

}

function getSubtasks(subtasks, id) {
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        document.getElementById(`subtasks-display-${id}`).innerHTML += renderSubTasks(subtask, i, id);
    }

}

function checkboxToggle(id, i, subtask) {
    if (document.getElementById(`checkbox-${id}-${i}`).checked == true) {
        saveFinishedSubtask(id, subtask);
    } else {
        resetFinishedSubtask(id, i, subtask);
    }
}

async function saveFinishedSubtask(id, subtask) {
    allTasks[id].finishedsubtasks.push(subtask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id);
}

async function resetFinishedSubtask(id, i, subtask) {
    let x = allTasks[id].finishedsubtasks.indexOf(subtask);
    allTasks[id].finishedsubtasks.splice(x, 1);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id); //splice an der Stelle i klappt nicht, da AUfgabe zwei mit i = 2 an erster Stelle stehen kann und dann nicht gespliced wird. Mit IndexOf die tatsächliche Stell herausfinden.
}
    


function getfirstMember(members, singleTask, id) {
    let firstMember = members[0];
    let firstMemberFullName = singleTask.taskmember[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-display-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-name-display-${id}`).innerHTML = firstMemberFullName;
    document.getElementById(`first-member-${id}`).classList.add(`bg-contact-${color}`);
    document.getElementById(`first-member-display-${id}`).classList.add(`bg-contact-${color}`)
}

function getOtherMembers(members, singleTask, id) {
    for (let i = 1; i < singleTask.taskmember.length; i++) {
        let memberOfTask = singleTask.taskmember[i];
        let memberOfInitialArray = members[i];
        let color = checkForColor(memberOfTask);
        document.getElementById(`assigned-area-${id}`).innerHTML += renderAdditionalMembers(memberOfInitialArray, id);
        document.getElementById(`assigned-list-${id}`).innerHTML += renderAdditionalMembersDisplay(memberOfInitialArray, id);
        document.getElementById(`other-member-name-display-${id}`).innerHTML = memberOfTask;
        document.getElementById(`other-member-${id}`).classList.add(`bg-contact-${color}`);
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
            document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
            document.getElementById(`prio-display-name-${id}`).innerHTML = 'Urgent';
            document.getElementById(`prio-img-${id}`).src = "img/add_task/arrow_urgent_white.svg";
            break;

        case 'medium':
            document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
            document.getElementById(`prio-display-name-${id}`).innerHTML = 'Medium';
            document.getElementById(`prio-img-${id}`).src = "img/add_task/medium_white.svg";
            break;

        case 'low':
            document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
            document.getElementById(`prio-display-name-${id}`).innerHTML = 'Low';
            document.getElementById(`prio-img-${id}`).src = "img/add_task/arrow_low_white.svg";
            break;
    }
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

function closeDialog(id) {
    document.getElementById('task-display').classList.add('d-none');
    document.getElementById(`display-${id}`).classList.add('d-none');
    document.getElementById(`display-content-${id}`).classList.add('d-none');
}

function openDialog(id) {
    document.getElementById('task-display').classList.remove('d-none');
    document.getElementById(`display-${id}`).classList.remove('d-none');
    document.getElementById(`display-content-${id}`).classList.remove('d-none');
}

function checkForCheckbox(id, subtasks, completedsubtasks) {

    for (let i = 0; i < subtasks.length; i++) {
        if (completedsubtasks.includes(subtasks[i])) {
            document.getElementById(`checkbox-${id}-${i}`).checked = true;
        }
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
        if (getIndexFromArray(i) == -1)
            search.push(i);
    } else {
        let index = getIndexFromArray(i);
        if (index >= 0)
            search.splice(index, 1);
    }
}


function checkSearchForMembers(task, searchInput) {
    for (let i = 0; i < task.taskmember.length; i++) {
        let member = task.taskmember[i];
        if (member.includes(searchInput)) {
            return true;
        }
    }
}


function getIndexFromArray(i) {
    let index = search.indexOf(i);
    return index;
}


function renderSearchedTasks() {
    clearCards();
    for (let i = 0; i < search.length; i++) {
        let singleTask = allTasks[search[i]];
        getTaskDetails(search[i], singleTask);
    }
}



