// getting value from handlebars directly --

const umonth  = document.getElementById('umonth');
const m =umonth.innerText;
const udate  = document.getElementById('udate');
const d =udate.innerText;
console.log(m);
console.log(d);
// current date
const today = new Date();
const date = today.getDate();
const month =today.getMonth();
// month = month +1; 
let popup = document.getElementById("popup");
const a = 1;
console.log(today);
console.log(date);
console.log(month);
if(m==month & d==date){
popup.classList.add("open-popup");
}
else{
console.log("data does not matched");
}
function closepopup(){
popup.classList.remove("open-popup")
}
