async function getsession() {
  try {
    const response = await fetch("/getsession");
    const data = await response.text();
    console.log(data);
    return Number(data);
  } catch (error) {
    console.log(error);
  }
}
async function activity() {
  var response=await fetch("/active");
  console.log(response.text());
}

const activebtn = document.querySelector(".activity");
activebtn.addEventListener("click", activity);

setInterval(async function () {
//   activebtn.removeEventListener("click", activity);
  var session = await getsession();
  if (session == "-1") {
    document.getElementById("demo").innerHTML = "Session Expired";
    window.location.href = "/logout";
  } else {
    var minutes = Math.floor(session / (1000 * 60));
    var seconds = Math.floor((session - minutes * 60 * 1000) / 1000);

    document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";
  }
}, 1000);
