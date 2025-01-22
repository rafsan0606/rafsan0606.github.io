document.addEventListener("DOMContentLoaded", function() {

    const eventDate = moment("2025-05-01 23:59:59");

    function updateCountdown() {
        const currentTime = moment();
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
