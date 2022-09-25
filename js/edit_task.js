let currentId = 'empty';
let TaskIsEdited = false;

async function initEditTask() {
    await loadDataFromServer()
    await init();
    await includeHTML('include-edittask-html');
    renderProfileImage();
    renderCategoriesInHTML();
    renderAssignableMembersInHTML();
}

function editTask(id, status) {
    boardStatus = status;
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
    removeClassList('add-task-overlay-board', 'd-none');
    removeClassList('editTask', 'd-none');
    addClassList('createTask', 'd-none');
    addClassList('task-display', 'd-none');
    addClassList(`display-${id}`, 'd-none');
    addClassList(`display-content-${id}`, 'd-none');
    renderEditLayout(title, description, category, date, prio, subtasks);
}

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

function setValue(category) {
    clearCategoryInput();
    let content = document.getElementById(category);
    document.getElementById('category-output').innerHTML = content.innerHTML;
}

function setAssignedTo() {
    for (let i = 0; i < currentMembers.length; i++) {
        let member = currentMembers[i];
        let email = getEmailofCurrentMember(member);
        document.getElementById(`checkbox-${email}`).checked = true;
    }
    renderAssignedToMemberAvatare();
}

function setPrioButton(prio) {
    changePriority(prio, `btn-${prio}`);
}

function getEmailofCurrentMember(member){
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if (member == user.fullname) return user.mail;
    }
}

function setSubtasks(subtasks) {
    document.getElementById('subtasks-output').innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        let outputbox = document.getElementById('subtasks-output');
        currentSubTasks.push(subtask);
        outputbox.innerHTML += renderSubtask(i, subtask);
    }
}
