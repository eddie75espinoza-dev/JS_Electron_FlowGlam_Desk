const {remote} = require('electron');

const main =remote.require('./main');

// Button Create userWindow
function callNewUserWindow(event) {
    event.target.addEventListener('click', main.newUserWindow());
}
document.getElementById('btnCrUs').addEventListener('click', callNewUserWindow);

// Button call index.html
function callConsultByNameWindow(event) {
    event.target.addEventListener('click', main.consultByNameWindow());
}
document.getElementById('btnCoNa').addEventListener('click', callConsultByNameWindow);

// Button General consult index.html
function callGeneralUserWindow(event) {
    event.target.addEventListener('click', main.generalUserWindow());
}
document.getElementById('btnCoGr').addEventListener('click', callGeneralUserWindow);

