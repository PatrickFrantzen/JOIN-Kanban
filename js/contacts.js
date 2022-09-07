let activeContactIndex;
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
        contactContainer.innerHTML = `<p class="text-center">This is a guest account, 
        please sign up to enjoy more benefits and to manage your contacts</p>`;
    } else {
        for (let i = 0; i < firstlettersUnique.length; i++) {
            let letter = firstlettersUnique[i];
            contactContainer.innerHTML += renderLetterContainerTemplate(letter);
        }
        renderContacts(contacts);
    }
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