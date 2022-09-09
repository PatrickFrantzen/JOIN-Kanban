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

function createTask(id, title, description, category, date, prio, members, singleTask) {
    document.getElementById('todo-card').innerHTML += renderSingleCard(id, title, description, category, date, prio);
    document.getElementById(`assigned-${id}`).innerHTML = renderMembersOfTaskArea(id);
    createAssignedMemberArea(members, singleTask, id);
}

function createAssignedMemberArea(members, singleTask, id){
    if (singleTask.taskmember.length == 1) {
        getfirstMember(members, singleTask, id);
    } else {
        getfirstMember(members, singleTask, id);
        getOtherMembers(members, singleTask, id);
    }
    
}

function getfirstMember(members, singleTask, id) {
    let firstMember = members[0];
    let color = checkForFirstMemberColor(singleTask)
    document.getElementById(`first-member-${id}`).innerHTML = firstMember;
    document.getElementById(`first-member-${id}`).classList.add(`bg-contact-${color}`)
}

function getOtherMembers(members, singleTask, id) {
    for (let i = 1; i < singleTask.taskmember.length; i++) {
        let memberOfTask = singleTask.taskmember[i];
        let memberOfInitialArray = members[i];
        let color = checkForColor(memberOfTask);
        document.getElementById(`assigned-area-${id}`).innerHTML += renderAdditionalMembers(memberOfInitialArray, id);
        document.getElementById(`other-member-${id}`).classList.add(`bg-contact-${color}`)
    }
}

function checkForFirstMemberColor(singleTask) {

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

function closeDialog() {
    document.getElementById('task-display').classList.add('d-none');
}

function openDialog() {
    document.getElementById('task-display').classList.remove('d-none');
}