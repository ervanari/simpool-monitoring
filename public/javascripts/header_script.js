// const axios = require('axios');
// var socket = io('http://116.0.1.66:3017')
// socket.on('connect', function() {
//     console.info('Socket connect');
// });

const copyText = ( value ) => {
    navigator.clipboard.writeText(value);
}

const modalShow = ( modalId ,url=null ) => {
    const element = document.getElementById(modalId)
    if(url !== null){
        element.querySelector(".modal-dialog > .modal-content > .modal-footer > a").setAttribute("href", url)
    }
    const modals = new bootstrap.Modal(element, {});
    modals.show();
}

const changeRestart = (status, id, key) => {
    const id_device = document.getElementById("_idrestart")
    const status_dev = document.getElementById("status_restart")
    let typeText = document.getElementById("typeRamdom")

    id_device.value = id
    status_dev.value = status
    typeText.innerHTML = key

}

const renew_pulsa = (dial) => {
    const ussd = document.getElementById("dataUSSD")

    ussd.innerHTML = dial
}
