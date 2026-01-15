document.addEventListener("DOMContentLoaded", function() {

    function getNextSummerStart() {
        const now = moment();
        const currentYear = now.year();

        let summerStart = moment(`${currentYear}-05-01 00:00:00`);

        if (now.isAfter(summerStart)) {
            summerStart = moment(`${currentYear + 1}-05-01 00:00:00`);
        }

        return summerStart;
    }

    const eventDate = getNextSummerStart();

    function updateCountdown() {
        const currentTime = moment();

        if (currentTime.isBetween(
            moment(`${currentTime.year()}-05-01`),
            moment(`${currentTime.year()}-07-31`).endOf('day')
        )) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            document.querySelector('.title').innerText = "Summer Break is ON! ☀️";
            return;
        }

        const duration = moment.duration(eventDate.diff(currentTime));

        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        document.getElementById('days').innerText = addZero(days);
        document.getElementById('hours').innerText = addZero(hours);
        document.getElementById('minutes').innerText = addZero(minutes);
        document.getElementById('seconds').innerText = addZero(seconds);
    }

    function addZero(time) {
        return time < 10 ? '0' + time : time;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});