const { remote, ipcRenderer } = require('electron');
const main =remote.require('./main');

const serviceForm = document.getElementById('serviceForm');

var newService;
var serAdd;

// Service Form
const serviceUser = document.getElementById('userName');
const titleDescription = document.getElementById('description');
const serviceDate = document.getElementById('date');
const serviceHour = document.getElementById('hour');
const servicePrice = document.getElementById('price');
const serviceTurnNum = document.getElementById('turnNum');
const serviceComment = document.getElementById('comment');

serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (titleDescription.value === '' || serviceDate.value === '' || serviceHour.value === '' || servicePrice.value === '' || serviceTurnNum.value === '') {
        message.innerHTML = `Data Required`;
    } else {
        newService = {        
            title: titleDescription.value,
            date: serviceDate.value,
            hour: serviceHour.value,
            idClientFk: null,
            price: servicePrice.value,
            turn: serviceTurnNum.value,
            comment: serviceComment.value
        }     
        await main.createService(newService,id);
    }
});


function renderService(serAdd) {
    userName.innerHTML = `<h5 class:"card-title">${serAdd.name} - @${serAdd.user}</h5>`;     
    id = serAdd.id;       
}

ipcRenderer.on('user:add', function(event, serAdd) {     
    renderService(serAdd);            
});

ipcRenderer.on('user:get', async function(event, serAdd) {     
    serviceLists = await main.getServiceByUser(serAdd.id); 
    await renderGetService(serAdd, serviceLists);           
});