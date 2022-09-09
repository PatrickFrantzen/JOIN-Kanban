async function initTasks() {
    await loadDataFromServer();
    await init();
    renderProfileImage();
    renderCards();
}

function renderCards() {
    for (let i = 0; i < allTasks.length; i++) {
        let singleTask = allTasks[i];
        getTaskDetails(i, singleTask);
    }
}

function getTaskDetails(i, singleTask) {
    let title = singleTask.tasktitle;
    let description = singleTask.taskdescription;
    let category = singleTask.taskcategory;
    let date = singleTask.duedate;
    let prio = singleTask.taskprio;
    let members = getMembers(singleTask);
    createTask(i, title, description, category, date, prio, members);
    
}

function createTask(i, title, description, category, date, prio, members) {
    document.getElementById('todo-card').innerHTML += renderSingleCard(i, title, description, category, date, prio);
    document.getElementById(`assigned-${i}`).innerHTML = renderMembersOfTask(members); //Initialen der Member ermittel
}

function getMembers(singleTask) {
    let taskmembers =[];
    for (let i = 0; i < singleTask.taskmember.length; i++) {
        let member = singleTask.taskmember[i];
        taskmembers.push(member);
    }
    return taskmembers;

} 

function closeDialog() {
    document.getElementById('task-display').classList.add('d-none');
}

function openDialog() {
    document.getElementById('task-display').classList.remove('d-none');
}

