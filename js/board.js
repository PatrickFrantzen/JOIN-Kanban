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
    createTask(i, title, description, category, date, prio, members, singleTask);

}

function createTask(i, title, description, category, date, prio, members, singleTask) {
    document.getElementById('todo-card').innerHTML += renderSingleCard(i, title, description, category, date, prio);
    document.getElementById(`assigned-${i}`).innerHTML = renderMembersOfTaskArea();
    getfirstMember(members, singleTask);
}

function getfirstMember(members, singleTask) {
    let firstMember = members[0];
    let color = checkForMemberColor(singleTask)
    document.getElementById('first-member').innerHTML = firstMember;
    document.getElementById('first-member').classList.add(`bg-contact-${color}`)
}

function checkForMemberColor(singleTask) {

    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        let name = user.fullname;
        let color = user.color;
        let firstmember = singleTask.taskmember[i];

        if (name == firstmember) {
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

function closeDialog() {
    document.getElementById('task-display').classList.add('d-none');
}

function openDialog() {
    document.getElementById('task-display').classList.remove('d-none');
}