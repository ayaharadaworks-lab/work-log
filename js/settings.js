/* =========================
 WORK LOG v1.0
 Settings Backup
========================= */


let data = loadData();





const exportBtn =

document.getElementById("exportBtn");



const importBtn =

document.getElementById("importBtn");



const importFile =

document.getElementById("importFile");



const csvBtn =

document.getElementById("csvBtn");









// =========================
// JSONバックアップ
// =========================


exportBtn.onclick = ()=>{


const json =

JSON.stringify(

data,

null,

2

);




const blob =

new Blob(

[json],

{

type:"application/json"

}

);




const url =

URL.createObjectURL(blob);




const a =

document.createElement("a");



a.href = url;



a.download =

`WORK_LOG_backup_${getDateKey()}.json`;



a.click();



URL.revokeObjectURL(url);



};









// =========================
// 復元
// =========================


importBtn.onclick = ()=>{



const file =

importFile.files[0];





if(!file){


alert(

"バックアップファイルを選択してください"

);



return;


}







const reader =

new FileReader();





reader.onload = ()=>{


try{


const restoreData =

JSON.parse(

reader.result

);





saveData(

restoreData

);





alert(

"データを復元しました"

);





location.reload();




}catch(e){



alert(

"ファイル形式が正しくありません"

);



}



};






reader.readAsText(file);



};









// =========================
// CSV出力
// =========================


csvBtn.onclick = ()=>{


let csv =

"日付,開始時間,終了時間,案件\n";







Object.keys(data.records)

.forEach(date=>{





data.records[date]

.forEach(record=>{





csv +=



`${date},${record.start},${record.end},${getProjectName(record.projectId)}\n`;





});



});








const blob =

new Blob(

[csv],

{

type:"text/csv"

}

);







const url =

URL.createObjectURL(blob);







const a =

document.createElement("a");




a.href = url;




a.download =

`WORK_LOG_${getDateKey()}.csv`;





a.click();






URL.revokeObjectURL(url);



};