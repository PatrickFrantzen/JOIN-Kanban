let assignedToMembers = [];
let currentCategory;
let currentPrio;
let currentMembers = [];
let currentSubTasks = [];
let colorNewCategory;
let colorBtnIsClicked = false;

async function initAddTask() {
    await loadDataFromServer()
    await init();
    await includeHTML('include-addtask-html');
    renderProfileImage();
    renderCategoriesInHTML();
    renderAssignableMembersInHTML();
}


/**
 * changes value of category dropdownlist
 * @param {String} value 
 * @param {String} input 
 */
function changeValue(value) {
    clearCategoryInput();
    let content = document.getElementById(value);
    let category = content.firstChild.nextSibling.innerHTML;
    document.getElementById('category-input').value = category;
    document.getElementById('category-output').innerHTML = content.innerHTML;
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

//TODO
function addAssignedTo() {
    let outputbox = document.getElementById('user-assignedTo');
    let teamMembers = document.querySelectorAll('input[name:"assignedTo-checkboxes"]');
    teamMembers.forEach(member => {
        if(member.checked){
            currentMembers.push(member);
        }
    });
    toggleClassList('assignedTo', 'd-none');
}


function createId(member) {
    let id = member.label.replace(' ', '');
    id = id.toLowerCase();
    return id;
}


//TODO
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


//TODO
function renderSelectedMembersTemplate(id, member) {
    return `
    <div id="${id}" class="d-flex align-items-center justify-content-space-between choosed-member">
    <span>${member.label}</span>
    <img class="btn-icons delete-btn" src="img/buttons/clear.png" onclick="removeAssignedTo(event, ${id})">
    </div`;
}


//TODO
/**
 * removes choosed member in outputbox and prevent executing parents onclick function,
 * so drop down list of members will not be shown
 * @param {object} event // click event
 * @param {object} id 
 */
function removeAssignedTo(event, id) {
    let member = id.id;
    let outputbox = document.getElementById('user-assignedTo');
    id.remove();
    deleteElementOfArray(member);
    if (assignedToMembers.length < 1) {
        outputbox.innerHTML = 'Select one or more people';
    }
    event.stopPropagation();
}


//TODO
function deleteElementOfArray(element) {
    let index = assignedToMembers.indexOf(element);
    assignedToMembers.splice(index, 1);
}



//TODO: outsourcing status, so function can be used from board.html too
/**
 * reads information of inputfields 
 * 
 */
function createNewTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('describtion');
    let category = getCurrentCategory();
    let assignedTo = currentMembers;
    let originFormatDate = document.getElementById('date').value;
    let date = changeDateFormat(originFormatDate);
    let prio = currentPrio;
    let status = 'toDo';
    let subtasks = currentSubTasks;
    let completedSubTasks = [];
    let completedTask = false;
    addNewTaskToArray(title, description, category, assignedTo, date, originFormatDate, prio, status, subtasks, completedSubTasks, completedTask);
}


/**
 * united all information of inputfields in a json,
 * adds it to allTasks and send it to server
 * @param {object} title 
 * @param {object} description 
 * @param {string} category 
 * @param {array} assignedTo //assigned members
 * @param {date} date 
 * @param {string} prio 
 * @param {string} status 
 */
async function addNewTaskToArray(title, description, category, assignedTo, date, originFormatDate, prio, status, subtasks, completedSubTasks, completedTask) {
    let newTask = { tasktitle: title.value, taskdescription: description.value, taskcategory: category, taskmember: assignedTo, duedate: date, duedateOrgin: originFormatDate, taskprio: prio, projectstatus: status, tasksubtasks: subtasks, finishedsubtasks: completedSubTasks, complete: completedTask };
    allTasks.push(newTask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    clearAddTask(title, description);
    showUserResponseOverlay('addtask-added-board-overlay');
}

function showUserResponseOverlay(id){
    removeClassList(id, 'd-none');
    setTimeout(addClassList, 3000, id, 'd-none');
}



//TODO: clear all fields and reset priority btns
function clearAddTask(title, description) {
    let outputbox = document.getElementById('user-assignedTo');
    outputbox = '';
    title.value = '';
    description.value = '';
    currentSubTasks = [];
}

/**
 * This function transforms the first letter of the category to Uppercase
 * 
 * @returns the current category but with first letter uppercase
 * 
 */
function getCurrentCategory() {
    let actualCategory = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    return actualCategory;
}

/**
 * This function gets the Date of the Task and transforms it into a string, European Standard Time
 * 
 * @param {string} originFormatDate 
 * @returns the date as a string in European Standard Time
 */
function changeDateFormat(originFormatDate) {
    let day = originFormatDate.slice(8, 10);
    let month = originFormatDate.slice(5, 7);
    let year = originFormatDate.slice(0, 4);
    return `${day}.${month}.${year}`
}


function changeIconsInSubtasks() {
    let subtaskInput = document.getElementById('subtask-input').value
    document.getElementById('subtasks-container').innerHTML = renderNewSubTaskInput(subtaskInput);
}


function addNewSubtask() {
    let inputSubtask = document.getElementById('subtask-input').value;
    let outputbox = document.getElementById('subtasks-output');
    currentSubTasks.push(inputSubtask);
    outputbox.innerHTML += renderSubtask(inputSubtask);
    clearSubtaskInput();
}



async function addNewCategory() {
    let value = await addNewCategoryToArray();
    clearCategoryInput();
    renderCategoriesInHTML();
    changeValue(value);
}


async function addNewCategoryToArray(){
    let input = document.getElementById('category-input');
    let id = input.value.toLowerCase();
    let category = {id: id, name: input.value, color: 'bg-category-New-' + colorNewCategory}
    allCategories.push(category);
    await backend.setItem('allCategories', JSON.stringify(allCategories));
    clearNewCategoryInputValue(input);
    return id;
}


function renderCategoriesInHTML(){
    let categoryList = document.getElementById('categories');
    categoryList.innerHTML = '<li id="newCategory" onclick="changeIconsInCategory()">New Category</li>';
    for (let i = 0; i < allCategories.length; i++) {
        let category = allCategories[i];
        let id = category.id;
        let name = category.name;
        let color = category.color;
        categoryList.innerHTML += renderCategoriesInHTMLTemplate(id, name, color);
    }
}


function renderAssignableMembersInHTML(){
    let memberList = document.getElementById('assignedToSelect');
    memberList.innerHTML = renderYouInAssignedTo();
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if(notGuestAccount(user)){
            memberList.innerHTML += renderAssignedToMembersTemplate(user.mail, user.fullname);
        }
    }
    memberList.innerHTML += renderInviteNewContactTemplate();
}


function notGuestAccount(user){
    if(user.fullname !== 'Guest Account')
        return true;
    else 
        return false;
}


function clearNewCategoryInputValue(input){
    input.value = '';
    activateAllColorBtns();
    for (let i = 0; i < 6; i++) {
        removeClassList('color-' + i,'color-outer-circle-clicked');
        document.getElementById('colorpicker-' + i).style.pointerEvents = 'auto';
    }
}


function changeIconsInCategory() {
    let input = document.getElementById('category-input').value
    document.getElementById('category').innerHTML = renderNewCategoryInput(input);
    removeClassList('colorpicker', 'd-none');
    addClassList('colorpicker', 'd-flex');
}


function clearCategoryInput() {
    document.getElementById('category').innerHTML = clearCategoryInputTemplate();
    addClassList('colorpicker', 'd-none');
}


function addNewColorToCategory(id, index) {
    colorNewCategory = index;
    toggleClassList(id, 'color-outer-circle-clicked');
    checkIfColorBtnIsClicked();
    disableOtherColorBtns();
}


function checkIfColorBtnIsClicked(){
    if(colorBtnIsClicked){
        colorBtnIsClicked = false;
    }else{
        colorBtnIsClicked = true;
    }
}


function disableOtherColorBtns() {
    for (let i = 0; i < 6; i++) {
        if (i !== colorNewCategory && colorBtnIsClicked) {
            document.getElementById('colorpicker-' + i).style.pointerEvents = 'none';
        } 
        if(i == colorNewCategory && !colorBtnIsClicked){
            activateAllColorBtns();
            console.log(i);
        }
    }
}


function activateAllColorBtns(){
    for (let i = 0; i < 6; i++) {
        document.getElementById('colorpicker-' + i).style.pointerEvents = 'auto';  
    }
}






