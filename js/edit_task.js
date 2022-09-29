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
    let date = edittask.duedate;
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
    removeClassList('add-task-overlay-board', 'd-none');
    removeClassList('editTask', 'd-none');
    addClassList('createTask', 'd-none');
    addClassList('task-display', 'd-none');
    addClassList(`display-${id}`, 'd-none');
    addClassList(`display-content-${id}`, 'd-none');
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
    document.getElementById('category-output').innerHTML = content.innerHTML;
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
    renderAssignedToMemberAvatare();
}

/**
 * Function to set the Priority of the Task to edit
 * 
 * @param {string} prio 
 */
function setPrioButton(prio) {
    changePriority(prio, `btn-${prio}`);
}

/**
 * Function to get the Emailadress to get the right ID of function setAssignedTo
 * 
 * @param {string} member 
 * @returns the Email adress of the currentMember
 */
function getEmailofCurrentMember(member){
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
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
