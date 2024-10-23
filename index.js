const parent = document.getElementById('table')
const tableStyle = document.getElementById("tableStyle")

var container = document.getElementById("typeSelect")
var checkboxesAll = container.querySelectorAll('input[type="checkbox"]');

checkboxesAll.forEach(element => {
    element.addEventListener("click", function (test) {
        console.log({state: test.target.checked, value: test.target.value});
    })
});

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
            objArray.push(obj)
        }

        displayArray(objArray);
    };
    reader.readAsText(file, 'ISO-8859-4');
});

function timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
}

function displayArray(array) {
    parent.innerHTML = '';

    array.forEach((event, rowIndex) => {
        let eventDiv = document.createElement('div')
        eventDiv.classList.add("event")
        eventDiv.classList.add(event.LV_ART)
        eventDiv.classList.add(event.WOCHENTAG)
        eventDiv.classList.add("time" + (timeStringToFloat(event.VON) - 8) * 2)

        eventDiv.setAttribute('style', 'grid-row: ' + (timeStringToFloat(event.VON) - 8) * 4 + "/" + (timeStringToFloat(event.BIS) - 8) * 4)

        let p1 = document.createElement('p');
        p1.textContent = event.TITEL;
        eventDiv.appendChild(p1)

        let p2 = document.createElement('p');
        p2.classList.add("time")
        p2.textContent = (timeStringToFloat(event.VON) - 8) * 4 + " " + event.VON + " - " + event.BIS + " " + event.WOCHENTAG + " " + (timeStringToFloat(event.VON) - 8) * 4 + "/" + (timeStringToFloat(event.BIS) - 8) * 4;
        eventDiv.appendChild(p2)

        parent.appendChild(eventDiv);
    });


    if (tableStyle.textContent != "") {
        tableStyle.textContent = ""
    }

    var styles = ""

    for (let i = 0; i < 8; i++) {
        styles += ".time" + i + "{grid-row: " + i + "/" + (i + 1) + ";}"
    }

    let weekdays = ['MO', 'DI', 'MI', 'DO', 'FR']

    weekdays.forEach((element, i) => {
        i += 1
        console.log(i);

        styles += "." + element + "{grid-column: " + i + "/" + (i + 1) + ";}"
    });

    console.log(styles);

    tableStyle.textContent = styles
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