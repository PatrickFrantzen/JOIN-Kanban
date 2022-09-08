let priority;
let userInformation;
let contactColors;


function renderContactDetails(firstLetter, secondLetter, name, email, color, phone) {
    return `
    <div class="animateFadeIn d-flex flex-column" >
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
                    <div class="d-flex align-items-center justify-content-space-between m-top-50">
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







let test = [{
    "fullname": "Nadia Knofius",
    "password": "katze123",
    "mail": "nadia.knofius@gmail.com",
    "color": "blue",
    "img": "img/profil_pics/nadia.jpg",
    "contacts": [
        {
            "firstname": "Max",
            "lastname": "Mustermann",
            "fullname": "Max Mustermann",
            "mail": "max.mustermann.com",
            "phone": "+49 176 224 773 3",
            "color": "green",
        },
        {
            "firstname": "Patrick",
            "lastname": "Frantzen",
            "fullname": "Patrick Frantzen",
            "mail": "patrick.frantzen@gmail.com",
            "phone": "+49 174 345 169 8",
            "color": "brown",
        }],
},
{
    "fullname": "Patrick Frantzen",
    "password": "mara456",
    "mail": "patrick.frantzen@gmail.com",
    "color": "brown",
    "img": "img/profil_pics/patrick_pic.jpg",
    "contacts": [
        {
            "firstname": "Nadia",
            "lastname": "Knofius",
            "fullname": "Nadia Knofius",
            "mail": "nadia.knofius@gmail.com",
            "phone": "+49 176 225 223 4",
            "color": "blue",
        },
        {
            "firstname": "Patrick",
            "lastname": "Frantzen",
            "fullname": "Patrick Frantzen",
            "mail": "patrick.frantzen@gmail.com",
            "phone": "+49 174 345 169 8",
            "color": "brown",
        }]
},
{
    "fullname": "Guest Account",
    "password": "",
    "mail": "",
    "color": "",
    "img": "img/contacts/newUser.png",
    "contacts": []
    },
    {
        "fullname": "Hildegard Bunt",
        "mail": "hilde@gmail.com",
        "password": "test789",
        "color": "pink",
        "img": "img/contacts/newUser.png",
        "contacts": [
            {
                "firstname": "Nadia",
                "lastname": "Knofius",
                "fullname": "Nadia Knofius",
                "mail": "nadia.knofius@gmail.com",
                "phone": "+49 176 225 223 4",
                "color": "blue",
            },
            {
                "firstname": "Patrick",
                "lastname": "Frantzen",
                "fullname": "Patrick Frantzen",
                "mail": "patrick.frantzen@gmail.com",
                "phone": "+49 174 345 169 8",
                "color": "brown",
            },
            {
                "firstname": "Max",
                "lastname": "Mustermann",
                "fullname": "Max Mustermann",
                "mail": "max.mustermann.com",
                "phone": "+49 176 224 773 3",
                "color": "green",
            }]
        }
];