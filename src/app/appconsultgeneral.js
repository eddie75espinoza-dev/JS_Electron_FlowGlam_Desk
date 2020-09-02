const { remote, ipcRenderer } = require('electron');
const main =remote.require('./main');

let byUsers = [] 
let users = []
let dialog = remote.dialog
let options = {} // for message dialog box

//
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

// Consulta general de usuarios registrados
function renderUsers(users) {
    //Consulta general de usuarios registrados, se carga al inicio
    userList.innerHTML = '';
    users.forEach(user => {
        userList.innerHTML += `
            <div class="card card-body my-2">
                <h5>
                    ${user.User}
                </h5>
                <p>
                    ${user.Name}
                </p>
                <p>
                    <button class="btn btn-primary" onclick="addServiceUser('${user.IdClient}','${user.Name}','${user.User}')" >Add Service</button>
                    <button class="btn btn-success" onclick="getServiceUser('${user.IdClient}','${user.Name}','${user.User}')" >Schedule</button>
                    <button class="btn btn-warning" onclick="editUser('${user.IdClient}','${user.Name}','${user.User}')" >Edit User</button>
                    <button class="btn btn-secondary" onclick="deleteUser('${user.IdClient}')">Delete User</button>
                </p>
            </div>  
        `;
    })
}
 
const getUsers = async() => {
    users = await main.getUsers(); 
    console.log('Users: ', users)
    renderUsers(users);     
}
  

async function init() {
    await getUsers(); 
}
init();