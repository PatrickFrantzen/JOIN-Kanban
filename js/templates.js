let userInformation;
let contactColors;
let allTasks = [];
let allCategories = [];

let priority = [
    {
        "level": "urgent",
        "toggle": false,
        "img-normal": "img/add_task/arrow_urgent.svg",
        "img-choosed": "img/add_task/arrow_urgent_white.svg",
    },
    {
        "level": "medium",
        "toggle": false,
        "img-normal": "img/add_task/medium.svg",
        "img-choosed": "img/add_task/medium_white.svg",
    },
    {
        "level": "low",
        "toggle": false,
        "img-normal": "img/add_task/arrow_low.svg",
        "img-choosed": "img/add_task/arrow_low_white.svg",
    }
];

let taskAmount = {
    "toDo": 0,
    "progress": 0,
    "feedback": 0,
    "done": 0,
    "total": 0,
    "urgent": 0,
    "urgentDate": [],
}


function renderContactDetails(firstLetter, secondLetter, name, email, color, phone, animationContact) {
    return `
    <div id="contact-detail-data-container" class="${animationContact} d-flex flex-column" >
            <div class="contact-card-big d-flex ">
                        <img class="back-mobile curserPointer" src="img/add_task/arrow-left-line.png" alt="" onclick="returnToContactOverview()">
                        <div
                            class="contact-avatar-outer-big bg-contact-blue d-flex align-items-center justify-content-center">
                            <div id="names-letter"
                                class="contact-avatar-big bg-contact-${color} d-flex align-items-center justify-content-center">
                                ${firstLetter}${secondLetter}
                            </div>
                        </div>
                        <div class="contact-data-big">
                            <p id="contact-name-big" class="contact-name-big">${name}</p>
                            <div class="add-task d-flex curserPointer" onclick="openAddTaskForm('status')">
                                <img src="img/buttons/add_light_blue.svg" alt="">
                                <p>Add task</p>
                            </div>
                        </div>
                    </div>
                    <div id="contact-information-headline" class="d-flex align-items-center justify-content-space-between m-top-50">
                        <span class="f-21">Contact Information</span>
                        <div class="d-flex align-items-center edit-container" onclick="showOverlayContact('edit-contact', 'edit-contact-overlay', '${email}')">
                            <img class="edit-img" src="img/buttons/edit_blue.png" alt="">
                            <p class="f-18 m-left-8">Edit Contact</p>
                        </div>
                    </div>

                    <div id="contact-content-mail" class="d-flex flex-column justify-content-center f-18 m-top-50">
                        <span><b>Email</b></span>
                        <a class="mailto-big f-18 m-top-20"
                            href="mailto:${email}">${email}</a>
                    </div>

                    <div id="phone" class="d-flex flex-column justify-content-center f-18 m-top-28">
                        <span><b>Phone</b></span>
                        <a class="f-18 color-black m-top-20" href="tel:+491743451698">${phone}</a>
                    </div>
            </div>      
    </div>          
    `
}


function renderContactMobileBtnTemplate(email) {
    return `
    <button id="new-contact-btn-mobile" class="darkblue-btn m-left-24"
        onclick="showOverlayContact('new-contact', 'new-contact-overlay')">
        <span class="f-18">New Contact</span>
        <img class="btn-icons-contact" src="img/buttons/newcontact.png" alt="">
    </button>
    <button id="edit-contact-mobile" class="darkblue-btn m-left-24 d-none"
        onclick="showOverlayContact('edit-contact', 'edit-contact-overlay', '${email}')">
        <img src="img/add_task/edit_white.png" alt="">
    </button>
    `
}

function renderContactsTemplate(name, email, firstLetter, color, secondLetter) {
    return `
    <div id="${email}" class="contact-card-small d-flex" onclick="showContactDetails('${email}')">
    <div
        class="contact-avatar-outer d-flex align-items-center justify-content-center">
        <div
            class="contact-avatar bg-contact-${color} d-flex align-items-center justify-content-center">
            ${firstLetter}${secondLetter}
        </div>
    </div>
    <div class="contact-data">
        <p class="contact-name">${name}</p>
        <a class="mailto"
            >${email}</a>
    </div>
</div>
    `;
}

function renderContactsMobileTemplate(name, email, firstLetter, color, secondLetter) {
    return `
    <div id="${email}" class="contact-card-small d-flex" onclick="showContactDetailsMobile('${email}')">
    <div
        class="contact-avatar-outer d-flex align-items-center justify-content-center">
        <div
            class="contact-avatar bg-contact-${color} d-flex align-items-center justify-content-center">
            ${firstLetter}${secondLetter}
        </div>
    </div>
    <div class="contact-data">
        <p class="contact-name">${name}</p>
        <a class="mailto"
            >${email}</a>
    </div>
</div>
    `;
}


function renderLetterContainerTemplate(letter) {
    return `
    <div id="contact-letter-${letter}" class="contact-letter w-80 d-flex align-items-start flex-column">
    <span>${letter}</span>
    <div id="contact-card-${letter}" class="contact-card-small-container">
    </div>
     </div>
    `;
}


function renderLetterContainerMobileTemplate(letter) {
    return `
    <div id="contact-letter-mobile-${letter}" class="contact-letter w-80 d-flex align-items-start flex-column">
    <span>${letter}</span>
    <div id="contact-card-mobile-${letter}" class="contact-card-small-container">
    </div>
     </div>
    `;
}

function renderSingleCard(id, title, description, category, date, prio, subtasks, completedsubtasks) {
    return `
    <div id="card-${id}" draggable="true" ondragstart="startDragging(${id})" onclick="openDialog('${id}', '${title}', '${description}', '${category}', '${date}', '${prio}', '${subtasks}', '${completedsubtasks}')" class="card board-inner-card d-flex flex-column m-top-28">
    <span class="board-text board-category bg-category-${category}">${category}</span>
    <span class="board-text board-title">${title}</span>
    <span class="board-text board-description description-scroll">${description}</span>

    <div id="progressbar-${id}" class="progressbar-outer board-text d-flex align-items-center text-align-center">
        
    </div>

    <div id="assigned-${id}" class="board-text board-assigned d-flex justify-content-space-between align-items-center">
        <div id="assigned-area-${id}" class="assigned-area d-flex"></div>
        <div class="board-assigned-urgent"><img m-right-25 id="prio-${id}" src=""> </div>
    </div>
</div>
`
}


function renderProgressbarArea(id, numberOfSubtasks, numberOfFinishedSubtasks) {
    return `
        <div class="progressbar-inner" role="progressbar">
        <div id="bar-${id}" class="bar"></div>
        </div>
            <div class="subtasks d-flex text-align-center">
                <span class="f-12 ">${numberOfFinishedSubtasks}/${numberOfSubtasks} Done</span>
            </div>
    `
}

function renderMembersOfTaskArea(id) {
    return `
    <div class="assigned-outer">
        <div id="first-member-${id}" class="assigned-inner d-flex justify-content-center align-items-center"></div>
    </div>
    `
}

function renderAdditionalMembers(memberOfInitialArray, id) {
    return `
    <div class="assigned-outer position-circle">
        <div id="other-member-${id}" class="assigned-inner d-flex justify-content-center align-items-center relative">${memberOfInitialArray}</div>
    </div>
    `
}

function renderDisplay(id) {
    return `
    <div id="display-${id}" class="task-overlay d-flex d-none scroll" onclick="event.stopPropagation()"></div>
    `
}

function renderDisplayContent(id, title, description, category, date) {
    return `
            <div id="display-content-${id}" class="display-card w-100 d-flex">
                <div class="display-inner-card m-left-25 m-right-25 d-flex flex-column">
                    <!-- Close button -->
                    <div class="w-100 d-flex justify-content-end">
                    <img class="m-right-24 m-top-20 cursor" onclick="closeDialog(${id})" src="img/buttons/close.png">
                    </div>
                    <!-- Headlines -->
                    <span class="display-text display-category bg-category-${category}">${category}</span>
                    <span class="display-text display-title">${title}</span>
                    <span class="display-text display-description">${description}</span>

                    <div class="d-flex flex-column display-text">
                        <span class="f-bold m-bottom-5">Subtasks:</span>
                        <div id="subtasks-display-${id}" class="d-flex flex-column display-size scroll display-subtask">
                        </div>
                    </div>

                    <div class="d-flex display-text display-size">
                        <span class="f-bold">Due date: </span>
                        <span class="m-left-8">${date}</span>
                    </div>

                    <div class="d-flex display-text align-items-center display-size">
                        <span class="f-bold">Priority: </span>
                        <span class="m-left-8">
                            <div id="prio-display-field-${id}" class="input-with-image inputfields-small border-fields d-flex justify-content-center align-items-center disabled">
                            <p id="prio-display-name-${id}" class="f-18"></p>
                            <img id="prio-img-${id}" class="p-12" src="img/add_task/arrow_urgent_white.svg" alt="">
                        </div></span>
                    </div>

                    <div id="assigned-display-area-${id}" class="d-flex flex-column board-text"></div>


                    <!-- Edit button -->
                    <div class="w-100 d-flex justify-content-space-between">
                    <button id="delete-button" onclick="deleteMessage(${id})" class="darkblue-btn m-bottom-18 d-flex justify-content-center align-items-center ">
                    <span>Delete Task<span>
                    </button>
                    <img class="m-right-24 m-bottom-18 cursor" onclick="editTask(${id})" src="img/board/edit.svg">
                    </div>
                </div>
            </div>
    `
}


function renderMembersOfTaskAreaDisplay(id) {
    return `
            <span class="f-bold display-size">Assigned To:</span>
                        <ul id="assigned-list-${id}">
                            <li class="d-flex align-items-center">
                                <div class="assigned-outer">
                                    <div id="first-member-display-${id}" class="assigned-inner d-flex justify-content-center align-items-center display-size"></div> 
                                </div>
                                <span id="first-member-name-display-${id}" class="m-left-8"></span>
                            </li>
                            
                        </ul>
    `
}

function renderAdditionalMembersDisplay(memberOfInitialArray, id) {
    return `
                            <li  class="d-flex align-items-center">
                                <div class="assigned-outer position-circle">
                                    <div id="other-member-display-${id}"
                                        class="assigned-inner d-flex justify-content-center align-items-center display-size">
                                        ${memberOfInitialArray}
                                    </div>
                                </div>
                                    <span id="other-member-name-display-${id}" class="m-left-8"></span>
                            </li>
    `
}

function renderDragContainer(status) {
    return `
        <div id="${status}-dragcard" class="drag-card d-none card board-inner-card m-top-28 m-right-15"></div>
    `
}

function renderSubTasks(id, i, title, description, category, date, prio, displaysubtask) {
    return `
    <div>
    <input id="checkbox-${id}-${i}" type="checkbox" onclick="checkboxToggle('${id}', '${i}', '${title}', '${description}', '${category}', '${date}', '${prio}', '${displaysubtask}')">
    <label for="checkbox-${id}-${i}" id="subtask-${id}-${i}" class="m-bottom-5 m-left-8">${displaysubtask}</label>
    </div>
    `
}


function renderNewContactBtn() {
    return `
    <div id="contact-create-btn-mobile" class="d-flex justify-content-end new-contact-btn-container">
    <button id="new-contact-btn" class="darkblue-btn m-left-24"
        onclick="showOverlayContact('new-contact', 'new-contact-overlay')">
        <span class="f-18">New Contact</span>
        <img class="btn-icons-contact" src="img/buttons/newcontact.png" alt="">
    </button>
</div>
    `;
}


function renderNewSubTaskInput(subtaskInput) {
    return `
    <div class="d-flex subtask-switch-container">
       <input id="subtask-input" class="inputfield-nearby-icon" autofocus type="text" placeholder="Add new Subtask" value="${subtaskInput}">
       <img class="subtask-cancel-img" src="img/add_task/cancel.png" alt="" onclick="clearSubtaskInput()">
       <img class="subtask-check-img" src="img/add_task/check.png" alt="" onclick="addNewSubtask()">
    </div>
`
}


function clearSubtaskInput() {
    document.getElementById('subtasks-container').innerHTML = `
    <div class="output-container d-flex justify-content-space-between">
    <input id="subtask-input" class="inputfield-nearby-icon" type="text" placeholder="Add new Subtask" onfocus="changeIconsInSubtasks()">
    <img src="img/add_task/add.svg" alt="" onclick="changeIconsInSubtasks()">
    </div>
    `
}

function clearCategoryInputTemplate() {
    return `
    <input id="category-input" class="hidden-input" type="text" required>
    <div class="output-container d-flex justify-content-space-between">
        <div id="category-output" class="inputfield-nearby-icon d-flex align-items-center">
        Select task Category
        </div>
        <img id="category-dropdown-arrow" src="img/add_task/dropdown_arrow.svg" alt="">
    </div>
    `
}


function renderNewCategoryInput(input) {
    return `
    <div class="d-flex subtask-switch-container">
       <input id="category-input" class="inputfield-nearby-icon" autofocus type="text" placeholder="Add new Category" value="${input}">
       <img class="subtask-cancel-img" src="img/add_task/cancel.png" alt="" onclick="clearCategoryInput()">
       <img class="subtask-check-img" src="img/add_task/check.png" alt="" onclick="addNewCategory()">
    </div>
`
}

function renderCategoriesInHTMLTemplate(id, name, color) {
    return `
    <li id="${id}" onclick="changeValue('${id}')"
         class="d-flex align-items-center">
         <div>${name}</div>
         <div class="category-color ${color}">
    </li>
    `
}


function renderSubtask(i, inputSubtask) {
    return `
    <div class="d-flex">
        <input id="${inputSubtask}-${i}" type="checkbox" onclick="checkSubtask('${inputSubtask}')" checked>
        <p class="checkbox-text">${inputSubtask}</p>
    </div>`
}


function renderYouInAssignedTo(id){
    return `
    <li id="assignedto-${id}" onclick="addAssignedToMembers('${id}')">
        <div class="d-flex justify-content-space-between align-items-center">
        <label for="checkbox-${id}">You</label>
        <input id="checkbox-${id}" class="m-right-15 assignedTo-checkboxes" type="checkbox">
        </div>
    </li>
    `;
}

function renderAssignedToMembersTemplate(id, name) {
    return `
    <li id="assignedto-${id}" onclick="addAssignedToMembers('${id}')">
        <div class="d-flex justify-content-space-between align-items-center">
            <label for="checkbox-${id}">${name}</label>
            <input id="checkbox-${id}" class="m-right-15 assignedTo-checkboxes" type="checkbox">
        </div>
    </li> `
}

function renderInviteNewContactTemplate(){
    return `
    <li>
        <div class="d-flex justify-content-space-between align-items-center" onclick="inviteNewContact()">
             <span>Invite new contact</span>
            <img class="m-right-8" src="img/add_task/member.png" alt="">
        </div>
    </li>
    `
}

function renderInviteContact() {
    return `
    <div action="https://gruppe-306.developerakademie.net/JOIN-Kanban/send_mail/send_mail_invite.php"
        onsubmit="inviteContact(); return false;"; method="POST" class="d-flex subtask-switch-container">
       <input id="invite-contact" class="inputfield-nearby-icon" autofocus type="email" placeholder="Invite new Contact" required>
       <img class="subtask-cancel-img" src="img/add_task/cancel.png" alt="" onclick="clearAssignedToInput()">
       <button><img class="subtask-check-img" src="img/add_task/check.png" alt="" type="submit"></button>
    </div>
    `
}

function clearAssignedToInputTemplate() {
    return `
    <input id="assignedTo-input" class="hidden-input" type="text" required>
    <div class="output-container d-flex justify-content-space-between">
        <div id="user-assignedTo" class="inputfield-nearby-icon d-flex  flex-column">Select
            contacts to assign</div>
        <img src="img/add_task/dropdown_arrow.svg" alt="">
    </div>
    `
}


function renderAssignedToMemberAvatareTemplate(firstLetter, secondLetter, color){
    return `
    <div class="contact-avatar-outer d-flex align-items-center justify-content-center">
        <div
            class="contact-avatar bg-contact-${color} d-flex align-items-center justify-content-center">
            ${firstLetter}${secondLetter}
        </div>
    </div>`
}
