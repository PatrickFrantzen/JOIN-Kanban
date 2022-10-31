let activeContactIndex;
let animation = false;
let allContacts;

async function initContacts() {
    await loadDataFromServer()
    await init();
    await includeHTML('include-addtask-html');
    renderProfileImage();
    findOutConacts();
    createLetterContainer();
    renderCategoriesInHTML();
    renderAssignableMembersInHTML();
}


/**
 * fills a new array with contacts information of already
 * existing user and new created user
 */
function findOutConacts() {
    allContacts = Object.assign([], contacts);
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if (user.fullname !== "Guest Account") {
            allContacts.push(user);
        }
    }
}


function createLetterContainer() {
    let firstletters = [];
    for (let i = 0; i < allContacts.length; i++) {
        let firstLetter = getFirstLetterOfName(allContacts, i);
        firstletters.push(firstLetter);
    }
    let firstlettersUnique = removeDoubleLetters(firstletters);
    firstlettersUnique = sortLetters(firstlettersUnique);
    renderLetterContainer(firstlettersUnique, allContacts);
}


function sortLetters(firstlettersUnique) {
    return firstlettersUnique.sort();
}


function removeDoubleLetters(firstletters) {
    let unique = [...new Set(firstletters)];
    return unique;
}


function renderLetterContainer(firstlettersUnique, contacts) {
    let contactContainer = clearContactContainer();
    let contactContainerMobile = clearContactContainerMobile();
    for (let i = 0; i < firstlettersUnique.length; i++) {
        let letter = firstlettersUnique[i];
        contactContainer.innerHTML += renderLetterContainerTemplate(letter);
        contactContainerMobile.innerHTML += renderLetterContainerMobileTemplate(letter);
    }
    getInformationToRenderContacts(contacts);
}


function clearContactContainer() {
    let contactContainer = document.getElementById('contact-content');
    contactContainer.innerHTML = '';
    return contactContainer;
}


function clearContactContainerMobile() {
    let contactContainerMobile = document.getElementById('contact-content-mobile');
    contactContainerMobile.innerHTML = '';
    contactContainerMobile.innerHTML = renderNewContactBtn();
    return contactContainerMobile;
}


function getInformationToRenderContacts(contacts) {
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].fullname;
        let email = contacts[i].mail;
        let color = contacts[i].color;
        let firstLetter = getFirstLetterOfName(contacts, i);
        let secondLetter = splitFullname(contacts, i);
        renderContacts(name, email, firstLetter, secondLetter, color);
    }
}


function renderContacts(name, email, firstLetter, secondLetter, color) {
    let contactCard = document.getElementById(`contact-card-${firstLetter}`);
    let contactCardMobile = document.getElementById(`contact-card-mobile-${firstLetter}`);
    contactCard.innerHTML += renderContactsTemplate(name, email, firstLetter, color, secondLetter);
    contactCardMobile.innerHTML += renderContactsMobileTemplate(name, email, firstLetter, color, secondLetter);
}


//contact detail overview
function showContactDetails(id) {
    removeBgStyleForAllContacts();
    addClassList(id, 'clickedContact');
    for (let i = 0; i < allContacts.length; i++) {
        let contactMail = allContacts[i].mail;
        if (id == contactMail) {
            getContactDetails(i);
        }
    }
}


function getContactDetails(i) {
    let animationContact = checkIfContactWasAlreadyClicked();
    let firstLetter = getFirstLetterOfName(allContacts, i);
    let secondLetter = splitFullname(allContacts, i);
    let name = allContacts[i].fullname;
    let email = allContacts[i].mail;
    let color = allContacts[i].color;
    let phone = allContacts[i].phone;
    document.getElementById('contact-data-content').innerHTML = renderContactDetails(firstLetter, secondLetter, name, email, color, phone, animationContact);
    document.getElementById('mobile-contact-btn-container').innerHTML = renderContactMobileBtnTemplate(email);
}


function showContactDetailsMobile(id) {
    document.getElementById('contact-content-mobile').style.display = 'none';
    showContactDetails(id);
    document.getElementById('right-section').style.display = 'flex';
    addClassList('new-contact-btn-mobile', 'd-none');
}


function returnToContactOverview() {
    document.getElementById('contact-content-mobile').style.display = 'flex';
    document.getElementById('right-section').style.display = 'none';
}


function splitFullname(contacts, i) {
    let result = contacts[i].fullname.split(/(\s+)/);
    let firstLetter = result[2].charAt(0);
    return firstLetter;
}


function getFirstLetterOfName(contacts, i) {
    let letter = contacts[i].fullname.charAt(0);
    return letter;
}


function checkIfContactWasAlreadyClicked() {
    if (animation) {
        return '';
    } else {
        animation = true;
        return 'animateFadeIn';
    }
}


function removeBgStyleForAllContacts() {
    for (let i = 0; i < allContacts.length; i++) {
        let contactId = allContacts[i].mail;
        removeClassList(contactId, 'clickedContact');
    }
}


//for new and edit contact overlays
function showOverlayContact(idToShow, idToAnimate, id) {
    if (idToShow == 'edit-contact') {
        getDataToEditContact(id);
    }
    setAnimationClassLists(idToShow, idToAnimate);
}


function closeOverlayContact(idToHide, idToAnimate) {
    addClassList(idToHide, 'animateOpacityOut');
    addClassList(idToAnimate, 'animateFadeOut');
    setTimeout(addClassList, 1000, idToHide, 'd-none');
}


function setAnimationClassLists(idToShow, idToAnimate) {
    removeClassList(idToAnimate, 'animateFadeOut');
    removeClassList(idToShow, 'animateOpacityOut');
    addClassList(idToShow, 'animateOpacityIn');
    addClassList(idToAnimate, 'animateFadeIn');
    removeClassList(idToShow, 'd-none');
    setTimeout(removeClassList, 1000, idToAnimate, 'animateFadeIn');
}


// new contact
async function newContact() {
    let name = document.getElementById('newContact-name');
    let email = document.getElementById('newContact-email');
    let phone = document.getElementById('newContact-phone');
    let color = await getNextFreeColor();
    addNewContactToArray(name, email, phone, color);
}


async function addNewContactToArray(name, email, phone, color) {
    let contact = { fullname: name.value, mail: email.value, phone: phone.value, color: color };
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
    allContacts;
    findOutConacts();
    clearNewContactInputfields(name, email, phone);
    createNewContactResponse('new contact successfully created');
}


function createNewContactResponse(text) {
    userResonse(text, 'contact-user-response-overlay', 'contact-user-response-overlay-text');
}


function clearNewContactInputfields(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
}


//edit contact


/**
 * sets data of choosed contact in inputfields in edit contact overlay
 * 
 * @param {string} id 
 */
function getDataToEditContact(id) {
    for (let i = 0; i < allContacts.length; i++) {
        let contact = allContacts[i];
        if (id == contact.mail) {
            activeContactIndex = i;
            showDataInEditContact(contact);
        }
    }
}


/**
 * calls function to read and to save edited contact information
 * sends changed array to server
 */
async function saveEditedContact() {
    closeOverlayContact('edit-contact', 'edit-contact-overlay');
    let email = readEditedContactData();
    await backend.setItem('contacts', JSON.stringify(contacts));
    await initContacts();
    showContactDetails(email);
    createNewContactResponse('contact successfully edited');
}


/**
 * reads data of inputfields in edit contact overlay
 * @returns contact email (also id in html to show contact details)
 */
function readEditedContactData() {
    let name = document.getElementById('editContact-name').value;
    let email = document.getElementById('editContact-email').value;
    let phone = document.getElementById('editContact-phone').value;
    saveEditedContactDataInArray(name, email, phone);
    return email;
}


/**
 * shows data of current contact, which should be change, in inputfields
 * in edit contact overlay
 * @param {object} contact 
 */
function showDataInEditContact(contact) {
    document.getElementById('editContact-name').value = contact.fullname;
    document.getElementById('editContact-email').value = contact.mail;
    document.getElementById('editContact-phone').value = contact.phone;
}


/**
 * saves edited contact data in array userInformation
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 */
function saveEditedContactDataInArray(name, email, phone) {
    allContacts[activeContactIndex].fullname = name;
    allContacts[activeContactIndex].mail = email;
    allContacts[activeContactIndex].phone = phone;
}

function inviteContact() {
    console.log('Success');
}