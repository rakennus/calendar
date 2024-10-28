const parent = document.getElementById('table')
const tableStyle = document.getElementById("tableStyle")

var container = document.getElementById("typeSelect")
var checkboxesAll = container.querySelectorAll('input[type="checkbox"]');

let lectureType = []

checkboxesAll.forEach(element => {
    if (!element.checked) {
        lectureType.push(element.value)
    }    

    element.addEventListener("click", function (test) {
        if (!test.target.checked) {
            lectureType.push(test.target.value)
        } else if (test.target.checked) {
            const index = lectureType.indexOf(test.target.value);
            if (index > -1) { // only splice array when item is found
                lectureType.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        
        displayArray(data)
    })
});

let data;

document.getElementById('csv_input').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (!file) return

    const reader = new FileReader();

    reader.onload = function (e) {
        csvData = e.target.result;
        const separator = detectSeparator(csvData);
        let csvArray = CSVToArray(csvData, separator)

        let objArray = [];

        for (let i = 1; i < csvArray.length - 1; i++) {
            let obj = {};
            for (let j = 0; j < csvArray[0].length; j++) {
                obj[csvArray[0][j]] = csvArray[i][j];
            }
            obj.start = (timeStringToFloat(obj.VON) - 8) * 4
            obj.end = (timeStringToFloat(obj.BIS) - 8) * 4
            objArray.push(obj)
        }

        data = objArray;

        displayArray(data);
    };
    reader.readAsText(file, 'ISO-8859-4');
});


function displayArray(array) {
    array = array.filter(item => !lectureType.includes(item.LV_ART))

    console.log(array);

    let weekdays = ['MO', 'DI', 'MI', 'DO', 'FR']
    let week = [[], [], [], [], []]



    array.forEach(element => {
        week[weekdays.indexOf(element.WOCHENTAG)].push(element)
    });

    parent.innerHTML = '';

    let legends = document.createElement('div')
    legends.classList.add("legends")
    legends.classList.add("tableColumn")

    for (let i = 0; i < 24; i++) {
        let legendTime = document.createElement('p')
        legendTime.classList.add("legendTime")

        legendTime.style.gridRow = i*2+1 + "/" + ((i+1)*2+1)

        legendTime.textContent = convertNumToTime(i/2+8+0.5);

        legends.appendChild(legendTime);
    }

    parent.appendChild(legends)

    week.forEach((day, dayIndex) => {
        let tableColumn = document.createElement('div')
        tableColumn.classList.add("tableColumn")

        console.log(weekdays[dayIndex]);

        let maxOverlaps = getMaxOverlaps(day)

        console.log(maxOverlaps);

        day.forEach((event, eventIndex) => {
            let eventDiv = document.createElement('div')
            eventDiv.classList.add("event")
            eventDiv.classList.add(event.LV_ART)
            eventDiv.classList.add(event.WOCHENTAG)

            if (!hasCollision(eventIndex, day)) {
                eventDiv.style.gridColumn = 1 + "/" + (maxOverlaps + 1)
            }

            eventDiv.style.gridRow = event.start + "/" + event.end

            let p1 = document.createElement('p');
            p1.classList.add("title")
            p1.textContent = event.TITEL;
            eventDiv.appendChild(p1)

            let p2 = document.createElement('p');
            p2.classList.add("time")
            // p2.textContent = event.VON + " - " + event.BIS + " " + event.WOCHENTAG + " " + event.start + "/" + event.end;
            p2.textContent = event.ORT
            eventDiv.appendChild(p2)

            tableColumn.appendChild(eventDiv);
        });

        parent.appendChild(tableColumn)
    });
}

function detectSeparator(csvText) {
    const separators = [',', ';', '\t', '|'];  // Common CSV separators
    const firstLine = csvText.split('\n')[0];  // Get the first line of the CSV

    let detectedSeparator = separators[0];
    let maxCount = 0;

    separators.forEach(separator => {
        const count = firstLine.split(separator).length - 1;  // Count occurrences of the separator
        if (count > maxCount) {
            maxCount = count;
            detectedSeparator = separator;
        }
    });

    return detectedSeparator;
}


// Find overlapping intervals
function getMaxOverlaps(intervals) {
    let maxOverlaps = 1;

    // Iterate through the array and compare each pair of intervals
    for (let i = 0; i < intervals.length; i++) {
        let overlaps = 1;
        for (let j = 0; j < intervals.length; j++) {
            if (j != i && doIntervalsOverlap(intervals[i], intervals[j])) {
                overlaps++;
            }
        }

        if (overlaps > maxOverlaps) {
            maxOverlaps = overlaps
        }
        console.log(overlaps);
    }

    return maxOverlaps;
}

// Find overlapping intervals
function hasCollision(eventIndex, array) {
    // Iterate through the array and compare each pair of intervals
    for (let i = 0; i < array.length; i++) {
        if (i != eventIndex && doIntervalsOverlap(array[eventIndex], array[i])) {
            return true
        }
    }
    return false;
}

function doIntervalsOverlap(interval1, interval2) {
    return interval1.start <= interval2.end && interval1.end >= interval2.start;
}

function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
}

function convertNumToTime(number) {
    // Check sign of given number
    var sign = (number >= 0) ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + '';

    // Add padding if need
    if (minute.length < 2) {
    minute = '0' + minute; 
    }

    // Add Sign in final result
    sign = sign == 1 ? '' : '-';

    // Return concated hours and minutes
    return sign + hour + ':' + minute;
}