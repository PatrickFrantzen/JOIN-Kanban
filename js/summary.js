window.addEventListener('DOMContentLoaded', (event) => {
    renderActiveUserName();
});

//TODO: find right order of loading, activeUser = undefined
function renderActiveUserName() {
    document.getElementById('summary-name').innerHTML = activeUser;
}