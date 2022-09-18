let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

async function initSummary() {
    await loadDataFromServer()
    await init();
    renderActiveUserName();
    renderProfileImage();
    getAmountOfTasks();
    greetUser();
}


function greetUser() {
    setTimeout(closeGreetingUserDisplay, 3000);
}


function closeGreetingUserDisplay() {
    document.getElementById('welcome').style.display = 'none';
}



function renderActiveUserName() {
    let greetingOutput = document.getElementById('good-morning');
    greetingOutput.innerHTML = checkGreetingForm();
    if (activeUser !== 'Guest Account'){
        document.getElementById('summary-name').innerHTML = activeUser;
        greetingOutput.innerHTML += ',';
    }
}


/**
 * checks current time and
 * @returns form of greeting depending on current time
 */
function checkGreetingForm() {
    let hour = new Date().getHours();
    if(hour > 5 && hour < 12) return 'Good morning';
    if(hour > 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';   
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


/**
 * calculates total of all tasks of the four board categories:
 * To Do, In Progress, Awaiting feedback and Done
 */
function countTotalAmountOfTasks() {
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


/**
 * converts first date in array from milliseconds to date format
 * @param {array} dateArray 
 */
function convertNumberToDate(dateArray) {
    if (dateArray.length > 0) {
        let upcomingDate = new Date(dateArray[0]);
        let month = months[upcomingDate.getMonth()];
        let day = upcomingDate.getDate();
        let year = upcomingDate.getFullYear();
        taskAmount.urgentDate = `${month} ${day}, ${year}`;
    }
}


/**
 * sorts all converted urgent dates => next upcoming date first
 * @param {array} dateInMs date in millisecond
 * @returns dateInMS
 */
function sortDates(dateInMs) {
    dateInMs = dateInMs.sort(function (firstDate, secondDate) {
        return firstDate - secondDate;
    });
    return dateInMs;
}


function countUrgentTasks(task) {
    if (task.taskprio == 'urgent') {
        taskAmount.urgent++;
        taskAmount.urgentDate.push(task.duedateOrgin)
    }
}


/**
 * adds up all tasks of a status category 
 * @param {string} status status in board
 */
function countDifferentStatuses(status) {
    switch (status) {
        case 'toDo': {
            taskAmount.toDo++;
            break;
        }
        case 'progress': {
            taskAmount.progress++;
            break;
        }
        case 'feedback': {
            taskAmount.feedback++;
            break;
        }
        case 'done': {
            taskAmount.done++;
            break;
        }
    }
}


function renderAmountOfTasks() {
    document.getElementById('amount-total').innerHTML = `<b>${taskAmount.total}</b>`;
    document.getElementById('amount-progress').innerHTML = `<b>${taskAmount.progress}</b>`;
    document.getElementById('amount-feedback').innerHTML = `<b>${taskAmount.feedback}</b>`;
    document.getElementById('amount-urgent').innerHTML = `<b>${taskAmount.urgent}</b>`;
    document.getElementById('amount-done').innerHTML = `<b>${taskAmount.done}</b>`;
    document.getElementById('amount-todo').innerHTML = `<b>${taskAmount.toDo}</b>`;
    document.getElementById('upcoming-date').innerHTML = `<b>${taskAmount.urgentDate}</b>`;
}

