let currentCategory;
let currentPrio;
let currentMembers = [];
let currentSubTasks = [];
let colorNewCategory;
let colorBtnIsClicked = false;
let boardStatus = 'toDo';

/**
 * Initialisation Function to load the page AddTask HTML
 * 
 */
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

/**
 * Function to clear the content of a given field with a specific ID
 * 
 * @param {string} id 
 */
function clearHiddenInputField(id) {
    document.getElementById(id).value = '';
}

/**
 * Function to fill a hidden Inputfield with content
 * 
 * @param {string} id 
 */
function fillHiddenInputField(id) {
    document.getElementById(id).value = 't';
}


//TODO: Prüfen, ob diese Funkion gebraucht wird. Habe sie in keiner anderen JS oder HTML Datei gefunden.
/**
 * 
 * @param {*} member 
 * @returns 
 */
function createId(member) {
    let id = member.label.replace(' ', '');
    id = id.toLowerCase();
    return id;
}


/**
 * checks if the Task is a new Task or a Task to edit
 * 
 */
async function createNewTask() {
    if (currentId == 'empty') {
        getDataForNewTask();
    } else {
        getDataForEditTask();
    }
}

/**
 * get the Data from the New Task Input fields
 * 
 */
async function getDataForNewTask() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = getCurrentCategory();
    let originFormatDate = document.getElementById('date').value;
    let date = changeDateFormat(originFormatDate);
    await addNewTaskToArray(title, description, category, originFormatDate, date);
}


/**
 * get Data from Task, which is edited
 * 
 */
async function getDataForEditTask() {
    let id = currentId;
    let index = allTasks.indexOf(allTasks[id]);
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let category = getCurrentCategory();
    let originFormatDate = document.getElementById('date').value;
    let date = changeDateFormat(originFormatDate);
    await addEditTaskToArray(title, description, category, date, originFormatDate, index);
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
    setTimeout(initAddTask, 3200);
}


/**
 * united all information of inputfields in a json,
 * slice old information from allTasks,
 * add new information to allTasks and send it to server
 * @param {object} title 
 * @param {object} description 
 * @param {string} category 
 * @param {date} date 
 * @param {date} originFormatDate 
 * @param {number} index 
 * @param {string} prio
 * @param {array} assignedTo //assigned members
 */
async function addEditTaskToArray(title, description, category, date, originFormatDate, index) {
    let editedTask = {
        title: title.value, description: description.value, category: category, member: currentMembers,
        duedate: date, duedateOrgin: originFormatDate, prio: currentPrio, status: boardStatus,
        subtasks: currentSubTasks, finishedsubtasks: [], complete: false
    };
    allTasks.splice(index, 1, editedTask);
    await backend.setItem('allTasks', JSON.stringify(allTasks));
    showUserResponseOverlay('edittask-added-board-overlay');
    setTimeout(reloadEditTaskDisplay, 3200, title, description);
}

/**
 * function to show overlay when task is added to board
 * @param {string} id 
 */
function showUserResponseOverlay(id) {
    removeClassList(id, 'd-none');
    setTimeout(addClassList, 3000, id, 'd-none');
}


//TODO: clear all fields and reset priority btns - DONE
/**
 * function to reset all fields of add Task Menu
 * 
 * @param {object} title 
 * @param {object} description 
 */
function clearAddTaskForm(title, description) {
    title.value = '';
    description.value = '';
    clearSubtasks();
    clearAssignedMemberCheckbox();
    resetGlobalArrays();
    renderAssignedToMemberAvatare();
    clearCategoryInput();
    clearHiddenInputfields();
    clearPrioButton();
    renderCategoriesInHTML();
    renderAssignableMembersInHTML();
}

/**
 * function to close Displays after editing a task and reset all fields
 * 
 * @param {object} title 
 * @param {object} description 
 */
function reloadEditTaskDisplay(title, description) {
    initTasks();
    addClassList('add-task-overlay-board', 'd-none');
    addClassList('editTask', 'd-none');
    addClassList('task-display', 'd-none');
    removeClassList('createTask', 'd-none');
    removeClassList('main-board', 'overflow');
    clearAddTaskForm(title, description);
}

/**
 * Function to clear all Hidden InputFields
 * 
 */
function clearHiddenInputfields() {
    clearHiddenInputField('date');
    clearHiddenInputField('assignedTo-input');
    clearHiddenInputField('priority-input');
    clearHiddenInputField('category-input');
}

/**
 * Function to clear all GlobalArrays and set them to default
 * 
 */
function resetGlobalArrays() {
    currentSubTasks = [];
    currentMembers = [];
    currentId = 'empty';
    TaskIsEdited = false;
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

//TODO: In subtask-input kann kein Text eingegegeben werden, es wird direkt die changeIconsInSubtask Funktion ausgeführt und subtaskInput ist "".
//Wird dann die Zeile let subtaskInput = document.getElementById('subtask-input').value; überhaupt benötigt?
/**
 * Function to get the value of inputfield Subtasks and add this as a variable to the render function
 * 
 */
function changeIconsInSubtasks() {
    let subtaskInput = document.getElementById('subtask-input').value;
    document.getElementById('subtasks-container').innerHTML = renderNewSubTaskInput(subtaskInput);
}

/**
 * Function to get value of inputfield, push it to an array and render all Subtasks in this Array
 * 
 */
function addNewSubtask() {
    let inputSubtask = document.getElementById('subtask-input').value;
    if (inputSubtask.length >= 3) {
        document.getElementById('subtasks-output').innerHTML = '';
        let outputbox = document.getElementById('subtasks-output');
        addSubtask(inputSubtask);
        showSubtask(outputbox);
        clearSubtaskInput();
    }
}

/**
 * Function to clear the Output-innerHTML
 * 
 */
function clearSubtasks() {
    document.getElementById('subtasks-output').innerHTML = '';
}


/**
 * Function to check if an Subtask is in Array currentSubtasks.
 * If yes, the Subtask is removed when Checkbox is unchecked. 
 * If no, the Subtask is added when Checkbox is checked.  
 * 
 * @param {string} subtask 
 */
function checkSubtask(subtask) {
    if (currentSubTasks.includes(subtask)) {
        removeSubtask(subtask)
    } else {
        addSubtask(subtask)
    }
}

/**
 * Function to remove a subtask from position of its index
 * 
 * @param {string} subtask 
 */
function removeSubtask(subtask) {
    let index = currentSubTasks.indexOf(subtask);
    currentSubTasks.splice(index, 1);
}

/**
 * Function to add the subtask to array currentSubtask
 * 
 * @param {string} subtask 
 */
function addSubtask(subtask) {
    currentSubTasks.push(subtask);
}

/**
 * Function to render all Subtasks which are in the Array currentSubTasks
 * 
 * @param {object} outputbox 
 */
function showSubtask(outputbox) {
    for (let i = 0; i < currentSubTasks.length; i++) {
        let subtask = currentSubTasks[i];
        outputbox.innerHTML += renderSubtask(i, subtask);
    }
}

/**
 * Function to uncheck the Checkboxes of former assigned Taskmembers
 * 
 */
function clearAssignedMemberCheckbox() {
    let assignedId = document.getElementById('assignedToSelect').children;
    for (let i = 0; i < assignedId.length; i++) {
        let userId = assignedId[i].id.slice(11);
        if (userId != "") {
            document.getElementById(`checkbox-${userId}`).checked = false;
        }
    }
}

/**
 * Function to reset the PrioButton
 * 
 */
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

/**
 * Function to add a new Category
 * 
 */
async function addNewCategory() {
    let value = await addNewCategoryToArray();
    clearCategoryInput();
    renderCategoriesInHTML();
    changeValue(value);
}

/**
 * Function to get the name of the new category, push it with color to array allCategories and send it to server
 * 
 * @returns the name of the new category
 * 
 */
async function addNewCategoryToArray() {
    let input = document.getElementById('category-input');
    let id = input.value.toLowerCase();
    let category = { id: id, name: input.value, color: 'bg-category-New-' + colorNewCategory }
    allCategories.push(category);
    await backend.setItem('allCategories', JSON.stringify(allCategories));
    clearNewCategoryInputValue(input);
    return id;
}

/**
 * Function to add the new Category to the list of categories and render the Template with all categories
 * 
 */
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

/**
 * Function to check if Acoount is not a Guest and render the user as "You" in the Assignable Member List,
 * then render all other Users to the AssignedMember List and add the option to invide new Contact
 * 
 */
function renderAssignableMembersInHTML() {
    let memberList = document.getElementById('assignedToSelect');
    if (notGuestAccount(userInformation[activeUserIndex])) memberList.innerHTML = renderYouInAssignedTo();
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if (notGuestAccount(user)) memberList.innerHTML += renderAssignedToMembersTemplate(user.mail, user.fullname);
    }
    memberList.innerHTML += renderInviteNewContactTemplate();
}

/**
 * Function to fill the HiddenInputFields to check for Form Validation
 * 
 */
function fillInputFieldForFormValidation() {
    if (currentMembers.length >= 1)
        fillHiddenInputField('assignedTo-input');
    if (currentMembers.length == 0)
        clearHiddenInputField('assignedTo-input');
}

/**
 * Function checks if the current Account is a Guest or a real Account
 * 
 * @param {string} user 
 * @returns true if the current Account is not a Guest, otherwise it is returned false
 */
function notGuestAccount(user) {
    if (user.fullname !== 'Guest Account') return true;
    return false;
}

/**
 * Function to check if the clicked Member is already in Array currentMember.
 * If no, the member is added to the Array currentMember and the checkbos is checked. 
 * If yes, the member is deleted and the checkbox is unchecked.
 * Afterwards, the Avater is rendered and the Form Validation is executed.
 * 
 * @param {string} id equals the email adress of the assigned Member
 */
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

/**
 * Function to push the full name of the assigned Member to the Array currentMembers
 * 
 * @param {string} user 
 */
function addMemberToArray(user) {
    currentMembers.push(user.fullname);
}

/**
 * Function to get the index of the users fullname in the Array currentMembers and delete it
 * 
 * @param {string} user 
 */
function deleteMemberFromArray(user) {
    let index = getIndexFromArray(currentMembers, user.fullname);
    currentMembers.splice(index, 1);
}

/**
 * Function to clear the MemberAvatar area and fill it with all assigned Members from the Array currentMembers
 * 
 */
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

/**
 * Functions to get the Member of the Array currentMember at position i and get the Charakter at position 0.
 * 
 * @param {number} i 
 * @returns the first Letter of the Name
 */
function getFirstletterOfName(i) {
    let letter = currentMembers[i].charAt(0);
    return letter;
}


/**
 * Function to split the full name of Member from Array currentMember at the position of whitespace and create the array result with First name, '', Last Name.
 * 
 * @param {number} i 
 * @returns the first Charakter from the string result at position 2
 */
function getSecondletterOfName(i) {
    let result = currentMembers[i].split(/(\s+)/);
    let firstLetter = result[2].charAt(0);
    return firstLetter;
}

/**
 *Function to get the definied Color of a specific member from array userInformation
 *  
 * @param {string} member 
 * @returns the color from the array userInformation
 */
function getColorOfCurrentMember(member) {
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if (member == user.fullname) return user.color;
    }
}


/**
 * Function to check if the assigned Member is already assigned and part of Array currentMembers
 * 
 * @param {string} user 
 * @returns true if the full name of a assigned member is already in Array currentMembers
 */
function checkIfUserIsAlreadyAssigned(user) {
    if (currentMembers.includes(user.fullname)) return true;
    return false;
}

/**
 * Function to reset the fields to create a new category
 * 
 * @param {object} input 
 */
function clearNewCategoryInputValue(input) {
    input.value = '';
    activateAllColorBtns();
    for (let i = 0; i < 6; i++) {
        removeClassList('color-' + i, 'color-outer-circle-clicked');
        document.getElementById('colorpicker-' + i).style.pointerEvents = 'auto';
    }
}

/**
 * Function to show the Colorpicker-Bar when clicking on "New Category"
 * 
 */
function changeIconsInCategory() {
    let input = document.getElementById('category-input').value
    document.getElementById('category').innerHTML = renderNewCategoryInput(input);
    removeClassList('colorpicker', 'd-none');
    addClassList('colorpicker', 'd-flex');
}

/**
 * Function to reset the Inputfield of Category
 * 
 */
function clearCategoryInput() {
    document.getElementById('category').innerHTML = clearCategoryInputTemplate();
    addClassList('colorpicker', 'd-none');
}

/**
 * Function to set the global variable colorNewCategory to the given index number
 * Clicked color change the class and gets checked if already clicked
 * 
 * @param {string} id 
 * @param {number} index 
 */
function addNewColorToCategory(id, index) {
    colorNewCategory = index;
    toggleClassList(id, 'color-outer-circle-clicked');
    checkIfColorBtnIsClicked();
    disableOtherColorBtns();
}

/**
 * Function to check if a Colorbutton is already checked or not
 * 
 */
function checkIfColorBtnIsClicked() {
    if (colorBtnIsClicked) {
        colorBtnIsClicked = false;
    } else {
        colorBtnIsClicked = true;
    }
}

/**
 * Function to disable all other color Buttons when one Color is clicked
 * 
 */
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

/**
 * Function to activate all Colorbuttons
 * 
 */
function activateAllColorBtns() {
    for (let i = 0; i < 6; i++) {
        document.getElementById('colorpicker-' + i).style.pointerEvents = 'auto';
    }
}






