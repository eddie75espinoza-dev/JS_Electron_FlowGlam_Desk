const {app, BrowserWindow, Menu, Notification, ipcMain, dialog, accelerator} = require('electron')
const {getConnection} = require('./database')
const path = require('path');

let options = {} // for message dialog box

// Create User
async function createUser(user) {
    try {
        const conn = await getConnection();
        const result = await conn.query("INSERT INTO client SET ?", user)
        new Notification({
            title: 'Flow Glam',
            subtitle: 'Create User',
            body: 'User saved successfully',
            icon: path.join(__dirname, './img/logoFlow.png')
        }).show();
        user.id = result.insertId;
        newUserWin.close();
        return user;
    } catch (error) {
        console.log(error.code)
        if (error.code === 'ER_DUP_ENTRY'){
            options.type = "info"
            options.title = 'Flow Glam  /  User'
            options.buttons = ['&Ok']
            options.message = "User exist"
            options.normalizeAccessKeys = true
            dialog.showMessageBoxSync(options);
            newUserWin.close()
        }
    }
}

// Edit user
async function editUser(user, name, id) {
    try {
        const conn = await getConnection();

        const result = await conn.query("UPDATE client SET User = ?, Name = ? WHERE IdClient = ?", [user, name, id]);
        new Notification({
            title: 'Flow Glam',
            subtitle: 'Edit User',
            body: 'User edited successfully',
            icon: path.join(__dirname, './img/logoFlow.png')
        }).show();
        newUserWin.close();
        byNameWin.close();
    } catch (error) {
        console.log(error.code)
        if (error.code === 'ER_DUP_ENTRY'){
            options.type = "info"
            options.title = 'Flow Glam  /  User'
            options.buttons = ['&Ok']
            options.message = "User exist"
            options.normalizeAccessKeys = true
            dialog.showMessageBoxSync(options);
            newUserWin.close()
        }
    }
}

// Delete user
async function deleteUser(idUser) {
    try {
        const conn = await getConnection();
        const result = await conn.query("DELETE FROM client WHERE IdClient = ?", idUser)
        new Notification({
            title: 'Flow Glam',
            subtitle: 'Delete User',
            body: 'User deleted successfully',
            icon: path.join(__dirname, './img/logoFlow.png')
        }).show();
        byNameWin.close();
    } catch (error) {
        console.log(error)
    }
}

// Get Users
async function getUsers() {
    try {
        const conn = await getConnection();
        const results = await conn.query("SELECT * FROM client")
        return results;
    } catch (error) {
        console.log(error)
    }
} 

// get Users by name or user_name
async function getByUser(byUser) {
    try {
        const conn = await getConnection();      
        const dbName = '%' + byUser.name + '%';
        const dbUser = byUser.user;             
        if (dbName.length > 2){ 
            const results = await conn.query("SELECT * FROM client WHERE Name LIKE ?", dbName);            
            return results;         
        };
        if (dbUser.length > 1) {
            const results = await conn.query("SELECT * FROM client WHERE User = ?", dbUser);            
            return results;
        };            
    } catch (error) {
        console.log(error);
    }     
};

// create service
async function createService(newService, id) {
    try {
        const conn = await getConnection();         
        newService.idClientFk = id;
        const service = {   
            comment: newService.comment,
            date: newService.date,
            hour: newService.hour,
            idClientFk: newService.idClientFk,            
            number: newService.turn,
            price: newService.price,
            title: newService.title 
        }
        const result = await conn.query("INSERT INTO turn SET ?", service);        
        new Notification({
            title: 'Flow Glam',
            subtitle: 'Create Service',
            body: 'Service saved successfully',
            icon: path.join(__dirname, './img/logoFlow.png')
        }).show();        
        addServWin.close(); 
    } catch (error) {
        console.log(error);
    }
};
// consulta SQL para verificar los turnos
async function getServiceByUser(id) {    
    try {
        const conn = await getConnection();
        const id_fk = id;
        const id_cl = id;
        const sql = "SELECT date_format(date,'%Y-%m-%d') as date, hour, title, number, price, comment, idturn, turn.idClientFk, client.IdClient FROM turn INNER JOIN client WHERE turn.idClientFk = ? AND client.IdClient = ? ORDER BY turn.date DESC, turn.hour ASC";
        const results = await conn.query(sql, [id_cl, id_fk]);        
        return results;
    } catch (error) {
        console.log(error);
    }
}

// Sentencia para UPDATE service
async function editServiceById(service, id) {
    try {        
        const conn = await getConnection();
        //UPDATE `flow_db`.`turn` SET `comment` = 'pagado', `date` = '2020-08-07', `hour` = '15:00:00', `idClientFk` = '17', `number` = '1', `price` = '300', `title` = 'Perfilado' WHERE (`idturn` = '7');
        const sql = "UPDATE turn SET ? WHERE idturn = ?";
        await conn.query(sql, [service, id]);
        new Notification({
            title: 'Flow Glam',
            subtitle: 'Edit Service',
            body: 'Service edited successfully',
           icon: path.join(__dirname, './img/logoFlow.png')
        }).show();
        getSerUserWin.close();
    } catch (error) {
        console.log(error);
    }
}

async function deleteServiceByUser(id) {    
    try {  
        const conn = await getConnection();        
        //const sql = "DELETE FROM turn WHERE turn.idturn = ?";
        const result = await conn.query("DELETE FROM turn WHERE turn.idturn = ?", id);
        new Notification({
            title: 'Flow Glam',
            subtitle: 'Delete User',
            body: 'Service delete successfully',
           icon: path.join(__dirname, './img/logoFlow.png')
        }).show();        
        getSerUserWin.close();                   
    } catch (error) {
        console.log(error);
    }
};

// Section 2 ***** Date Consult *****

// Consult by date
async function consultByDate(dateConsult){
    try {
        const conn = await getConnection();
        const sql = "SELECT client.User, date_format(turn.date,'%d/%m/%Y') as date, turn.hour, turn.title, turn.number, turn.price, turn.comment FROM turn INNER JOIN client WHERE DATE(date) = ? AND turn.idClientFk = client.IdClient ORDER BY turn.date DESC, turn.hour ASC;";
        const results = await conn.query(sql, [dateConsult]);        
        return results;
    } catch (error) {
        console.log(error);
    }
};

// Section 3 ***** Courses Consult *****
async function consultCourseByDay(dateCons) {
    try {
        const conn = await getConnection();
        const sql = "SELECT client.Name, date_format(turn.date,'%d/%m/%Y') as date, turn.title, turn.price, turn.comment FROM turn INNER JOIN client WHERE DATE(date) = ? AND turn.title LIKE 'curso%' AND turn.idClientFk = client.IdClient;";
        const results = await conn.query(sql, [dateCons]);            
        return results;
    } catch (error) {
        console.log(error);
    } 
}

async function allCourses() {
    try {
        const conn = await getConnection();
        const sql = "SELECT client.Name, date_format(turn.date,'%d/%m/%Y') as date, turn.title, turn.price, turn.comment FROM turn INNER JOIN client WHERE turn.title LIKE '%curso%' AND turn.idClientFk = client.IdClient ORDER BY date DESC;";
        const results = await conn.query(sql);            
        return results;
    } catch (error) {
        console.log(error);
    } 
}

// *********************** windows  *********************************
let win // principal
let newUserWin // User record
let byNameWin // consult by name
let getSerUserWin // consult schedule by user

// ****** Users Menu Windows  

function createWindow() {
    win = new BrowserWindow({
        width: 660,
        height: 620,
        title: 'Flow Glam',
        parent: true,
        icon:__dirname + './img/diamante.ico',
        webPreferences: {
            nodeIntegration : true
        }        
    })
    win.once('ready-to-show', () => {
        win.show()
    })
    const menu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menu);
    win.loadFile('src/app/index.html');   
    win.on('closed', () => {
        app.quit();
    }); 
};

function newUserWindow() {
    newUserWin = new BrowserWindow({
        width: 380,
        height: 350,
        title: 'New User',
        icon:__dirname + './img/diamante.ico',
        webPreferences: {
            nodeIntegration : true
        }        
    });
    newUserWin.setMenu(null);
    newUserWin.loadFile('src/app/user.html');
};
ipcMain.on('user:update', (e, userUp) => {      
    newUserWin.webContents.on('did-finish-load', function() { 
        newUserWin.webContents.send('user:update', userUp);         
    })
    
});

function consultByNameWindow() {
    byNameWin = new BrowserWindow({
        width: 660,
        height: 580,
        title: 'User Consult', 
        icon:__dirname + './img/diamante.ico',       
        webPreferences: {
            nodeIntegration : true
        }        
    });
    byNameWin.setMenu(null);
    byNameWin.loadFile('src/app/consult.html');
};

function generalUserWindow() {
    byNameWin = new BrowserWindow({
        width: 575,
        height: 500,
        title: 'General Consul by User', 
        icon:__dirname + './img/diamante.ico',       
        webPreferences: {
            nodeIntegration : true
        }        
    });
    byNameWin.setMenu(null);
    byNameWin.loadFile('src/app/general.html');
}

function addServiceWindow() {
    addServWin = new BrowserWindow({
        width: 550,
        height: 710,
        title: 'Add Service', 
        icon:__dirname + './img/diamante.ico',       
        webPreferences: {
            nodeIntegration : true
        }        
    })
    addServWin.loadFile('src/app/service.html');
    addServWin.setMenu(null);
    /* addServWin.webContents.on('did-finish-load', function() { 
        addServWin.webContents.send('user:add', 'desde Main a Service'); // para verificar
    }); */    
}

ipcMain.on('user:add', (e, serAdd) => {      
    addServWin.webContents.on('did-finish-load', function() { 
        addServWin.webContents.send('user:add', serAdd);         
    })
    
});

function getServiceByUserWindow() {
    getSerUserWin = new BrowserWindow({
        width: 550,
        height: 720,
        title: 'Schedule by User',
        icon:__dirname + './img/diamante.ico',        
        webPreferences: {
            nodeIntegration : true
        }        
    })
    getSerUserWin.loadFile('src/app/schedule.html');
    getSerUserWin.setMenu(null);
    /* getSerUserWin.webContents.on('did-finish-load', function() { 
        getSerUserWin.webContents.send('user:get', 'desde Main a Service'); // para verificar
    }); */
}

ipcMain.on('user:get', (e, serAdd) => {
    getSerUserWin.webContents.on('did-finish-load', function() {
        getSerUserWin.webContents.send('user:get', serAdd);
    });
});

// *** End User menu Windows  ***

// ************* Schedule service's windows***************************

function consultByDateWindow() {
    byDateWin = new BrowserWindow({
        width: 1050,
        height: 600,
        title: 'Services by day', 
        icon:__dirname + './img/diamante.ico',       
        webPreferences: {
            nodeIntegration : true
        }        
    });
    byDateWin.setMenu(null);
    byDateWin.loadFile('src/app/scheduleday.html');
};

// *** End Schedule service's windows***
// ************* Sales windows***************************

function consultCourseWindow() {
    consultCourseWin = new BrowserWindow({
        width: 600,
        height: 620,
        title: 'Courses Consult', 
        icon:__dirname + './img/diamante.ico',       
        webPreferences: {
            nodeIntegration : true
        }        
    });
    consultCourseWin.setMenu(null);
    consultCourseWin.loadFile('src/app/courses.html');
};

// *** End Sales windows***

// *******************    menu ***********************
const templateMenu = [
    {   label: '   User',
        submenu: [
            {label: 'New User',
            accelerator: 'Ctrl+N',
            click(){newUserWindow();}
            },
            {type: 'separator'},
            {label: 'User Consult',
            accelerator: 'Ctrl+W',
            click(){consultByNameWindow();}
            },            
            {type: 'separator'},
            {label: 'General Consult (All)',
            accelerator: 'Ctrl+G',
            click(){generalUserWindow();}
            },
            {type: 'separator'},
            {label: 'Exit',
            accelerator: 'Ctrl+Q',
            click(){app.quit()}
            }
        ]
    },
    {   label: 'Schedule',
        submenu: [
            {label: 'By date',
            accelerator: 'Ctrl+D',
            click(){consultByDateWindow();}
            }            
        ]
    },
    {   label: 'Sale',
        submenu: [
            {label: 'Courses',
            accelerator: 'Ctrl+P',
            click(){consultCourseWindow();}
            }            
        ]
    }
]

if (process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {label: 'Show / Hide DevTools',
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();
            }},
            {
             role: 'reload'   
            }
        ]
    })
}

module.exports = {
    createWindow,
    createUser,
    editUser,
    deleteUser,
    getUsers,
    getByUser,
    createService,
    editServiceById,
    getServiceByUser,
    deleteServiceByUser,
    consultByDate,
    consultCourseByDay,
    newUserWindow,
    consultByNameWindow, 
    generalUserWindow,   
    addServiceWindow,
    getServiceByUserWindow,
    consultByDateWindow,
    consultCourseWindow,
    allCourses
}