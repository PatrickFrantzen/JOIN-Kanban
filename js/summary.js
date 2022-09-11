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
        let status = allTasks[i].projectstatus;
        countDifferentStatuses(status);
    }
}

function countDifferentStatuses(status){
    switch(status){
        case 'toDo': {
            taskAmount.toDo++;
        }

    }
}