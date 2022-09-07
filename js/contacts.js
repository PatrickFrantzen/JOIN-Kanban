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

function removeDoubleLetters(firstletters){
    let unique = [...new Set(firstletters)];
    return unique;
}

function renderLetterContainer(firstlettersUnique, contacts){
    let contactContainer = document.getElementById('contact-content');
    contactContainer.innerHTML = '';
    for (let i = 0; i < firstlettersUnique.length; i++) {
        let letter = firstlettersUnique[i];
        contactContainer.innerHTML += renderLetterContainerTemplate(letter);
    }
    renderContacts(contacts);
}


function renderLetterContainerTemplate(letter){
    return `
    <div id="contact-letter-${letter}" class="contact-letter w-80 d-flex align-items-start flex-column">
    <span>${letter}</span>
    <div id="contact-card-${letter}" class="contact-card-small-container">
    </div>
     </div>
    `;
}


function renderContacts(contacts){
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].fullname;
        let email = contacts[i].mail;
        let color = contacts[i].color;
        let firstLetter = getFirstLetterOfName(contacts, i);
        let contactCard = document.getElementById(`contact-card-${firstLetter}`);
        contactCard.innerHTML += renderContactsTemplate(name, email, firstLetter, color);
    }
}


function renderContactsTemplate(name, email, firstLetter, color){
    return `
    <div id="${email}" class="contact-card-small d-flex">
    <div
        class="contact-avatar-outer d-flex align-items-center justify-content-center">
        <div
            class="contact-avatar bg-contact-${color} d-flex align-items-center justify-content-center">
            ${firstLetter}
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


function showOverlayContact(idToShow,idToAnimate) {
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

