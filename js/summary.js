async function initSummary(){
    await loadDataFromServer()
    await init();
    renderActiveUserName();
    renderProfileImage();
}


function renderActiveUserName() {
    document.getElementById('summary-name').innerHTML = activeUser;
}