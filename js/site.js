var wedding = new Date('08-04-2023');
var today = new Date();

if (wedding >= today) {
  var diff = wedding.getTime() - today.getTime();
  var daydiff = diff / (1000 * 60 * 60 * 24);
  var countdown = document.getElementById("header-countdown");
  if (countdown != null) { countdown.innerText = Math.round(daydiff) + " DAYS TO GO!"; }
}