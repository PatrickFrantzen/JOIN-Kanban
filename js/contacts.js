async function initContacts() {
    await loadDataFromServer()
    await init();
    renderProfileImage();
    findOutConacts();
}


function findOutConacts() {
    let contacts = userInformation[activeUserIndex].contacts;
    let firstletters = [];
    for (let i = 0; i < contacts.length; i++) {
        let firstLetter = getFirstLetterOfName(contacts, i);
        firstletters.push(firstLetter);
    }
    let firstlettersUnique = removeDoubleLetters(firstletters);
    renderLetterContainer(firstlettersUnique, contacts);
}

function getFirstLetterOfName(contacts, i) {
    let letter = contacts[i].fullname.charAt(0);
    return letter;
}

function removeDoubleLetters(firstletters) {
    let unique = [...new Set(firstletters)];
    return unique;
}

function renderLetterContainer(firstlettersUnique, contacts) {
    let contactContainer = document.getElementById('contact-content');
    contactContainer.innerHTML = '';
    if (activeUser == 'Guest Account') {
        contactContainer.innerHTML = '<p class="text-center">This is a guest account, please sign up to enjoy more benefits and to manage your contacts</p>'
    } else {
        for (let i = 0; i < firstlettersUnique.length; i++) {
            let letter = firstlettersUnique[i];
            contactContainer.innerHTML += renderLetterContainerTemplate(letter);
        }
        renderContacts(contacts);
    }
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


function renderContacts(contacts) {
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].fullname;
        let email = contacts[i].mail;
        let color = contacts[i].color;
        let firstLetter = getFirstLetterOfName(contacts, i);
        let secondLetter = splitFullname(contacts, i);
        let contactCard = document.getElementById(`contact-card-${firstLetter}`);
        contactCard.innerHTML += renderContactsTemplate(name, email, firstLetter, color, secondLetter);
    }
}


function splitFullname(contacts, i) {
    let result = contacts[i].fullname.split(/(\s+)/);
    let firstLetter = result[2].charAt(0);
    return firstLetter;
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


function showContactDetails(id) {
    for (let i = 0; i < userInformation[activeUserIndex].contacts.length; i++) {
        let contacts = userInformation[activeUserIndex].contacts;
        let contactMail = contacts[i].mail;
        if (id == contactMail) {
            getContactDetails(contacts, i);
        }
    }
}

function getContactDetails(contacts, i) {
    let firstLetter = getFirstLetterOfName(contacts, i);
    let secondLetter = splitFullname(contacts, i);
    let name = contacts[i].fullname;
    let email = contacts[i].mail;
    let color = contacts[i].color;
    let phone = contacts[i].phone;
    document.getElementById('contact-data-content').innerHTML = renderContactDetails(firstLetter, secondLetter, name, email, color, phone);
}


function renderContactDetails(firstLetter, secondLetter, name, email, color, phone) {
    return `
    <div class="contact-card-big d-flex animateFadeIn">
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
                        <div class="d-flex align-items-center edit-container" onclick="showOverlayContact('edit-contact', 'edit-contact-overlay')">
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
    `

}



function newContact(event) {
    let name = document.getElementById('newContact-name');
    let email = document.getElementById('newContact-email');
    let phone = document.getElementById('newContact-phone');
    addNewContactToArray(name, email, phone, event);

}

function addNewContactToArray(name, email, phone) {
    let contact = { fullname: name.value, mail: email.value, phone: phone.value };
    userInformation[activeUserIndex].contacts.push(contact);
    backend.setItem('userInformation', JSON.stringify(userInformation));
}


function showOverlayContact(idToShow, idToAnimate) {
    removeClassList(idToAnimate, 'animateFadeOut');
    removeClassList(idToShow, 'animateOpacityOut');
    addClassList(idToShow, 'animateOpacityIn');
    addClassList(idToAnimate, 'animateFadeIn');
    removeClassList(idToShow, 'd-none');
    setTimeout(removeClassList, 1000, idToAnimate, 'animateFadeIn');
}

function closeOverlayContact(idToHide, idToAnimate) {
    addClassList(idToHide, 'animateOpacityOut');
    addClassList(idToAnimate, 'animateFadeOut');
    setTimeout(addClassList, 1000, idToHide, 'd-none');
}

