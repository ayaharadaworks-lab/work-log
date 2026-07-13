/* =========================
 WORK LOG v1.1
 Calendar + Edit
========================= */

let data = loadData();
let currentDate = new Date();

const grid = document.getElementById("calendarGrid");
const monthTitle = document.getElementById("monthTitle");
const detailTitle = document.getElementById("detailTitle");
const detailList = document.getElementById("detailList");
const editArea = document.getElementById("editArea");

// =========================
// カレンダー描画
// =========================
function renderCalendar() {

    // 毎回最新データを取得
    data = loadData();

    grid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthTitle.innerHTML = `${year}年${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 月初まで空白
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div></div>`;
    }

    // 今日の日付
    const today = new Date();

    // 日付生成
    for (let day = 1; day <= lastDate; day++) {

        const key =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // この日に作業記録があるか
        const hasRecord =
            data.records[key] &&
            data.records[key].length > 0;

        // 今日かどうか
        const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

        grid.innerHTML += `

<div
class="calendar-day
${hasRecord ? "work-day" : ""}
${isToday ? "today" : ""}"

onclick="showDetail('${key}')">

<div class="day-number">

${day}

</div>

${hasRecord ? '<div class="worked-dot"></div>' : ""}

</div>

`;

    }

}

// =========================
// 詳細表示
// =========================

function showDetail(date) {

    detailTitle.innerHTML = date;

    detailList.innerHTML = "";

    editArea.innerHTML = "";

    const list = data.records[date];

    if (!list) {

        detailList.innerHTML = `

<p class="small-text">

作業記録なし

</p>

`;

        return;

    }

    list.forEach((record, index) => {

        detailList.innerHTML += `
        <div class="record-item">

${record.start}

〜

${record.end}

<br>

${getProjectName(record.projectId)}

<br><br>

<button

onclick="editRecord('${date}',${index})"

>

✏️ 編集

</button>

</div>

`;

    });

}

// =========================
// 編集フォーム
// =========================

function editRecord(date,index){

    const record =
        data.records[date][index];

    editArea.innerHTML =

`

<div class="edit-box">

<h3>

記録編集

</h3>

<p>

開始時間

</p>

<input

id="editStart"

type="time"

value="${record.start}"

>

<p>

終了時間

</p>

<input

id="editEnd"

type="time"

value="${record.end}"

>

<p>

案件

</p>

<select id="editProject">

${

data.projects.map(project =>

`

<option

value="${project.id}"

${project.id === record.projectId ? "selected" : ""}

>

${project.name}

</option>

`

).join("")

}

</select>

<div class="edit-buttons">

<button

class="save-edit"

onclick="saveEdit('${date}',${index})"

>

保存

</button>

<button

class="delete-edit"

onclick="deleteRecord('${date}',${index})"

>

削除

</button>

</div>

</div>

`;

}

// =========================
// 編集保存
// =========================

function saveEdit(date,index){

    const record =
        data.records[date][index];

    record.start =
        document.getElementById("editStart").value;

    record.end =
        document.getElementById("editEnd").value;

    record.projectId =
        document.getElementById("editProject").value;

    saveData(data);

    renderCalendar();

    showDetail(date);

}

// =========================
// 削除
// =========================

function deleteRecord(date,index){

    const result =
        confirm("この記録を削除しますか？");

    if(!result){
        return;
    }

    data.records[date].splice(index,1);

    if(data.records[date].length === 0){

        delete data.records[date];

    }

    saveData(data);

    renderCalendar();

    showDetail(date);

}
// =========================
// 月移動
// =========================

document
.getElementById("prevMonth")
.onclick = ()=>{

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();

};

document
.getElementById("nextMonth")
.onclick = ()=>{

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();

};

// =========================
// 初期表示
// =========================

renderCalendar();