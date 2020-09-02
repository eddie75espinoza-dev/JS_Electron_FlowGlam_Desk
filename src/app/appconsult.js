const { remote, ipcRenderer } = require('electron');
const main =remote.require('./main');

const consultForm = document.getElementById('consultForm');

// Consult Form
const byUserName = document.getElementById('byUserName');
const byName = document.getElementById('byName');

let byUsers = []
let dialog = remote.dialog
let options = {} // for message dialog box

// Add service
async function addServiceUser(idUser, nam, userNam){
    await main.addServiceWindow();
    const serAdd = {
        id: idUser,
        name: nam,
        user: userNam                
    }
    await ipcRenderer.send('user:add', serAdd);
} 
    
// schedule by user
async function getServiceUser(idUser, nam, userNam){
    await main.getServiceByUserWindow();
    const serAdd = {
        id: idUser,
        name: nam,
        user: userNam                
    }
    await ipcRenderer.send('user:get', serAdd);    
}

// Edit user
async function editUser(idUser, nam, userNam){
    await main.newUserWindow();
    const userUp = {
        id: idUser,
        name: nam,
        user: userNam,
        editing: true                
    }
    await ipcRenderer.send('user:update', userUp);
} 

// Delete user
async function deleteUser(idUser) {
    options.type = "warning"
    options.title = 'Flow Glam  /  Delete User'
    options.buttons = ['&Yes', '&No']
    options.message = "Are you sure want to delete user?"
    options.normalizeAccessKeys = true
    let res = dialog.showMessageBoxSync(options);    
    if (res ===0) {
        await main.deleteUser(idUser);
    } 
}

// form submit
consultForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (byUserName.value === '' && byName.value === ''){
        userSearch.innerHTML = `User or Name are required`;
    } else {
        const byUser = {
            user: (byUserName.value).toLowerCase(),
            name: (byName.value).toLowerCase()     
        }      
        byUsers = await main.getByUser(byUser);      
        if (byUsers.length === 0) {
            userSearch.innerHTML = `User not found`;        
        } else {            
            renderConsByUser(byUsers);
        };
    };
    consultForm.reset();
    consultForm.focus();
});

// Consulta individual de usuarios registrados
function renderConsByUser(byUsers) {
    // Consulta individual de usuarios registrados    
    userSearch.innerHTML = '';
    byUsers.forEach(byUser => {
        userSearch.innerHTML += `
            <div class="card card-body my-2">
                <h5>
                    ${byUser.User}
                </h5>
                <p>
                    ${byUser.Name}
                </p>
                <p>
                    <button class="btn btn-primary" onclick="addServiceUser('${byUser.IdClient}','${byUser.Name}','${byUser.User}')" >Add Service</button>
                    <button class="btn btn-success" onclick="getServiceUser('${byUser.IdClient}','${byUser.Name}','${byUser.User}')" >Schedule</button>
                    <button class="btn btn-warning" onclick="editUser('${byUser.IdClient}','${byUser.Name}','${byUser.User}')" >Edit User</button>
                    <button class="btn btn-secondary" onclick="deleteUser('${byUser.IdClient}')">Delete User</button>
                </p>
            </div>
        `;               
    })    
}

