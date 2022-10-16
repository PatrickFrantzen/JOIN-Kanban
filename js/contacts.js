let activeContactIndex;
let animation = false;

async function initContacts() {
    await loadDataFromServer()
    await init();
    await includeHTML('include-addtask-html');
    renderProfileImage();
    findOutConacts();
    renderCategoriesInHTML();
    renderAssignableMembersInHTML();
}


// contact list overview
//TODO
function findOutConacts() {
    let allContacts = contacts;
    for (let i = 0; i < userInformation.length; i++) {
        let user = userInformation[i];
        if(user.fullname !== "Guest Account"){
            allContacts.push(user);
        }
    }
    createLetterContainer();
  
}


function createLetterContainer(){
      let firstletters = [];
    // for (let i = 0; i < contacts.length; i++) {
    //     let firstLetter = getFirstLetterOfName(contacts, i);
    //     firstletters.push(firstLetter);
    // }
    // let firstlettersUnique = removeDoubleLetters(firstletters);
    // renderLetterContainer(firstlettersUnique, contacts);
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


function clearContactContainer (){
    let contactContainer = document.getElementById('contact-content');
    contactContainer.innerHTML = '';
    return contactContainer;
}


function clearContactContainerMobile (){
    let contactContainerMobile = document.getElementById('contact-content-mobile');
    contactContainerMobile.innerHTML = renderNewContactBtn();
    return contactContainerMobile;
}


//TODO
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
//TODO
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


//TODO
function getContactDetails(contacts, i) {
    let animationContact = checkIfContactWasAlreadyClicked();
    let firstLetter = getFirstLetterOfName(contacts, i);
    let secondLetter = splitFullname(contacts, i);
    let name = contacts[i].fullname;
    let email = contacts[i].mail;
    let color = contacts[i].color;
    let phone = contacts[i].phone;
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


//TODO
function removeBgStyleForAllContacts() {
    for (let i = 0; i < userInformation[activeUserIndex].contacts.length; i++) {
        let contactId = userInformation[activeUserIndex].contacts[i].mail;
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
function newContact() {
    let name = document.getElementById('newContact-name');
    let email = document.getElementById('newContact-email');
    let phone = document.getElementById('newContact-phone');
    addNewContactToArray(name, email, phone);
}


//TODO
async function addNewContactToArray(name, email, phone) {
    let contact = { fullname: name.value, mail: email.value, phone: phone.value };
    userInformation[activeUserIndex].contacts.push(contact);
    await backend.setItem('userInformation', JSON.stringify(userInformation));
    findOutConacts();
    clearNewContactInputfields(name, email, phone);
}


function clearNewContactInputfields(name, email, phone) {
    name.value = '';
    email.value = '';
    phone.value = '';
}


//edit contact


//TODO
/**
 * sets data of choosed contact in inputfields in edit contact overlay
 * 
 * @param {string} id 
 */
function getDataToEditContact(id) {
    for (let i = 0; i < userInformation[activeUserIndex].contacts.length; i++) {
        let contact = userInformation[activeUserIndex].contacts[i];
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
    await backend.setItem('userInformation', JSON.stringify(userInformation));
    showContactDetails(email);
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


//TODO
/**
 * saves edited contact data in array userInformation
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 */
function saveEditedContactDataInArray(name, email, phone) {
    userInformation[activeUserIndex].contacts[activeContactIndex].fullname = name;
    userInformation[activeUserIndex].contacts[activeContactIndex].mail = email;
    userInformation[activeUserIndex].contacts[activeContactIndex].phone = phone;
}

function inviteContact() {
    console.log('Success');
}