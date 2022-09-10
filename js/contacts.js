let activeContactIndex;
let animation = false;

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
    let contactContainerMobile = document.getElementById('contact-content-mobile');
    contactContainerMobile.innerHTML = `
    <div id="contact-create-btn-mobile" class="d-flex justify-content-end new-contact-btn-container">
    <button id="new-contact-btn" class="darkblue-btn m-left-24"
        onclick="showOverlayContact('new-contact', 'new-contact-overlay')">
        <span class="f-18">New Contact</span>
        <img class="btn-icons-contact" src="img/buttons/newcontact.png" alt="">
    </button>
</div>
    `;
    contactContainer.innerHTML = '';
    for (let i = 0; i < firstlettersUnique.length; i++) {
        let letter = firstlettersUnique[i];
        contactContainer.innerHTML += renderLetterContainerTemplate(letter);
        contactContainerMobile.innerHTML += renderLetterContainerMobileTemplate(letter);
    }
    renderContacts(contacts);
}


function renderContacts(contacts) {
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].fullname;
        let email = contacts[i].mail;
        let color = contacts[i].color;
        let firstLetter = getFirstLetterOfName(contacts, i);
        let secondLetter = splitFullname(contacts, i);
        let contactCard = document.getElementById(`contact-card-${firstLetter}`);
        let contactCardMobile = document.getElementById(`contact-card-mobile-${firstLetter}`);
        contactCard.innerHTML += renderContactsTemplate(name, email, firstLetter, color, secondLetter);
        contactCardMobile.innerHTML += renderContactsMobileTemplate(name, email, firstLetter, color, secondLetter);
    }
}


function splitFullname(contacts, i) {
    let result = contacts[i].fullname.split(/(\s+)/);
    let firstLetter = result[2].charAt(0);
    return firstLetter;
}


function showContactDetails(id) {
    removeBgStyleForAllContacts();
    addClassList(id, 'clickedContact');
    for (let i = 0; i < userInformation[activeUserIndex].contacts.length; i++) {
        let contacts = userInformation[activeUserIndex].contacts;
        let contactMail = contacts[i].mail;
        if (id == contactMail) {
            getContactDetails(contacts, i);
        }
    }
}


function showContactDetailsMobile(id) {
    document.getElementById('contact-content-mobile').style.display = 'none';
    showContactDetails(id);
    document.getElementById('right-section').style.display = 'flex';
}


function returnToContactOverview() {
    document.getElementById('contact-content-mobile').style.display = 'flex';
    document.getElementById('right-section').style.display = 'none';
}


function removeBgStyleForAllContacts() {
    for (let i = 0; i < userInformation[activeUserIndex].contacts.length; i++) {
        let contactId = userInformation[activeUserIndex].contacts[i].mail;
        removeClassList(contactId, 'clickedContact');
    }
}

function getContactDetails(contacts, i) {
    let animationContact = checkIfContactWasAlreadyClicked();
    let firstLetter = getFirstLetterOfName(contacts, i);
    let secondLetter = splitFullname(contacts, i);
    let name = contacts[i].fullname;
    let email = contacts[i].mail;
    let color = contacts[i].color;
    let phone = contacts[i].phone;
    document.getElementById('contact-data-content').innerHTML = renderContactDetails(firstLetter, secondLetter, name, email, color, phone, animationContact);
}

function checkIfContactWasAlreadyClicked() {
    if (animation) {
        return '';
    } else {
        animation = true;
        return 'animateFadeIn';
    }
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
    findOutConacts();
    name.value = '';
    email.value = '';
    phone.value = '';
}


function showOverlayContact(idToShow, idToAnimate, id) {
    if (idToShow == 'edit-contact') {
        showDataInEditContact(id);
    }
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


function showDataInEditContact(id) {
    for (let i = 0; i < userInformation[activeUserIndex].contacts.length; i++) {
        let contact = userInformation[activeUserIndex].contacts[i];
        if (id == contact.mail) {
            activeContactIndex = i;
            document.getElementById('editContact-name').value = contact.fullname;
            document.getElementById('editContact-email').value = contact.mail;
            document.getElementById('editContact-phone').value = contact.phone;
        }
    }
}


async function saveEditedContact() {
    closeOverlayContact('edit-contact', 'edit-contact-overlay');
    let name = document.getElementById('editContact-name').value;
    let email = document.getElementById('editContact-email').value;
    let phone = document.getElementById('editContact-phone').value;
    userInformation[activeUserIndex].contacts[activeContactIndex].fullname = name;
    userInformation[activeUserIndex].contacts[activeContactIndex].mail = email;
    userInformation[activeUserIndex].contacts[activeContactIndex].phone = phone;
    await backend.setItem('userInformation', JSON.stringify(userInformation));
    showContactDetails(email);
}