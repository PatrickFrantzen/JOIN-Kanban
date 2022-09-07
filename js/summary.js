async function initSummary(){
    await loadDataFromServer()
    await init();
    renderActiveUserName();
    renderProfileImage();
}


function renderActiveUserName() {
    if (activeUser == 'Guest Account'){
        document.getElementById('good-morning').innerHTML = 'Good morning';
    } else {
        document.getElementById('good-morning').innerHTML = 'Good morning,';
        document.getElementById('summary-name').innerHTML = activeUser;
    }
}