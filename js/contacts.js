async function initContacts() {
    await init();
    // renderConacts();

}


function renderConacts() {

}

function newContact(event) {
    let name = document.getElementById('newContact-name');
    let email = document.getElementById('newContact-email');
    let phone = document.getElementById('newContact-phone');
    addNewContactToArray(name, email, phone, event);

}

function addNewContactToArray(name, email, phone, event) {
    let contact = { fullname: name.value, mail: email.value, phone: phone.value };
    userInformation[activeUserIndex].contacts.push(contact);
    console.log(userInformation);
    event.preventDefault();
    //TODO:
    //remove, as soon as data will be saved in backend
    //show msg, that contact has been created successful
}

