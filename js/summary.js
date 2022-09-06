async function initSummary(){
    await init();
    renderActiveUserName();
}


function renderActiveUserName() {
    document.getElementById('summary-name').innerHTML = activeUser;
}