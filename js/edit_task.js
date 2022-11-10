let currentId = 'empty';
let TaskIsEdited = false;

/**
 * Function to get all Informations from a specific task to edit
 * 
 * @param {number} id 
 */
function editTask(id) {
    let edittask = allTasks[id];
    let title = edittask.title;
    let description = edittask.description;
    let category = edittask.category.toLowerCase();
    let date = edittask.duedateOrgin;
    let prio = edittask.prio;
    currentMembers = edittask.member
    let subtasks = edittask.subtasks;
    currentId = id;
    TaskIsEdited = true;
    showEditTaskDisplay(id);
    renderEditLayout(title, description, category, date, prio, subtasks);
}

/**
 * Function to remove and add some classes of specific IDs
 * 
 * @param {number} id 
 */
function showEditTaskDisplay(id) {
    setAnimationClassLists('add-task-overlay-board', 'add-task-overlay');
    removeClassList('add-task-overlay-board', 'd-none');
    removeClassList('editTask', 'd-none');
    addClassList('createTask', 'd-none');
    addClassList('task-display', 'd-none');
    //addClassList(`display-${id}`, 'd-none');
    //addClassList(`display-content-${id}`, 'd-none');
    addClassList('sections', 'sections-mobile');
    addClassList('add-task-btns', 'button-mobile');
}

/**
 * Functio to change the Add Task Layout to Edit Task Layout, fill in all information
 * 
 * @param {string} title 
 * @param {string} description 
 * @param {string} category 
 * @param {date} date 
 * @param {string} prio 
 * @param {Array} subtasks 
 */

function renderEditLayout(title, description, category, date, prio, subtasks) {
    changeInnerHTML('content-header', 'Edit Task');
    addValue('title', title);
    addValue('description', description);
    addValue('date', date);
    setValue(category);
    setAssignedTo();
    setPrioButton(prio);
    setSubtasks(subtasks);
}

/**
 * Function to clear the Category and set it to the given category
 * 
 * @param {string} category 
 */
function setValue(category) {
    clearCategoryInput();
    let content = document.getElementById(category);
    document.getElementById('category-input').value = category;
    document.getElementById('category-output').innerHTML = content.innerHTML;
    currentCategory = category;
}

/**
 * Function to render all assigned Members of the Task to edit and render Avatars
 * 
 */
function setAssignedTo() {
    for (let i = 0; i < currentMembers.length; i++) {
        let member = currentMembers[i];
        let email = getEmailofCurrentMember(member);
        document.getElementById(`checkbox-${email}`).checked = true;
    }
    fillHiddenInputField('assignedTo-input');
    renderAssignedToMemberAvatare();
}

/**
 * Function to set the Priority of the Task to edit
 * 
 * @param {string} prio 
 */
function setPrioButton(prio) {
    changePriority(prio, `btn-${prio}`);
    fillHiddenInputField('priority-input');
}

/**
 * Function to get the Emailadress to get the right ID of function setAssignedTo
 * 
 * @param {string} member 
 * @returns the Email adress of the currentMember
 */
function getEmailofCurrentMember(member){
    for (let i = 0; i < allContacts.length; i++) {
        let user = allContacts[i];
        if (member == user.fullname) return user.mail;
    }
}

/**
 * Function to load all Subtask of the Task to edit
 * 
 * @param {array} subtasks 
 */
function setSubtasks(subtasks) {
    document.getElementById('subtasks-output').innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        let outputbox = document.getElementById('subtasks-output');
        currentSubTasks.push(subtask);
        outputbox.innerHTML += renderSubtask(i, subtask);
    }
}

/**
 * get Data from Task, which is edited
 * 
 */
 async function getDataForEditTask() {
    let id = currentId;
    let index = allTasks.indexOf(allTasks[id]);
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = getCurrentCategory();
    let originFormatDate = document.getElementById('date').value;
    let date = changeDateFormat(originFormatDate);
    await addEditTaskToArray(title, description, category, date, originFormatDate, index);
}

/**
 * united all information of inputfields in a json,
 * slice old information from allTasks,
 * add new information to allTasks and send it to server
 * @param {object} title 
 * @param {object} description 
 * @param {string} category 
 * @param {date} date 
 * @param {date} originFormatDate 
 * @param {number} index 
 */
 async function addEditTaskToArray(title, description, category, date, originFormatDate, index) {
    let editedTask = {
        title: title.value, description: description.value, category: category, member: currentMembers, invite: invitedContact,
        duedate: date, duedateOrgin: originFormatDate, prio: currentPrio, status: allTasks[index].status,
        subtasks: currentSubTasks, finishedsubtasks: [], complete: false
    };
    allTasks.splice(index, 1, editedTask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    showUserResponseOverlay('edittask-added-board-overlay');
    setTimeout(reloadEditTaskDisplay, 1500, title, description);
}


/**
 * function to close Displays after editing a task and reset all fields
 * 
 * @param {object} title 
 * @param {object} description 
 */
 function reloadEditTaskDisplay(title, description) {
    initTasks();
    addClassList('add-task-overlay-board', 'd-none');
    addClassList('editTask', 'd-none');
    addClassList('task-display', 'd-none');
    removeClassList('createTask', 'd-none');
    removeClassList('main-board', 'overflow');
    removeClassList('body-board', 'overflow');
    clearAddTaskForm(title, description);
}
