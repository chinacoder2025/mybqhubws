function updateClock() {
    var now = new Date();
  
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
  
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
  
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
  
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var dayName = days[now.getDay()];
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
  
    var dateString = dayName + " " + year + "-" + month + "-" + day;
    document.getElementById("date").innerHTML = dateString;
  }

  window.onload = function() {
    setTimeout(function() { window.scrollTo(0, 1); }, 1000);
  };
  
  setInterval(updateClock, 1000);
  updateClock();
  