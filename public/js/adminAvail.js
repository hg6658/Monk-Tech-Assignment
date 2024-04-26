let isFirstClick = true; // Flag to track if it's the first click

document.getElementById('employee-list').addEventListener('click', async function() {
    if (isFirstClick) {
        try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/dashboard/admin/get-list', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Update DOM based on response
                    var responseJson = JSON.parse(xhr.responseText);
                    populateOptions(responseJson.employees);
                } else {
                    var responseJson = JSON.parse(xhr.responseText);
                }
            }
        };
        xhr.send();
            isFirstClick = false; 
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    }
});

function populateOptions(options) {
    const select = document.getElementById('employee-list');
    select.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
    });
}


var form = document.getElementById('getEmployee');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/dashboard/admin/get-schedule', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var responseJson = JSON.parse(xhr.responseText);
                    let tbody = document.querySelector('tbody');
                    tbody.innerHTML ='';
                    responseJson.timeslots.forEach(slot =>{
                        const startTime = moment(slot.startTime).tz(slot.timezone);
                        const endTime = moment(slot.endTime).tz(slot.timezone);
                        createTable(slot.startTime,slot.endTime,startTime,endTime,slot.timezone);
                    });
                    document.querySelectorAll('tbody tr').forEach(tr => {
                        let select = tr.querySelector('select');
                        let date = tr.querySelector('.slot-date');
                        let timerange = tr.querySelector('.slot-time-range');
                        let day = tr.querySelector('.day');
                        select.addEventListener('change', function(event) {
                            const selectedOption = this.options[this.selectedIndex]; 
                            const selectedValue = selectedOption.value; 
                            const selectedText = selectedOption.textContent;
                            updateTime(date,timerange,day,selectedValue);
                        });
                    });
                }
            }
        };
        xhr.send(new URLSearchParams(formData).toString());
    });

function createTable(isoStart,isoEnd,startTime,endTime,zoneGiven){
    let timeZones =["America/New_York","Asia/Kolkata","Asia/Shanghai","Asia/Dubai","Europe/London"];
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
    console.log(startTime.format('HH:mm'));
    timeRange.textContent = `${startTime.format('HH:mm')}-${endTime.format('HH:mm')}`;
    timeRange.setAttribute('class','slot-time-range');
    timeRange.setAttribute('start',isoStart);
    timeRange.setAttribute('end',isoEnd);
    let zone = document.createElement('td');
    zone.setAttribute('class','slot-zone');
    let selectTag = document.createElement('select');
    selectTag.setAttribute('class','form-control');
    timeZones.forEach(timeZone =>{
        let optionTag = document.createElement(`option`);
        optionTag.setAttribute('value', `${timeZone}`);
        if(timeZone === zoneGiven) optionTag.selected = true;
        optionTag.textContent = timeZone;
        selectTag.appendChild(optionTag);
    })
    zone.appendChild(selectTag);
    trElement.appendChild(tdDay);
    trElement.appendChild(date);
    trElement.appendChild(timeRange);
    trElement.appendChild(zone);
    tbody.appendChild(trElement);
}

function updateTime(date,timerange,day,selectedValue){
    let startTime = moment.utc(timerange.getAttribute('start'),'YYYY-MM-DDTHH:mm:ss.SSS[Z]').tz(selectedValue);
    let endTime = moment.utc(timerange.getAttribute('end'),'YYYY-MM-DDTHH:mm:ss.SSS[Z]').tz(selectedValue);
    console.log(timerange.getAttribute('start'));
    console.log(startTime.format('HH:mm'));
    console.log(selectedValue);
    date.textContent = startTime.format('YYYY-MM-DD');
    timerange.textContent = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;
    console.log(startTime);
    day.textContent = startTime.format('dddd');
}
