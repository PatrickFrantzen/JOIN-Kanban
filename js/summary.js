async function initSummary(){
    await loadDataFromServer()
    await init();
    renderActiveUserName();
    renderProfileImage();
    getAmountOfTasks();
}


function renderActiveUserName() {
    if (activeUser == 'Guest Account'){
        document.getElementById('good-morning').innerHTML = 'Good morning';
    } else {
        document.getElementById('good-morning').innerHTML = 'Good morning,';
        document.getElementById('summary-name').innerHTML = activeUser;
    }
}

function getAmountOfTasks(){
    for (let i = 0; i < allTasks.length; i++) {
        let task = allTasks[i];
        countDifferentStatuses(task.projectstatus);
        countUrgentTasks(task);
    }
    // let sortedDates = determineUpcomingDate();
    // console.log(sortedDates);
}


// function determineUpcomingDate(){
//     taskAmount.urgentDate.sort(function(secondDateInArray, firstDateInArray){
//         return firstDateInArray - secondDateInArray;
//         });
// }


function countUrgentTasks(task){
    if(task.taskprio == 'urgent'){
        taskAmount.urgent++;
        taskAmount.urgentDate.push(task.duedate)
    }
}

function countDifferentStatuses(status){
    switch(status){
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