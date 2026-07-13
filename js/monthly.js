/* =========================
 WORK LOG v1.0
 Monthly
========================= */


let data = loadData();


let currentDate = new Date();






const monthTitle =

document.getElementById("monthTitle");



const totalTime =

document.getElementById("totalTime");



const workDays =

document.getElementById("workDays");



const averageTime =

document.getElementById("averageTime");



const projectSummary =

document.getElementById("projectSummary");



const dailyList =

document.getElementById("dailyList");









// =========================
// 月表示
// =========================


function renderMonthly(){



const year =

currentDate.getFullYear();



const month =

currentDate.getMonth();





monthTitle.innerHTML =

`${year}年${month+1}月`;





let total = 0;


let days = 0;



let projects = {};



dailyList.innerHTML = "";



Object.keys(data.records)

.sort()

.forEach(date=>{



const d =

new Date(date);





if(

d.getFullYear() === year

&&

d.getMonth() === month

){



days++;




let dayTotal = 0;





data.records[date]

.forEach(record=>{



const minutes =

calculateMinutes(

record.start,

record.end

);




total += minutes;



dayTotal += minutes;






const name =

getProjectName(

record.projectId

);



if(!projects[name]){


projects[name]=0;


}



projects[name]+=minutes;




});








dailyList.innerHTML +=


`

<div class="month-item">


<span>

${date}

</span>



<span>

${formatMinutes(dayTotal)}

</span>


</div>


`;



}



});










// 総時間

totalTime.innerHTML =

formatMinutes(total);






// 稼働日

workDays.innerHTML =

`${days}日`;






// 平均

averageTime.innerHTML =

days

?

formatMinutes(

Math.floor(total/days)

)

:

"0時間0分";









// 案件別

projectSummary.innerHTML="";




Object.keys(projects)

.forEach(name=>{


projectSummary.innerHTML +=


`

<div class="project-summary">


${name}



<br>



${formatMinutes(projects[name])}



</div>


`;



});





if(
Object.keys(projects).length===0
){


projectSummary.innerHTML =


`

<p class="small-text">

データなし

</p>

`;



}



}









// =========================
// 月移動
// =========================


document

.getElementById("prevMonth")

.onclick = ()=>{


currentDate.setMonth(

currentDate.getMonth()-1

);


renderMonthly();


};







document

.getElementById("nextMonth")

.onclick = ()=>{


currentDate.setMonth(

currentDate.getMonth()+1

);


renderMonthly();


};









// 初期表示

renderMonthly();