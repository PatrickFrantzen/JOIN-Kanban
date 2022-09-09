async function initTasks() {
    await loadDataFromServer();
    await init();
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
    createTask(i, title, description, category, date, prio);
    /*let members = getMembers(singleTask);*/
}

function createTask(i, title, description, category, date, prio) {
    document.getElementById('todo-card').innerHTML += renderSingleCard(i, title, description, category, date, prio)
}

/*function getMembers(singleTask) {
    for (let i = 0; i < singleTask.taskmember.length; i++) {
        let member = singleTask.taskmember[i];
        
    }
} Die Member sollen ausgelesen werden, wenn die Kreise der Member erstellt werden*/

function closeDialog() {
    document.getElementById('task-display').classList.add('d-none');
}

function openDialog() {
    document.getElementById('task-display').classList.remove('d-none');
}

