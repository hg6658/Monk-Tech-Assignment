document.addEventListener('DOMContentLoaded', function() {
    fetchUserSlots();
    flatpickr('#date1', {
        minDate: new Date().fp_incr(1),
        maxDate: new Date().fp_incr(7),
        dateFormat: 'Y-m-d'
    });
    flatpickr('#startTime', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i'
    });
    flatpickr('#endTime', {
        enableTime: true,
        noCalendar: true,
        dateFormat: 'H:i'
    });
    var form = document.getElementById('registerForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var date = document.getElementById('date1');
        var startTimeInput = document.getElementById('startTime');
        var endTimeInput = document.getElementById('endTime');
        date.classList.remove('is-invalid');
        startTimeInput.classList.remove('is-invalid');
        endTimeInput.classList.remove('is-invalid');
        var startTime = new Date('2022-01-01 ' + startTimeInput.value); // Using a common date to ensure the time difference calculation works properly
        var endTime = new Date('2022-01-01 ' + endTimeInput.value);
        var timeDiff = endTime - startTime;
        if(date.value == ''){
          date.classList.add('is-invalid');
          return;
        }
        if(timeDiff < 0 ){
          startTimeInput.classList.add('is-invalid');
          endTimeInput.classList.add('is-invalid');
          return;
        } 
        var diffHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if(diffHours < 4){
          startTimeInput.classList.add('is-invalid');
          endTimeInput.classList.add('is-invalid');
          return;
        }
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/dashboard/employee/book-slot', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    fetchUserSlots();
                } else {
                    var responseJson = JSON.parse(xhr.responseText);
                    
                }
            }
        };
        xhr.send(new URLSearchParams(formData).toString());
    });    
});


function fetchUserSlots() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/dashboard/employee/fetch-user-slots', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                if (xhr.status === 200) {
                    var responseJSON = JSON.parse(xhr.responseText);
                    Table(responseJSON.timeslots);
                } else {
                    console.log(xhr.responseText);
                    var responseJson = JSON.parse(xhr.responseText);
                    console.log(responseJson);
                }
            }
        };
        xhr.send();
}

function Table(timeslots){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML ='';
    timeslots.forEach(slot =>{
        const startTime = moment(slot.startTime).tz(slot.timezone);
        const endTime = moment(slot.endTime).tz(slot.timezone);
        console.log(startTime);
        console.log(startTime.format('HH:mm'));
        createTable(startTime,endTime,slot.timezone);
    });
}

function createTable(startTime,endTime,timezone) {
    let tbody = document.querySelector('tbody');
    let trElement = document.createElement(`tr`);
    trElement.setAttribute('id', `row-${startTime.day()}`);
    let tdDay = document.createElement('td');
    tdDay.setAttribute('class','day');
    tdDay.textContent = startTime.format('dddd');
    let date = document.createElement('td');
    date.setAttribute('class','slot-date');
    date.textContent = startTime.format('YYYY-MM-DD');
    let timeRange = document.createElement('td');
    timeRange.textContent = `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;
    timeRange.setAttribute('class','slot-time-range');
    let zone = document.createElement('td');
    zone.textContent = `${timezone}`;
    trElement.appendChild(tdDay);
    trElement.appendChild(date);
    trElement.appendChild(timeRange);
    trElement.appendChild(zone);
    tbody.appendChild(trElement);
}