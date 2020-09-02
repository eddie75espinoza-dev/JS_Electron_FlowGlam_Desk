const { remote, ipcRenderer } = require('electron')
const main =remote.require('./main')
const path = require('path')

let dialog = remote.dialog
let options = {} // for message dialog box

var serAdd;
let serviceLists = []
const service = {}

ipcRenderer.on('user:get', async function(event, serAdd) {     
    serviceLists = await main.getServiceByUser(serAdd.id); 
    await renderGetService(serAdd, serviceLists);           
});

async function editService(turn) {       
    
    const service = {}
    service.comment = document.getElementById('turnComment'+turn).innerText;
    service.date = document.getElementById('turnDate'+turn).innerText;
    service.hour = document.getElementById('turnHour'+turn).innerText;
    service.number = document.getElementById('turnNumber'+turn).innerText;
    service.price = document.getElementById('turnPrice'+turn).innerText;
    service.title = document.getElementById('turnTitle'+turn).innerText;          
    
    options.type = "question"
    options.title = 'Flow Glam  /  Edit service'
    options.buttons = ['&Yes', '&No']
    options.message = "Are you sure want to edit service?"
    options.normalizeAccessKeys = true
    let res = dialog.showMessageBoxSync(options);    
    if (res ===0) {
        main.editServiceById(service, turn);
    }
};

function deleteService(turn) {    
    options.type = "warning"
    options.title = 'Flow Glam  /  Delete service'
    options.buttons = ['&Yes', '&No']
    options.message = "Are you sure Delete service?"
    options.normalizeAccessKeys = true
    let res = dialog.showMessageBoxSync(options);
    if (res === 0){
        main.deleteServiceByUser(turn);
    }
};

function renderGetService(serAdd, serviceLists) {
    userName.innerHTML = `<h5 class:"card-title">${serAdd.name} - @${serAdd.user}</h5>`;    
    serviceList.innerHTML = ``;
    if (serviceLists.length === 0){
        serviceList.innerHTML = `<div class="card card-body">User no service</div>`;
    } else {   
        serviceLists.forEach(turn => {
            serviceList.innerHTML += `                
                <div id="${turn.idturn}" class="card card-body">
                    <h6>Date (yyyy-mm-dd): 
                        <span>
                            <p id="turnDate${turn.idturn}" contenteditable=""><time datetime="%Y-%m-%d"><b>${turn.date}</b></time></p>
                        </span>
                    </h6>                    
                    <h6>Schedule: 
                        <span>
                            <p id="turnHour${turn.idturn}" contenteditable=""><time>${turn.hour}</time></p>
                        </span>
                    </h6>
                    <h6>Service:
                        <span>
                            <p id="turnTitle${turn.idturn}" contenteditable="">${turn.title}</p>
                        </span>
                    </h6>
                    <h6>Turn number:
                        <span>
                            <p id="turnNumber${turn.idturn}" contenteditable="">${turn.number}</p>
                        </span>
                    </h6>
                    <h6>Price:
                        <span>
                            <p id="turnPrice${turn.idturn}" contenteditable="">${turn.price}</p>
                        </span>
                    </h6>
                    <h6>Comment:
                        <span>
                            <p id="turnComment${turn.idturn}" contenteditable="">${turn.comment}</p>
                        </span>
                    </h6>
                    <button class="btn btn-warning" onclick="editService('${turn.idturn}')">Edit Service</button>    
                    <button class="btn btn-secondary" onclick="deleteService('${turn.idturn}')">Delete Service</button>
                </div>
            `; 
        });
    };
           
}


