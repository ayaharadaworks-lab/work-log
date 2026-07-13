/* =========================
 WORK LOG v1.0
 Projects
========================= */


let data = loadData();




const projectName =

document.getElementById("projectName");



const projectColor =

document.getElementById("projectColor");



const addButton =

document.getElementById("addProject");



const projectList =

document.getElementById("projectList");







// =========================
// 一覧表示
// =========================


function renderProjects(){


projectList.innerHTML="";





if(data.projects.length === 0){



projectList.innerHTML =


`

<p class="small-text">

案件がありません

</p>

`;



return;


}





data.projects.forEach(project=>{


projectList.innerHTML +=


`

<div class="project-card">



<div class="project-info">


<div

class="project-color"

style="background:${project.color}"

>

</div>



<span>

${project.name}

</span>


</div>





<button

class="delete-btn"

onclick="deleteProject('${project.id}')"

>

削除

</button>




</div>


`;



});




}









// =========================
// 案件追加
// =========================


addButton.onclick = ()=>{



const name =

projectName.value.trim();





if(!name){


alert(

"案件名を入力してください"

);


return;


}





const newProject = {


id:

"project_" + Date.now(),



name:name,



color:

projectColor.value



};







data.projects.push(

newProject

);



saveData(data);






projectName.value="";




renderProjects();



};









// =========================
// 案件削除
// =========================


function deleteProject(id){



const check =

confirm(

"この案件を削除しますか？"

);



if(!check){

return;

}






data.projects =

data.projects.filter(

project =>

project.id !== id

);





saveData(data);



renderProjects();


}








// 初期表示

renderProjects();