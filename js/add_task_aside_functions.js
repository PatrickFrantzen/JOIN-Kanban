//priority btns

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
 * if yes, it calls function for disabling the other btns
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


// Colorpicker

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


/**
 * Function to set the global variable colorNewCategory to the given index number
 * Clicked color change the class and gets checked if already clicked
 * 
 * @param {string} id 
 * @param {number} index 
 */
function addNewColorToCategory(id, index) {
    colorNewCategory = index;
    document.getElementById('color-input').value = 1;
    toggleClassList(id, 'color-outer-circle-clicked');
    checkIfColorBtnIsClicked();
    disableOtherColorBtns();
}

// Date Inputfield

/**
 * Function to set date of due date to today
 * 
 */
 function renderDate() {
    let date = document.getElementById('date');
    if (date) date.valueAsDate = new Date();
}


// help function


/**
 * Function to fill a hidden Inputfield with content
 * 
 * @param {string} id 
 */
 function fillHiddenInputField(id) {
    document.getElementById(id).value = 't';
}


/**
 * function to show a user response
 * @param {string} id 
 */
 function showUserResponseOverlay(id) {
    removeClassList(id, 'd-none');
    setTimeout(addClassList, 3000, id, 'd-none');
}


/**
 * shows a user response and request to pick a color
 */
 function colorPickerError() {
    let text = 'Please pick a color';
    userResonse(text, 'addtask-user-response-overlay', 'addtask-user-response-overlay-text');
}


/**
 * shows a user response and request to enter a name for new category
 */
 function newCategoryError() {
    let text = 'Please enter the name of new category';
    userResonse(text, 'addtask-user-response-overlay', 'addtask-user-response-overlay-text');
}


function showUserResponseInviteContact() {
    let text = 'An inivitation has been sent via email';
    userResonse(text, 'addtask-user-response-overlay', 'addtask-user-response-overlay-text');
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