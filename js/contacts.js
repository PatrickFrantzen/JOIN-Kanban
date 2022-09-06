async function initContacts() {
    await loadDataFromServer()
    await init();
    renderProfileImage();
}


function renderConacts() {

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

