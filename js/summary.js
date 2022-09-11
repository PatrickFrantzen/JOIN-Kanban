let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function initSummary() {
    await loadDataFromServer()
    await init();
    renderActiveUserName();
    renderProfileImage();
    getAmountOfTasks();
}


function renderActiveUserName() {
    if (activeUser == 'Guest Account') {
        document.getElementById('good-morning').innerHTML = 'Good morning';
    } else {
        document.getElementById('good-morning').innerHTML = 'Good morning,';
        document.getElementById('summary-name').innerHTML = activeUser;
    }
}

function getAmountOfTasks() {
    for (let i = 0; i < allTasks.length; i++) {
        let task = allTasks[i];
        countDifferentStatuses(task.projectstatus);
        countUrgentTasks(task);
    }
    countTotalAmountOfTasks();
    determineUpcomingDate();
    renderAmountOfTasks();
}


function countTotalAmountOfTasks(){
    let totalAmount = 0;
    totalAmount += taskAmount.toDo;
    totalAmount += taskAmount.progress;
    totalAmount += taskAmount.feedback;
    totalAmount += taskAmount.done;
    taskAmount.total = totalAmount;
}


function determineUpcomingDate() {
    let dateInMs = [];
    taskAmount.urgentDate.forEach(date => {
        let transformDate = Date.parse(date);
        dateInMs.push(transformDate);
    });
    dateInMs = sortDates(dateInMs);
    convertNumberToDate(dateInMs);
}


function convertNumberToDate(dateArray){
    if(dateArray.length > 0){
        let upcomingDate = new Date(dateArray[0]);
        // taskAmount.urgentDate = upcomingDate;
        let month = months[upcomingDate.getMonth()];
        let day = upcomingDate.getDate();
        let year = upcomingDate.getFullYear();
        taskAmount.urgentDate = `${month} ${day}, ${year}`;
    }
}


function sortDates(dateInMs){
    dateInMs = dateInMs.sort(function (a, b) {
        return a - b;
    });
    return dateInMs;
}


function countUrgentTasks(task) {
    if (task.taskprio == 'urgent') {
        taskAmount.urgent++;
        taskAmount.urgentDate.push(task.duedateOrgin)
    }
}

function countDifferentStatuses(status) {
    switch (status) {
        case 'toDo': {
            taskAmount.toDo++;
            break;
        }
        case 'progress': {
            taskAmount.toDo++;
            break;
        }
        case 'feedback': {
            taskAmount.toDo++;
            break;
        }
        case 'done': {
            taskAmount.toDo++;
            break;
        }
    }
}


function renderAmountOfTasks(){
    document.getElementById('amount-total').innerHTML = taskAmount.total;
    document.getElementById('amount-progress').innerHTML = taskAmount.progress;
    document.getElementById('amount-feedback').innerHTML = taskAmount.feedback;
    document.getElementById('amount-urgent').innerHTML = taskAmount.urgent;
    document.getElementById('amount-done').innerHTML = taskAmount.done;
    document.getElementById('amount-todo').innerHTML = taskAmount.toDo;
    document.getElementById('upcoming-date').innerHTML = taskAmount.urgentDate;
}

