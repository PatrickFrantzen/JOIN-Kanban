let assignedToMembers = [];
let currentCategory;
let currentPrio;
let currentMembers = [];

async function initAddTask(){
    await loadDataFromServer()
    await init();
    renderProfileImage();
}


/**
 * changes value of a dropdownlist
 * @param {String} value 
 * @param {String} id 
 */
function changeValue(value, id) {
    // document.getElementById(id).innerHTML = value;
    let content = document.getElementById(value).innerHTML;
    document.getElementById(id).innerHTML = content;
    currentCategory = value;
}


/**
 * changes classlist of priority-btns
 * @param {String} id 
 * @param {String} classList 
 */
function changePriority(id, classList) {
    let imgName = `${id}-img`;
    let imgPath = document.getElementById(imgName);
    toggleClassList(id, classList);
    for (let i = 0; i < priority.length; i++) {
        let prio = priority[i].level;
        if (prio == id) {
            changePriorityIcons(imgPath, i);
            currentPrio = prio;
        }
    }
    checkIfBtnIsClicked();
}


/**
 * changes icons of clicked priority btn
 * @param {object} imgPath 
 * @param {number} i 
 */
function changePriorityIcons(imgPath, i) {
    switch (true) {
        case priority[i].toggle: {
            priority[i].toggle = false;
            imgPath.src = priority[i]["img-normal"];
            break;
        }
        default: {
            priority[i].toggle = true;
            imgPath.src = priority[i]["img-choosed"];
            break;
        }
    }
}


/**
 * checks, if a priority-btn is clicked
 * if yes, calls function for disabling the other btns
 */
function checkIfBtnIsClicked() {
    let counter = 0;
    for (let i = 0; i < priority.length; i++) {
        let btnIsClicked = priority[i].toggle;
        if (btnIsClicked) {
            disableOtherBtns(i);
        } else {
            counter++;
        }
    }
    activateOtherBtns(counter);
}


/**
 * checks value of index of clicked btn and calls function for disabling the other btns
 * @param {number} i 
 */
function disableOtherBtns(i) {
    switch (i) {
        case 0: {
            deactivateBtns('medium', 'low');
            break;
        }
        case 1: {
            deactivateBtns('urgent', 'low');
            break;
        }
        case 2: {
            deactivateBtns('medium', 'urgent');
            break;
        }
    }
}


/**
 * disables btns
 * @param {String} id1 //id of first btn to disable
 * @param {String} id2 //id of second btn to disable
 */
function deactivateBtns(id1, id2) {
    document.getElementById(id1).style.pointerEvents = "none";
    document.getElementById(id2).style.pointerEvents = "none";
}


/**
 * activates all priority btns, when counter is equal 3
 * @param {number} counter 
 */
function activateOtherBtns(counter) {
    if (counter == 3) {
        document.getElementById('urgent').style.pointerEvents = "auto";
        document.getElementById('medium').style.pointerEvents = "auto";
        document.getElementById('low').style.pointerEvents = "auto";
    }
}


function addAssignedTo() {
    let outputbox = document.getElementById('user-assignedTo');
    let teamMembers = document.getElementById('assignedToSelect').selectedOptions;
    for (let i = 0; i < teamMembers.length; i++) {
        let member = teamMembers[i];
        let id = createId(member);
        renderSelectedMembers(outputbox, member, id);
        
    }
    toggleClassList('assignedTo', 'd-none');
}


function createId(member) {
    let id = member.label.replace(' ', '');
    id = id.toLowerCase();
    return id;
}

function renderSelectedMembers(outputbox, member, id) {
    if (outputbox.innerHTML == 'Select one or more people') {
        outputbox.innerHTML = '';
    }
    if (!document.getElementById(id)) {
        outputbox.innerHTML += renderSelectedMembersTemplate(id, member);
        assignedToMembers.push(id);
        currentMembers.push(member.label);
    } else {
        alert('this user has already been added');
    }
}

function renderSelectedMembersTemplate(id, member) {
    return `
    <div id="${id}" class="d-flex align-items-center justify-content-space-between choosed-member">
    <span>${member.label}</span>
    <img class="btn-icons delete-btn" src="img/buttons/clear.png" onclick="removeAssignedTo(event, ${id})">
    </div`;
}


/**
 * removes choosed member in outputbox and prevent executing parents onclick function,
 * so drop down list of members will not be shown
 * @param {object} event // click event
 * @param {object} id 
 */
function removeAssignedTo(event, id){
    let member = id.id;
    let outputbox = document.getElementById('user-assignedTo');
    id.remove();
    deleteElementOfArray(member);
    if(assignedToMembers.length < 1){
        outputbox.innerHTML = 'Select one or more people';
    }
    event.stopPropagation();
}



function deleteElementOfArray(element){
    let index = assignedToMembers.indexOf(element);
    assignedToMembers.splice(index, 1);
}

function createNewTask() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('describtion').value;
    let category = getCurrentCategory();
    let assignedTo = currentMembers;
    let date = convertToEuropeDate();
    let prio = currentPrio;
    addNewTaskToArray(title, description, category, assignedTo, date, prio);
}

function addNewTaskToArray(title, description, category, assignedTo, date, prio) {
    console.log(title);
    console.log(description);
    console.log(category);
    console.log(assignedTo);
    console.log(date);
    console.log(prio);
    
}

function getCurrentCategory() {
    let actualCategory = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    return actualCategory;
}

function convertToEuropeDate() {
    let dueDate = document.getElementById('date').value;
    let europeanDate = new Date(dueDate);
    return europeanDate;
    /*Convert to European Date
    return europeanDate.getDate()+"/"+(europeanDate.getMonth() + 1) +"/"+date.getFullYear();*/
}





