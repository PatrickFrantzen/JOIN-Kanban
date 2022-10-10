let displayId;
/**
 * Function to open the Dialog window of a Task to see Details 
 * 
 * @param {number} id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 */
function openDialog(id, title, description, category, date, prio) {
    let singledisplayTask = allTasks[id];
    let displaysubtasks = singledisplayTask.subtasks;
    let displaycompletedsubtasks = singledisplayTask.finishedsubtasks;
    let displaymembers = getMembers(singledisplayTask);
    displayId = id;
    createDisplayOverlay(id, title, description, category, date, prio, displaymembers, singledisplayTask, displaysubtasks, displaycompletedsubtasks);
}

/**
 * Function to create all Details of the Task
 * 
 * @param {number} id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 * @param {Array} displaymembers 
 * @param {Array} singledisplayTask 
 * @param {Array} displaysubtasks 
 * @param {Array} displaycompletedsubtasks 
 */
function createDisplayOverlay(id, title, description, category, date, prio, displaymembers, singledisplayTask, displaysubtasks, displaycompletedsubtasks) {
    createDisplay(id, title, description, category, date, prio)
    createAssignedMemberAreaDisplay(displaymembers, singledisplayTask, id);
    createSubtasks(id, title, description, category, date, prio, displaysubtasks);
    createDisplayPriority(prio, id);
    checkForCheckbox(id, displaysubtasks, displaycompletedsubtasks);
    showDisplay(id);
}

/**
 * Function to render the Display and the content of the Task
 * 
 * @param {number} id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 */
function createDisplay(id, title, description, category, date, prio) {
    document.getElementById('task-display').innerHTML = renderDisplay(id);
    document.getElementById(`display-${id}`).innerHTML = renderDisplayContent(id, title, description, category, date, prio);
    document.getElementById(`assigned-display-area-${id}`).innerHTML = renderMembersOfTaskAreaDisplay(id);
}

/**
 * Function to check if only one Member is assigned or more
 * 
 * @param {array} members 
 * @param {array} singleTask 
 * @param {number} id 
 */
function createAssignedMemberAreaDisplay(members, singleTask, id) {
    if (singleTask.member.length == 1) {
        getfirstMemberDisplay(members, singleTask, id);
    } else {
        getfirstMemberDisplay(members, singleTask, id);
        getOtherMembersDisplay(members, singleTask, id);
    }
}

/**
 * Function to render all Subtasks on Display
 * 
 * @param {number} id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 * @param {array} displaysubtasks 
 */
function createSubtasks(id, title, description, category, date, prio, displaysubtasks) {
    for (let i = 0; i < displaysubtasks.length; i++) {
        let displaysubtask = displaysubtasks[i];
        document.getElementById(`subtasks-display-${id}`).innerHTML += renderSubTasks(id, i, title, description, category, date, prio, displaysubtask);
    }
}

/**
 * Function to display the priority button
 * 
 * @param {string} prio 
 * @param {number} id 
 */
function createDisplayPriority(prio, id) {
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

/**
 * Function to check if a subtask is in completedsubtasks, if yes the checkbox is checked
 * 
 * @param {number} id 
 * @param {array} subtasks 
 * @param {array} completedsubtasks 
 */
function checkForCheckbox(id, subtasks, completedsubtasks) {
    for (let i = 0; i < subtasks.length; i++) {
        if (completedsubtasks.includes(subtasks[i])) 
            document.getElementById(`checkbox-${id}-${i}`).checked = true;
    }
}

/**
 * Function to open the Display of a Task
 * 
 * @param {number} id 
 */
function showDisplay(id) {
    removeClassList('task-display', 'd-none');
    document.getElementById(`display-${id}`).classList.remove('d-none');
    document.getElementById('main-board').classList.add('overflow');
}

/**
 * Function to check if checkbox of a subtask is checked. If yes, the subtask is saved in finishedsubtask-array
 * if unchecked, the subtask is removed from the finishedsubtask-array
 * 
 * @param {number} id 
 * @param {number} i 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 * @param {array} displaysubtask 
 */
function checkboxToggle(id, i, title, description, category, date, prio, displaysubtask) {
    if (document.getElementById(`checkbox-${id}-${i}`).checked == true) {
        saveFinishedSubtask(id, title, description, category, date, prio, displaysubtask);
    } else {
        resetFinishedSubtask(id, title, description, category, date, prio, displaysubtask);
    }
}

/**
 * Function to push a subtask to the finishedsubtask-array and render all Cards, then open the Dialog again
 * 
 * @param {number} id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 * @param {array} displaysubtask
 */
async function saveFinishedSubtask(id, title, description, category, date, prio, displaysubtask) {
    allTasks[id].finishedsubtasks.push(displaysubtask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id, title, description, category, date, prio);
}

/**
 * Function to remove a subtask to the finishedsubtask-array and render all Cards, then open the Dialog again
 * 
 * @param {number} id 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 * @param {array} displaysubtask 
 */
async function resetFinishedSubtask(id, title, description, category, date, prio, displaysubtask) {
    let x = allTasks[id].finishedsubtasks.indexOf(displaysubtask);
    allTasks[id].finishedsubtasks.splice(x, 1);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
    openDialog(id, title, description, category, date, prio);
}

/**
 * Function to render the information for assigned first member
 * 
 * @param {array} members 
 * @param {array} singleTask 
 * @param {number} id 
 */
function getfirstMemberDisplay(members, singleTask, id) {
    let firstMember = members[0];
    let firstMemberFullName = singleTask.member[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-display-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-name-display-${id}`).innerHTML = firstMemberFullName;
    document.getElementById(`first-member-display-${id}`).classList.add(`bg-contact-${color}`);
}

/**
 * Function to render the information for assigned members
 * 
 * @param {array} members 
 * @param {array} singleTask 
 * @param {number} id 
 */
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

/**
 * Function to set the color, text and img for prio Urgent
 * 
 * @param {string} prio
 * @param {number} id
 */
function priorityForDisplayUrgent(prio, id) {
    document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
    document.getElementById(`prio-display-name-${id}`).innerHTML = 'Urgent';
    document.getElementById(`prio-img-${id}`).src = "img/add_task/arrow_urgent_white.svg";
}

/**
 * Function to set the color, text and img for prio Medium
 * 
 * @param {string} prio
 * @param {number} id
 */
function priorityForDisplayMedium(prio, id) {
    document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
    document.getElementById(`prio-display-name-${id}`).innerHTML = 'Medium';
    document.getElementById(`prio-img-${id}`).src = "img/add_task/medium_white.svg";
}

/**
 * Function to set the color, text and img for prio Low
 * 
 * @param {string} prio
 * @param {number} id 
 */
function priorityForDisplayLow(prio, id) {
    document.getElementById(`prio-display-field-${id}`).classList.add(`bg-${prio}`, 'color-white')
    document.getElementById(`prio-display-name-${id}`).innerHTML = 'Low';
    document.getElementById(`prio-img-${id}`).src = "img/add_task/arrow_low_white.svg";
}

/**
 * Function to delete a specified Task from allTask Array
 * 
 * @param {number} id 
 */
async function deleteMessage(id) {
    closeDialog(id);
    let index = allTasks.indexOf(allTasks[id]);
    allTasks.splice(index, 1);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    renderCards();
}

/**
 * Function to close the Display of a task
 * 
 * @param {number} id 
 */
function closeDialog(id) {
    document.getElementById('task-display').classList.add('d-none');
    document.getElementById(`display-${id}`).classList.add('d-none');
    document.getElementById(`display-content-${id}`).classList.add('d-none');
    document.getElementById('main-board').classList.remove('overflow');
}