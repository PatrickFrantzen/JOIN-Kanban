let priority;
let userInformation;
let contactColors;
let allTasks = [];


function renderContactDetails(firstLetter, secondLetter, name, email, color, phone, animationContact) {
    return `
    <div id="contact-detail-data-container" class="${animationContact} d-flex flex-column" >
            <div class="contact-card-big d-flex ">
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
                    <div class="d-flex align-items-center justify-content-space-between m-top-50 contact-information-headline">
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
            href="mailto:${email}">${email}</a>
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

function renderSingleCard(i, title, description, category, date, prio) {
    return `
    <div id="card-${i}" onclick="openDialog()" class="card board-inner-card d-flex flex-column m-top-28 m-right-15">
    <span class="board-text board-category bg-category-marketing">${category}</span>
    <span class="board-text board-title">${title}</span>
    <span class="board-text board-description">${description}</span>

    <div id="progressbar-${i}" class="progressbar-outer board-text d-flex align-items-center text-align-center">
        <div class="progressbar-inner" role="progressbar"></div>
        <div class="subtasks d-flex text-align-center">
            <span class="f-12">0/2 Done</span>
        </div>
    </div>

    <div id="assigned-${i}" class="board-text board-assigned d-flex justify-content-space-between align-items-center">
        <div class="d-flex">
            <div class="assigned-outer">
                <div class="assigned-inner bg-contact-blue d-flex justify-content-center align-items-center">
                    NK
                </div>
            </div>
            <div class="assigned-outer position-circle">
                <div class="assigned-inner bg-contact-green d-flex justify-content-center align-items-center relative">
                    PF
                </div>
            </div>
        </div>
        <div class="board-assigned-urgent"><img id="prio-${i}" src="img/add_task/arrow_low.svg"> </div>
    </div>
</div>
`
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

