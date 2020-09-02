const { remote } = require('electron');
const main =remote.require('./main');

let rowCourse = 0;
var total = 0;
const dateForm = document.getElementById('dateForm');
const dateConsult = document.getElementById('dateConsult');

function callAllCourses(event) {
    event.target.addEventListener('click', async () => {
        const results = await main.allCourses();
        renderCourseDay(results);
    });
}
document.getElementById('btnAllCo').addEventListener('click', callAllCourses);

dateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (dateConsult.value === ''){
        message.innerHTML = `Date required`;
        dateForm.focus();
    } else {
        message.innerHTML = '';
        dateCons = dateConsult.value;
        const result = await main.consultCourseByDay(dateCons);
        renderCourseDay(result);
    }
});


function renderCourseDay(courseListTables) {    
    courseTable.innerHTML = '';
    courseListTables.forEach(courseListTable => {        
        total += parseFloat(courseListTable.price);
        rowCourse += 1;
        courseTable.innerHTML += `
            <tr>
                <th scope="row">${rowCourse}</th>
                <td>${courseListTable.Name}</td>
                <td>${courseListTable.date}</td>
                <td colspan="2">${courseListTable.title}</td>                
                <td>${courseListTable.price}</td>
                <td colspan="2">${courseListTable.comment}</td>
            </tr>
        `;
    })
    totalPrice.innerHTML = total;
    rowCourse = 0;
    total = 0;
}