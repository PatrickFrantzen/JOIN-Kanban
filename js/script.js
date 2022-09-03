function toggleClassList(id, classList) {
    document.getElementById(id).classList.toggle(classList);
}


function changeValue(value, id) {
    document.getElementById(id).innerHTML = value;
}


function changePriority(id, classList) {
    let imgName = `${id}-img`;
    let imgPath = document.getElementById(imgName);
    toggleClassList(id, classList);
    for (let i = 0; i < priority.length; i++) {
        let prio = priority[i].level;
        if (prio == id) {
            changePriorityIcons(imgPath, i);
        }
    }
    avoidAnotherBtnCanBeClicked();
}


function changePriorityIcons(imgPath, i) {
    switch (true) {
        case priority[i].toggle: {
            priority[i].toggle = false;
            imgPath.src = priority[i]["img-normal"];
            break;
        }
        default: {
            priority[i].toggle = true;
            imgPath.src = priority[i]["img-choosed"];
            break;
        }
    }
}


function avoidAnotherBtnCanBeClicked() {
    let counter = 0;
    for (let i = 0; i < priority.length; i++) {
        let btnIsClicked = priority[i].toggle;
        if (btnIsClicked) {
            disableOtherBtns(i);
        } else {
            counter++;
        }
    }
    activateOtherBtns(counter);
}


function disableOtherBtns(i) {
    switch (i) {
        case 0: {
            deactivateBtns('medium', 'low');
            break;
        }
        case 1: {
            deactivateBtns('urgent', 'low');
            break;
        }
        case 2: {
            deactivateBtns('medium', 'urgent');
            break;
        }
    }
}


function deactivateBtns(id1, id2) {
    document.getElementById(id1).disabled = true;
    document.getElementById(id2).disabled = true;
}


function activateOtherBtns(counter) {
    if (counter == 3) {
        document.getElementById('urgent').disabled = false;
        document.getElementById('medium').disabled = false;
        document.getElementById('low').disabled = false;
    }
}
