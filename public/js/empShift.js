(function(){
    var xhr = new XMLHttpRequest();
        xhr.open('GET', '/dashboard/employee/fetch-shift', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Update DOM based on response
                    var responseJson = JSON.parse(xhr.responseText);
                    Table(responseJson.shifts);
                } else {
                    var responseJson = JSON.parse(xhr.responseText);
                }
            }
        };
        xhr.send();
        
})();

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

