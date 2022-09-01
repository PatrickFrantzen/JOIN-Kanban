

function toggleClassList(id, classList) {
    document.getElementById(id).classList.toggle(classList);
}

function changeValue(value, id) {
    document.getElementById(id).innerHTML = value;
}


// TODO: disable other buttons
function changePriority(id, classList) {
    let imgName = `${id}-img`;
    let imgPath = document.getElementById(imgName);
    toggleClassList(id, classList);
    for (let i = 0; i < priority.length; i++) {
        let prio = priority[i].level;
        if(prio == id){
            changePriorityIcons(imgPath, i);
        }
    }
}

function changePriorityIcons(imgPath, i){
    switch (true){
        case priority[i].toggle:{
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
