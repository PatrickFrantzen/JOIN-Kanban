let priority;
let userInformation;
let contactColors;
let allTasks = [];
let taskAmount = {
    "toDo": 0,
    "progress": 0,
    "feedback": 0,
    "done": 0,
    "total": 0,
    "urgent": 0,
    "urgentDate": []
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
                            <div class="add-task d-flex curserPointer">
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

function renderSingleCard(id, title, description, category) {
    return `
    <div id="card-${id}" draggable="true" ondragstart="startDragging(${id})" onclick="openDialog(${id})" class="card board-inner-card d-flex flex-column m-top-28 m-right-24">
    <span class="board-text board-category bg-category-${category}">${category}</span>
    <span class="board-text board-title">${title}</span>
    <span class="board-text board-description">${description}</span>

    <div id="progressbar-${id}" class="progressbar-outer board-text d-flex align-items-center text-align-center">
        
    </div>

    <div id="assigned-${id}" class="board-text board-assigned d-flex justify-content-space-between align-items-center">
        <div id="assigned-area-${id}" class="d-flex"></div>
        <div class="board-assigned-urgent"><img id="prio-${id}" src=""> </div>
    </div>
</div>
`
}

function renderProgressbarArea(numberOfSubtasks, numberOfFinishedSubtasks) {
    return `
        <div class="progressbar-inner" role="progressbar"></div>
            <div class="subtasks d-flex text-align-center">
                <span class="f-12">${numberOfFinishedSubtasks}/${numberOfSubtasks} Done</span>
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
    <div id="display-${id}" class="task-overlay d-flex d-none"></div>
    `
}

function renderDisplayContent(id, title, description, category, date) {
    return `
            <div id="display-content-${id}" class="display-card h-100 w-100 d-flex justify-content-center d-none">
                <div class="board-inner-card w-100 h-100 m-left-25 m-right-25 d-flex flex-column">
                    <!-- Close button -->
                    <div class="w-100 d-flex justify-content-end">
                    <img class="m-right-24 m-top-20 close-img" onclick="closeDialog(${id})" src="img/buttons/close.png">
                    </div>
                    <!-- Headlines -->
                    <span class="board-text board-category bg-category-${category}">${category}</span>
                    <span class="board-text board-title">${title}</span>
                    <span class="board-text">${description}</span>

                    <div class="d-flex flex-column board-text">
                        <span class="f-bold m-bottom-5">Subtasks:</span>
                        <div id="subtasks-display-${id}" class="d-flex flex-column">
                        </div>
                    </div>

                    <div class="d-flex board-text">
                        <span class="f-bold">Due date: </span>
                        <span class="m-left-8">${date}</span>
                    </div>

                    <div class="d-flex board-text justify-content-center align-items-center">
                        <span class="f-bold">Priority: </span>
                        <span class="m-left-8">
                            <div id="prio-display-field-${id}" class="input-with-image inputfields-small border-fields d-flex justify-content-center align-items-center">
                            <p id="prio-display-name-${id}" class="f-18"></p>
                            <img id="prio-img-${id}" class="p-12" src="img/add_task/arrow_urgent_white.svg" alt="">
                        </div></span>
                    </div>

                    <div id="assigned-display-area-${id}" class="d-flex flex-column board-text"></div>
                    
                </div>
            </div>
    `
}

function renderMembersOfTaskAreaDisplay(id) {
    return `
            <span class="f-bold">Assigned To:</span>
                        <ul id="assigned-list-${id}">
                            <li class="d-flex  align-items-center">
                                <div class="assigned-outer">
                                    <div id="first-member-display-${id}" class="assigned-inner d-flex justify-content-center align-items-center"></div> 
                                </div>
                                <span id="first-member-name-display-${id}" class="m-left-8"></span>
                            </li>
                            
                        </ul>
    `
}

function renderAdditionalMembersDisplay(memberOfInitialArray, id) {
    return `
                            <li  class="d-flex  align-items-center">
                                <div class="assigned-outer position-circle">
                                    <div id="other-member-display-${id}"
                                        class="assigned-inner d-flex justify-content-center align-items-center">
                                        ${memberOfInitialArray}
                                    </div>
                                </div>
                                    <span id="other-member-name-display-${id}" class="m-left-8"></span>
                            </li>
    `
}

function renderEmtptyContainer() {
    return `
        <div class="drag-card card board-inner-card m-top-28 m-right-15"></div>
    `
}

function renderSubTasks(subtask, i, id) {
    return `
    <div>
    <input id="checkbox-${id}-${i}" type="checkbox" onclick="checkboxToggle('${id}', '${i}', '${subtask}')">
    <label for="checkbox-${id}-${i}" id="subtask-${id}-${i}" class="m-bottom-5 m-left-8">${subtask}</label>
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



let test = [{
    "fullname": "Nadia Knofius",
    "password": "katze123",
    "mail": "nadia.knofius@gmail.com",
    "color": "violet",
    "img": "img/profil_pics/nadia.jpg",
    "contacts": [
        {
            "fullname": "Max Mustermann",
            "mail": "max.mustermann.com",
            "phone": "+49 176 224 773 3",
            "color": "green",
        },
        {
            "fullname": "Patrick Frantzen",
            "mail": "patrick.frantzen@gmail.com",
            "phone": "+49 174 345 169 8",
            "color": "brown",
        },
        {
            "fullname": "Hildegard Bunt",
            "mail": "hilde@gmail.com",
            "phone": "+49 171 6113 79056",
            "color": "pink",
        }
    ],
},
{
    "fullname": "Patrick Frantzen",
    "password": "mara456",
    "mail": "patrick.frantzen@gmail.com",
    "color": "brown",
    "img": "img/profil_pics/patrick_pic.jpg",
    "contacts": [
        {
            "fullname": "Nadia Knofius",
            "mail": "nadia.knofius@gmail.com",
            "phone": "+49 176 225 223 4",
            "color": "violet",
        },
        {
            "fullname": "Max Mustermann",
            "mail": "max.mustermann.com",
            "phone": "+49 176 224 773 3",
            "color": "green",
        },
        {
            "fullname": "Hildegard Bunt",
            "mail": "hilde@gmail.com",
            "phone": "+49 171 6113 79056",
            "color": "pink",
        }
    ]
},
{
    "fullname": "Guest Account",
    "password": "",
    "mail": "",
    "color": "grey",
    "img": "img/contacts/newUser.png",
    "contacts": [
        {
            "fullname": "Nadia Knofius",
            "mail": "nadia.knofius@gmail.com",
            "phone": "+49 176 225 223 4",
            "color": "violet",
        },
        {
            "fullname": "Patrick Frantzen",
            "mail": "patrick.frantzen@gmail.com",
            "phone": "+49 174 345 169 8",
            "color": "brown",
        },
        {
            "fullname": "Hildegard Bunt",
            "mail": "hilde@gmail.com",
            "phone": "+49 171 6113 79056",
            "color": "pink",
        }
    ]
    },
    {
        "fullname": "Hildegard Bunt",
        "mail": "hilde@gmail.com",
        "password": "test789",
        "color": "pink",
        "img": "img/contacts/newUser.png",
        "contacts": [
            {
                "fullname": "Nadia Knofius",
                "mail": "nadia.knofius@gmail.com",
                "phone": "+49 176 225 223 4",
                "color": "violet",
            },
            {
                "fullname": "Patrick Frantzen",
                "mail": "patrick.frantzen@gmail.com",
                "phone": "+49 174 345 169 8",
                "color": "brown",
            },
            {
                "fullname": "Max Mustermann",
                "mail": "max.mustermann.com",
                "phone": "+49 176 224 773 3",
                "color": "green",
            }]
        }
];

