document.addEventListener("DOMContentLoaded", function() {
    const tempBtn = document.getElementById("tempBtn");
    const humidityBtn = document.getElementById("humidityBtn");
    const windBtn = document.getElementById("windBtn");
    const readingTable = document.getElementById("readingTable");
    const chartContainer = document.getElementById("chartContainer");
    const statisticalInfo = document.getElementById("statisticalInfo");

    let currentChart = null;

    const apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=61.4991&longitude=23.7871&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&past_days=7&forecast_days=0&timezone=Europe%2FHelsinki";

    tempBtn.addEventListener("click", () => fetchDataAndVisualize("temperature_2m"));
    humidityBtn.addEventListener("click", () => fetchDataAndVisualize("relative_humidity_2m"));
    windBtn.addEventListener("click", () => fetchDataAndVisualize("wind_speed_10m"));
    
    humidityBtn.click();
    windBtn.click();
    tempBtn.click();

    function fetchDataAndVisualize(type) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayData(data.hourly[type]);
                visualizeData(data.hourly[type], type);
                if (type === "relative_humidity_2m") {
                    calculateAndDisplayStats(data.hourly[type], "humidity");
                } else if (type === "wind_speed_10m") {
                    calculateAndDisplayStats(data.hourly[type], "wind");
                }
            })
            .catch(error => console.log(error));
    }

    function displayData(readings) {
        const tbody = readingTable;
        tbody.innerHTML = ""; // Clear previous data

        const currentTime = new Date(); // Get the current time

         // Create table headings
        const headingRow = document.createElement("tr");
        const dateHeading = document.createElement("th");
        const timeHeading = document.createElement("th");
        const readingHeading = document.createElement("th");
        dateHeading.textContent = "Date";
        timeHeading.textContent = "Time";
        readingHeading.textContent = "Reading";
        headingRow.appendChild(dateHeading);
        headingRow.appendChild(timeHeading);
        headingRow.appendChild(readingHeading);
        tbody.appendChild(headingRow);

        readings.slice(0, 20).forEach((reading, index) => {
            const row = document.createElement("tr");
            const dateCell = document.createElement("td");
            const timeCell = document.createElement("td");
            const readingCell = document.createElement("td");
            const timestamp = moment.utc(currentTime.getTime() - index * 3600 * 1000);
            const formattedDate = timestamp.format("YYYY-MM-DD");
            const formattedTime = timestamp.format("HH:mm:ss");
            dateCell.textContent = formattedDate;
            timeCell.textContent = formattedTime;
            readingCell.textContent = reading;
            row.appendChild(dateCell);
            row.appendChild(timeCell);
            row.appendChild(readingCell);
            tbody.appendChild(row);
        });
    }

    function visualizeData(readings, type) {
        // Destroy the previous chart if it exists
        if (currentChart !== null) {
            currentChart.destroy();
        }

        const labels = [];
        const values = [];

        readings.slice(0, 20).forEach((reading, index) => {
            const timestamp = moment.utc(Date.now() - index * 3600 * 1000);
            labels.unshift(timestamp.format("YYYY-MM-DD HH:mm:ss"));
            values.unshift(reading);
        });

        const ctx = chartContainer.querySelector("canvas").getContext("2d");
        currentChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: type,
                    data: values,
                    backgroundColor: "#0d6efd",
                    borderColor: "#0d6efd",
                    borderWidth: 3,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            parser: "yyyy-MM-dd HH:mm:ss",
                            tooltipFormat: "HH:mm:ss"
                        },
                        title: {
                            display: true,
                            text: "Time"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: type
                        }
                    }
                }
            }
        });
    }

    function calculateAndDisplayStats(readings, type) {
        const mean = calculateMean(readings);
        const median = calculateMedian(readings);
        const mode = calculateMode(readings);
        const range = calculateRange(readings);
        const standardDeviation = calculateStandardDeviation(readings);
        const min = Math.min(...readings);
        const max = Math.max(...readings);

        document.getElementById(`${type}Mean`).textContent = mean.toFixed(2);
        document.getElementById(`${type}Median`).textContent = median;
        document.getElementById(`${type}Mode`).textContent = mode;
        document.getElementById(`${type}Range`).textContent = range;
        document.getElementById(`${type}SD`).textContent = standardDeviation.toFixed(2);
        document.getElementById(`${type}Min`).textContent = min;
        document.getElementById(`${type}Max`).textContent = max;
    }

    function calculateMean(data) {
        const sum = data.reduce((acc, val) => acc + val, 0);
        return sum / data.length;
    }

    function calculateMedian(data) {
        const sortedData = data.slice().sort((a, b) => a - b);
        const middle = Math.floor(sortedData.length / 2);
        if (sortedData.length % 2 === 0) {
            return (sortedData[middle - 1] + sortedData[middle]) / 2;
        } else {
            return sortedData[middle];
        }
    }

    function calculateMode(data) {
        const counts = {};
        data.forEach(val => {
            counts[val] = (counts[val] || 0) + 1;
        });
        const mode = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        return mode;
    }

    function calculateRange(data) {
        return Math.max(...data) - Math.min(...data);
    }

    function calculateStandardDeviation(data) {
        const mean = calculateMean(data);
        const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
        return Math.sqrt(variance);
    }

    // nav link state change

    const links = document.querySelectorAll("nav ul li a");

    links.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            // Remove active class from all links
            links.forEach(function(link) {
                link.classList.remove("active");
            });

            // Add active class to the clicked link
            this.classList.add("active");
        });
    });
});
