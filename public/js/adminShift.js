document.addEventListener('DOMContentLoaded', function() {
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
        xhr.open('POST', '/dashboard/admin/fetch-intersected-employee', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var responseJson = JSON.parse(xhr.responseText);
                    Table(responseJson.timeslots);

                    let buttons = document.querySelectorAll('tbody td button')
                    buttons.forEach(function(button){
                        button.addEventListener('click', function(event){
                            event.preventDefault();
                            var formDatax = new FormData();
                            formDatax.set('userId',button.getAttribute('userId'));
                            formDatax.set('slotId',button.getAttribute('slotId'));
                            var xhrt = new XMLHttpRequest();
                            xhrt.open('POST', '/dashboard/admin/make-shift', true);
                            xhrt.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            xhrt.onreadystatechange = function() {
                                if (xhr.readyState === 4) {
                                    if (xhr.status === 200) {
                                        let responseJson = JSON.parse(xhr.responseText);
                                        button.disabled = true;
                                        button.textContent = 'Assigned';
                                    }else {
                                        
                                    }
                                }
                            }
                            xhrt.send(new URLSearchParams(formDatax).toString());
                        })
                    });
                } else {
                    var responseJson = JSON.parse(xhr.responseText);
                    
                    
                }
            }
        };
        xhr.send(new URLSearchParams(formData).toString());
    });    
function Table(timeslots){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML ='';
    timeslots.forEach(slot =>{
        const startTime = moment(slot.startTime).tz(slot.timezone);
        const endTime = moment(slot.endTime).tz(slot.timezone);
        createTable(slot._id,startTime,endTime,slot.timezone,slot.userId);
    });
}    

function createTable(slotId,startTime,endTime,timeZone,user){
    let tbody = document.querySelector('tbody');
    let trElement = document.createElement(`tr`);
    trElement.setAttribute('id', `row-${startTime.day()}`);
    trElement.setAttribute('userId', `${user._id}`);
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
    let userName = document.createElement('td');
    userName.setAttribute('class','slot-user');
    userName.textContent = user.name;
    let buttonTd = document.createElement('td');
    let button = document.createElement('button');
    button.setAttribute('slotId',slotId);
    button.setAttribute('userId',user._id);
    button.setAttribute('class','btn btn-primary');
    button.textContent = 'Assign';
    buttonTd.appendChild(button);
    zone.textContent = `${timeZone}`;
    trElement.appendChild(tdDay);
    trElement.appendChild(date);
    trElement.appendChild(timeRange);
    trElement.appendChild(zone);
    trElement.appendChild(userName);
    trElement.appendChild(buttonTd);
    tbody.appendChild(trElement);
}