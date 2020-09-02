const { remote } = require('electron');
const main =remote.require('./main');

const dateForm = document.getElementById('dateForm');

const dateConsult = document.getElementById('dateConsult');
let rowService = 0;
var total = 0;
dateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (dateConsult.value === ''){
        message.innerHTML = `Date required`;
        dateForm.focus();
    } else {
        message.innerHTML = '';
        dateCons = dateConsult.value;
        const result = await main.consultByDate(dateCons);
        renderServiceDay(result);
    }
});


function renderServiceDay(serviceListTables) {    
    serviceTable.innerHTML = '';
    serviceListTables.forEach(serviceListTable => {
        total += parseFloat(serviceListTable.price);
        rowService += 1;
        serviceTable.innerHTML += `
            <tr>
                <th id="rowService" scope="row">${rowService}</th>
                <td id="userService">${serviceListTable.User}</td>
                <td id="dateService">${serviceListTable.date}</td>
                <td id="hourService">${serviceListTable.hour}</td>
                <td id="titleService" colspan="2">${serviceListTable.title}</td>
                <td id="numberService">${serviceListTable.number}</td>
                <td id="priceService">${serviceListTable.price}</td>
                <td id="commentService" colspan="2">${serviceListTable.comment}</td>                
            </tr>
        `;
    })
    totalPrice.innerHTML = total;
    rowService = 0;
    total = 0;
}

