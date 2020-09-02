const { remote, ipcRenderer } = require('electron');
const main =remote.require('./main');

const userForm = document.getElementById('userForm');

// User Form
const name = document.getElementById('name');
const userName = document.getElementById('user_Name');


let editing = false;
let id = '';

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (userName.value === '' && name.value === ''){
        message.innerHTML = `User and Name are required`;
        userForm.focus();
    } else {
        const newUser = {
            user: (userName.value).toLowerCase(),
            name: (name.value).toLowerCase()     
        }
        if (!editing){
            await main.createUser(newUser)
        } else {
            const userEdit = (userName.value).toLowerCase();
            const nameEdit = (name.value).toLowerCase();
            await main.editUser(userEdit, nameEdit, id);
            editing = false;
        }
    
        userForm.reset();
        userForm.focus();
    };   
});

function renderUser(userUp) {
    user_Name.value = `${userUp.user}`;
    name.value = `${userUp.name}`;   
}

ipcRenderer.on('user:update', function(event, userUp) {     
    renderUser(userUp);   
    console.log(userUp);
    editing = userUp.editing;
    id = userUp.id;       
});