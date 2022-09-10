let priority;
let userInformation;
let contactColors;
let allTasks = [];


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

function renderSingleCard(id, title, description, category, date, prio) {
    return `
    <div id="card-${id}" onclick="openDialog('${id}', '${title}', '${description}', '${category}', '${date}', '${prio}')" class="card board-inner-card d-flex flex-column m-top-28 m-right-15">
    <span class="board-text board-category bg-category-marketing">${category}</span>
    <span class="board-text board-title">${title}</span>
    <span class="board-text board-description">${description}</span>

    <div id="progressbar-${id}" class="progressbar-outer board-text d-flex align-items-center text-align-center">
        <div class="progressbar-inner" role="progressbar"></div>
        <div class="subtasks d-flex text-align-center">
            <span class="f-12">0/2 Done</span>
        </div>
    </div>

    <div id="assigned-${id}" class="board-text board-assigned d-flex justify-content-space-between align-items-center">
        
        <div class="board-assigned-urgent"><img id="prio-${id}" src="img/add_task/arrow_low.svg"> </div>
    </div>
</div>
`
}

function renderMembersOfTaskArea(id) {
    return `
    <div id="assigned-area-${id}" class="d-flex">
    <div class="assigned-outer">
        <div id="first-member-${id}" class="assigned-inner d-flex justify-content-center align-items-center"></div>
    </div>
    
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
    <div id="display-${id}" class="task-overlay d-flex"></div>
    `
}

function renderDisplayConent(id, title, description, category, date, prio) {
    return `
            <div id="display-content-${id}" class="display-card h-100 w-100 d-flex justify-content-center">
                <div class="board-inner-card w-100 h-100 m-left-50 d-flex flex-column">
                    <!-- Close button -->
                    <div class="w-100 d-flex justify-content-end">
                    <img class="m-right-24 m-top-20 close-img" onclick="closeDialog()" src="img/buttons/close.png">
                    </div>
                    <!-- Headlines -->
                    <span class="board-text board-category bg-category-marketing">${category}</span>
                    <span class="board-text board-title">${title}</span>
                    <span class="board-text board-description">${description}</span>
                    <div class="d-flex board-text">
                        <span class="f-bold">Due date: </span>
                        <span class="m-left-8">${date}</span>
                    </div>

                    <div class="d-flex board-text justify-content-center align-items-center">
                        <span class="f-bold">Priority: </span>
                        <span class="m-left-8">
                            <div id="urgent" class="input-with-image inputfields-small border-fields d-flex justify-content-center align-items-center bg-urgent">
                            <p class="f-18">Urgent</p>
                            <img id="urgent-img" class="p-12" src="img/add_task/arrow_urgent_white.svg" alt="">
                        </div></span>
                    </div>

                    <div class="d-flex flex-column board-text">
                        <span class="f-bold">Assigned To:</span>
                        <ul>
                            <li class="d-flex  align-items-center">
                                <div class="assigned-outer">
                                    <div class="assigned-inner bg-contact-blue d-flex justify-content-center align-items-center">
                                        NK
                                    </div>
                                </div>
                                <span class="m-left-8">Nadia Knofius</span>
                            </li>
                            <li  class="d-flex  align-items-center">
                                <div class="assigned-outer position-circle">
                                    <div
                                        class="assigned-inner bg-contact-green d-flex justify-content-center align-items-center">
                                        PF
                                    </div>
                                </div>
                                    <span class="m-left-8">Patrick Frantzen</span>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
    `
}

/**/


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

