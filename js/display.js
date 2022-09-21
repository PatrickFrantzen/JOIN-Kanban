function openDialog(id, title, description, category, date, prio) {
    let singledisplayTask = allTasks[id];
    let displaysubtasks = singledisplayTask.subtasks;
    let displaycompletedsubtasks = singledisplayTask.finishedsubtasks;
    let displaymembers = getMembers(singledisplayTask);
    createDisplayOverlay(id, title, description, category, date, prio, displaymembers, singledisplayTask, displaysubtasks, displaycompletedsubtasks);
}

function createDisplayOverlay(id, title, description, category, date, prio, displaymembers, singledisplayTask, displaysubtasks, displaycompletedsubtasks) {
    createDisplay(id, title, description, category, date, prio)
    createAssignedMemberAreaDisplay(displaymembers, singledisplayTask, id);
    createSubtasks(id, title, description, category, date, prio, displaysubtasks);
    createDisplayPriority(prio, id);
    checkForCheckbox(id, displaysubtasks, displaycompletedsubtasks);
    showDisplay(id);
}

function createDisplay(id, title, description, category, date, prio) {
    document.getElementById('task-display').innerHTML = renderDisplay(id);
    document.getElementById(`display-${id}`).innerHTML = renderDisplayContent(id, title, description, category, date, prio);
    document.getElementById(`assigned-display-area-${id}`).innerHTML = renderMembersOfTaskAreaDisplay(id);
}

function createAssignedMemberAreaDisplay(members, singleTask, id) {
    if (singleTask.member.length == 1) {
        getfirstMemberDisplay(members, singleTask, id);
    } else {
        getfirstMemberDisplay(members, singleTask, id);
        getOtherMembersDisplay(members, singleTask, id);
    }
}

function createSubtasks(id, title, description, category, date, prio, displaysubtasks) {
    for (let i = 0; i < displaysubtasks.length; i++) {
        let displaysubtask = displaysubtasks[i];
        document.getElementById(`subtasks-display-${id}`).innerHTML += renderSubTasks(id, i, title, description, category, date, prio, displaysubtask);
    }
}

function createDisplayPriority(prio, id) {
    priorityForDisplay(prio, id);
}

function checkForCheckbox(id, subtasks, completedsubtasks) {
    for (let i = 0; i < subtasks.length; i++) {
        if (completedsubtasks.includes(subtasks[i])) 
            document.getElementById(`checkbox-${id}-${i}`).checked = true;
    }
}

function showDisplay(id) {
    removeClassList('task-display', 'd-none');
    document.getElementById(`display-${id}`).classList.remove('d-none');
    document.getElementById('main-board').classList.add('overflow');
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
    openDialog(id, title, description, category, date, prio);
}

async function resetFinishedSubtask(id, i, title, description, category, date, prio, displaysubtask) {
    let x = allTasks[id].finishedsubtasks.indexOf(displaysubtask);
    allTasks[id].finishedsubtasks.splice(x, 1);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id, title, description, category, date, prio);
}

function getfirstMemberDisplay(members, singleTask, id) {
    let firstMember = members[0];
    let firstMemberFullName = singleTask.member[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-display-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-name-display-${id}`).innerHTML = firstMemberFullName;
    document.getElementById(`first-member-display-${id}`).classList.add(`bg-contact-${color}`);
}

function getOtherMembersDisplay(members, singleTask, id) {
    for (let i = 1; i < singleTask.member.length; i++) {
        let memberOfTask = singleTask.member[i];
        let memberOfInitialArray = members[i];
        let color = checkForColor(memberOfTask);
        document.getElementById(`assigned-list-${id}`).innerHTML += renderAdditionalMembersDisplay(memberOfInitialArray, id);
        document.getElementById(`other-member-name-display-${id}`).innerHTML = memberOfTask;
        document.getElementById(`other-member-display-${id}`).classList.add(`bg-contact-${color}`);
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

function closeDialog(id) {
    document.getElementById('task-display').classList.add('d-none');
    document.getElementById(`display-${id}`).classList.add('d-none');
    document.getElementById(`display-content-${id}`).classList.add('d-none');
}