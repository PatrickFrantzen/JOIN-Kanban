/**
 * Function to clear the content of a given field with a specific ID
 * 
 * @param {string} id 
 */
 function clearHiddenInputField(id) {
    document.getElementById(id).value = '';
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

function clearAddTaskFields() {
    let title = document.getElementById('title');
    let description = document.getElementById('description');
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
 * Function to clear the Output-innerHTML
 * 
 */
 function clearSubtasks() {
    document.getElementById('subtasks-output').innerHTML = '';
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
    }
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
 * Function to reset the Inputfield of Category
 * 
 */
 function clearCategoryInput() {
    document.getElementById('category').innerHTML = clearCategoryInputTemplate();
    addClassList('colorpicker', 'd-none');
}

function clearAssignedToInput() {
    document.getElementById('outputbox').innerHTML = clearAssignedToInputTemplate();
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