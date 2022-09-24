let currentCategory;
let currentPrio;
let currentMembers = [];
let currentSubTasks = [];
let colorNewCategory;
let colorBtnIsClicked = false;
let boardStatus = 'toDo';

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
            fillHiddenInputField('priority-input');
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
        clearHiddenInputField('priority-input');
    }
}


function clearHiddenInputField(id) {
    document.getElementById(id).value = '';
}


function fillHiddenInputField(id) {
    document.getElementById(id).value = 't';
}


function createId(member) {
    let id = member.label.replace(' ', '');
    id = id.toLowerCase();
    return id;
}


/**
 * reads information of inputfields 
 * 
 */
async function createNewTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('describtion');
    let category = getCurrentCategory();
    let originFormatDate = document.getElementById('date').value;
    let date = changeDateFormat(originFormatDate);
    await addNewTaskToArray(title, description, category, date, originFormatDate);
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
async function addNewTaskToArray(title, description, category, date, originFormatDate) {
    let newTask = {
        title: title.value, description: description.value, category: category, member: currentMembers,
        duedate: date, duedateOrgin: originFormatDate, prio: currentPrio, status: boardStatus,
        subtasks: currentSubTasks, finishedsubtasks: [], complete: false
    };
    allTasks.push(newTask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    clearAddTaskForm(title, description);
    showUserResponseOverlay('addtask-added-board-overlay');
}


function showUserResponseOverlay(id) {
    removeClassList(id, 'd-none');
    setTimeout(addClassList, 3000, id, 'd-none');
}


//TODO: clear all fields and reset priority btns - DONE
function clearAddTaskForm(title, description) {
    title.value = '';
    description.value = '';
    clearSubtasks();
    resetGlobalArrays();
    renderAssignedToMemberAvatare();
    clearCategoryInput();
    clearHiddenInputfields();
    clearPrioButton();
}


function clearHiddenInputfields() {
    clearHiddenInputField('date');
    clearHiddenInputField('assignedTo-input');
    clearHiddenInputField('priority-input');
    clearHiddenInputField('category-input');
}


function resetGlobalArrays() {
    currentSubTasks = [];
    currentMembers = [];
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
    if (inputSubtask.length >= 3) {
        let outputbox = document.getElementById('subtasks-output');
        currentSubTasks.push(inputSubtask);
        outputbox.innerHTML += renderSubtask(inputSubtask);
        clearSubtaskInput();
    }
}

function clearSubtasks() {
    clearSubtaskCheckbox();
    document.getElementById('subtasks-output').innerHTML = '';

}

function clearSubtaskCheckbox() {
    let assignedId = document.getElementById('assignedToSelect').children;
    for (let i = 0; i < assignedId.length; i++) {
        let userId = assignedId[i].id.slice(11);
        if (userId != "") {
            document.getElementById(`checkbox-${userId}`).checked = false;
        }
    }
}

function clearPrioButton() {
    for (let i = 0; i < priority.length; i++) {
        if (currentPrio == priority[i].level) {
            priority[i].toggle = false;
            let img = priority[i]["img-normal"];
            toggleClassList(currentPrio, `btn-${currentPrio}`)
            document.getElementById(`${currentPrio}-img`).src = img;
        }
        activateOtherBtns(3);
    }
}

    async function addNewCategory() {
        let value = await addNewCategoryToArray();
        clearCategoryInput();
        renderCategoriesInHTML();
        changeValue(value);
    }


    async function addNewCategoryToArray() {
        let input = document.getElementById('category-input');
        let id = input.value.toLowerCase();
        let category = { id: id, name: input.value, color: 'bg-category-New-' + colorNewCategory }
        allCategories.push(category);
        await backend.setItem('allCategories', JSON.stringify(allCategories));
        clearNewCategoryInputValue(input);
        return id;
    }


    function renderCategoriesInHTML() {
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


    function renderAssignableMembersInHTML() {
        let memberList = document.getElementById('assignedToSelect');
        if (notGuestAccount(userInformation[activeUserIndex])) memberList.innerHTML = renderYouInAssignedTo();
        for (let i = 0; i < userInformation.length; i++) {
            let user = userInformation[i];
            if (notGuestAccount(user)) memberList.innerHTML += renderAssignedToMembersTemplate(user.mail, user.fullname);
        }
        memberList.innerHTML += renderInviteNewContactTemplate();
    }


    function fillInputFieldForFormValidation() {
        if (currentMembers.length >= 1)
            fillHiddenInputField('assignedTo-input');
        if (currentMembers.length == 0)
            clearHiddenInputField('assignedTo-input');
    }


    function notGuestAccount(user) {
        if (user.fullname !== 'Guest Account') return true;
        return false;
    }


    function addAssignedToMembers(id) {
        for (let i = 0; i < userInformation.length; i++) {
            let checkBox = document.getElementById(`checkbox-${id}`);
            let user = userInformation[i];
            if (user.mail == id) {
                if (!checkIfUserIsAlreadyAssigned(user) && checkBox.checked)
                    addMemberToArray(user);
                if (checkIfUserIsAlreadyAssigned(user) && !checkBox.checked)
                    deleteMemberFromArray(user);
            }
        }
        renderAssignedToMemberAvatare();
        fillInputFieldForFormValidation();
    }


    function addMemberToArray(user) {
        currentMembers.push(user.fullname);
    }


    function deleteMemberFromArray(user) {
        let index = getIndexFromArray(currentMembers, user.fullname);
        currentMembers.splice(index, 1);
    }


    function renderAssignedToMemberAvatare() {
        let assignedToOutput = document.getElementById('assignedTo-avatare-container');
        assignedToOutput.innerHTML = '';
        for (let i = 0; i < currentMembers.length; i++) {
            let member = currentMembers[i];
            let firstletter = getFirstletterOfName(i);
            let secondLetter = getSecondletterOfName(i);
            let color = getColorOfCurrentMember(member);
            assignedToOutput.innerHTML += renderAssignedToMemberAvatareTemplate(firstletter, secondLetter, color);
        }
    }


    function getFirstletterOfName(i) {
        let letter = currentMembers[i].charAt(0);
        return letter;
    }

    function getSecondletterOfName(i) {
        let result = currentMembers[i].split(/(\s+)/);
        let firstLetter = result[2].charAt(0);
        return firstLetter;
    }


    function getColorOfCurrentMember(member) {
        for (let i = 0; i < userInformation.length; i++) {
            let user = userInformation[i];
            if (member == user.fullname) return user.color;
        }
    }

    function checkIfUserIsAlreadyAssigned(user) {
        if (currentMembers.includes(user.fullname)) return true;
        return false;
    }

    function clearNewCategoryInputValue(input) {
        input.value = '';
        activateAllColorBtns();
        for (let i = 0; i < 6; i++) {
            removeClassList('color-' + i, 'color-outer-circle-clicked');
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


    function checkIfColorBtnIsClicked() {
        if (colorBtnIsClicked) {
            colorBtnIsClicked = false;
        } else {
            colorBtnIsClicked = true;
        }
    }


    function disableOtherColorBtns() {
        for (let i = 0; i < 6; i++) {
            if (i !== colorNewCategory && colorBtnIsClicked) {
                document.getElementById('colorpicker-' + i).style.pointerEvents = 'none';
            }
            if (i == colorNewCategory && !colorBtnIsClicked) {
                activateAllColorBtns();
            }
        }
    }


    function activateAllColorBtns() {
        for (let i = 0; i < 6; i++) {
            document.getElementById('colorpicker-' + i).style.pointerEvents = 'auto';
        }
    }






