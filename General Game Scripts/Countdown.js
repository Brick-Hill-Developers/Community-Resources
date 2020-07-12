
function startTimer(seconds) {

    var countdownTimer = setInterval(function() {

        bottomPrint(i, " Seconds left!", seconds);
        seconds = seconds - 1;

        if (seconds <= 0) {
            clearTimeout(countdownTimer);
        }

    }, 1000);

}

startTimer(50); 
