document.getElementById('csvFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        csvData = e.target.result;
        const separator = detectSeparator(csvData);
        let array = CSVToArray(csvData, separator)

        let newArray = [];

        for (let i = 1; i < array.length - 1; i++) {
            let obj = {};
            for (let j = 0; j < array[0].length; j++) {
                obj[array[0][j]] = array[i][j];
            }
            newArray.push(obj)
        }

        let weekdays = ['MO', 'DI', 'MI', 'DO', 'FR']

        let week = [
            [],
            [],
            [],
            [],
            []
        ]

        newArray.forEach(element => {
            week[weekdays.indexOf(element.WOCHENTAG)].push(element)
        });

        console.log(newArray)
        console.log(week)

        const div = document.createElement('div')
        div.classList.add("parent")

        weekdays.forEach((element, index) => {
            const dayDiv = document.createElement('div')
            dayDiv.setAttribute("id", element);
            dayDiv.classList.add("child")
            
            week[index].forEach((event, rowIndex) => {
                let eventDiv = document.createElement('div')
                eventDiv.classList.add("event")
                eventDiv.classList.add(event.LV_ART)

                let p1 = document.createElement('p');
                p1.textContent = event.TITEL;
                eventDiv.appendChild(p1)

                let p2 = document.createElement('p');
                p2.textContent = event.WOCHENTAG;
                eventDiv.appendChild(p2)

                dayDiv.appendChild(eventDiv);
            });
            div.appendChild(dayDiv)
        });

        document.body.insertBefore(div, document.body.childNodes[0]);


        // displayArray(array);
    };
    reader.readAsText(file, 'ISO-8859-4');
});

/* function displayArray(array) {
    const table = document.getElementById('csvTable');
    table.innerHTML = ''; // Clear the table first


    // Loop through rows and add them to the table
    array.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        row.forEach(element => {
            const td = document.createElement(rowIndex === 0 ? 'th' : 'td'); // Use 'th' for the first row (headers)
            td.textContent = element;
            tr.appendChild(td);
        });

        table.appendChild(tr);
    });
} */

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