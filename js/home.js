/* =========================
 WORK LOG v1.0
 Home (完全版：ブラウザ閉鎖・日付またぎ対策済)
========================= */

let data = loadData();

const todayElement = document.getElementById("today");
const projectSelect = document.getElementById("projectSelect");
const timerElement = document.getElementById("timer");
const statusElement = document.getElementById("status");
const workButton = document.getElementById("workButton");
const recordsElement = document.getElementById("todayRecords");
const monthTotalElement = document.getElementById("monthTotal");

let working = false;
let startTime = null;
let timerId = null;

// =========================
// 日付表示
// =========================
const now = new Date();
todayElement.innerHTML = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;

// =========================
// 案件表示
// =========================
function loadProjects(){
    projectSelect.innerHTML="";
    data.projects.forEach(project=>{
        projectSelect.innerHTML += `
        <option value="${project.id}">
        ${project.name}
        </option>
        `;
    });
}
loadProjects();

// =========================
// 出勤・退勤
// =========================
workButton.onclick = ()=>{
    if(!working){
        startWork();
    }else{
        finishWork();
    }
};

function startWork(){
    working = true;
    startTime = new Date();

    // ✅ 出勤状態と出勤時間をブラウザに保存（ブラウザ閉じ対策）
    localStorage.setItem("working_status", "true");
    localStorage.setItem("working_start_time", startTime.toISOString());
    localStorage.setItem("working_project_id", projectSelect.value);

    workButton.innerHTML = "■ 退勤する";
    workButton.className = "btn btn-work";
    statusElement.innerHTML = "作業中";

    updateTimer();
    timerId = setInterval(updateTimer,1000);
}

function finishWork(){
    working = false;
    clearInterval(timerId);
    const endTime = new Date();
    
    // ✅ 日付またぎ対策：退勤日ではなく「出勤した日」を基準にキーを作成
    let key;
    try {
        // 既存の getDateKey が引数を受け取れる設計ならそれを使用
        key = getDateKey(startTime);
    } catch(e) {
        // エラーが出た場合は自動で YYYY-MM-DD 形式のキーを作成
        key = `${startTime.getFullYear()}-${String(startTime.getMonth() + 1).padStart(2, "0")}-${String(startTime.getDate()).padStart(2, "0")}`;
    }

    if(!data.records[key]){
        data.records[key]=[];
    }

    data.records[key].push({
        id:Date.now(),
        projectId: projectSelect.value,
        start: formatTime(startTime),
        end: formatTime(endTime),
        memo:""
    });

    saveData(data);

    // ✅ 退勤したので保存していた出勤状態を削除
    localStorage.removeItem("working_status");
    localStorage.removeItem("working_start_time");
    localStorage.removeItem("working_project_id");

    workButton.innerHTML = "▶ 出勤する";
    workButton.className = "btn btn-primary";
    statusElement.innerHTML = "待機中";
    timerElement.innerHTML = "00:00:00";

    loadRecords();
    updateMonth();
}

// =========================
// タイマー
// =========================
function updateTimer(){
    const now = new Date();
    const diff = now - startTime;
    const sec = Math.floor(diff / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    timerElement.innerHTML = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// =========================
// 記録表示
// =========================
function loadRecords(){
    const key = getDateKey();
    const list = data.records[key];
    recordsElement.innerHTML="";

    if(!list || list.length===0){
        recordsElement.innerHTML = `
        <p class="small-text">
        まだ記録がありません
        </p>
        `;
        return;
    }

    list.forEach(record=>{
        recordsElement.innerHTML += `
        <div class="record-item">
        ${record.start} 〜 ${record.end}
        <br>
        ${getProjectName(record.projectId)}
        </div>
        `;
    });
}

// =========================
// 月合計
// =========================
function updateMonth(){
    const date = new Date();
    const total = getMonthlyTotal(date.getFullYear(), date.getMonth());
    monthTotalElement.innerHTML = formatMinutes(total);
}

function formatTime(date){
    return (
        String(date.getHours()).padStart(2,"0")
        + ":" +
        String(date.getMinutes()).padStart(2,"0")
    );
}

// =========================
// ✅ ページ読み込み時の復元処理
// =========================
function restoreWorkingStatus(){
    const savedStatus = localStorage.getItem("working_status");
    const savedStartTime = localStorage.getItem("working_start_time");
    const savedProjectId = localStorage.getItem("working_project_id");

    if (savedStatus === "true" && savedStartTime) {
        working = true;
        startTime = new Date(savedStartTime); 
        
        if (savedProjectId) {
            projectSelect.value = savedProjectId;
        }

        workButton.innerHTML = "■ 退勤する";
        workButton.className = "btn btn-work";
        statusElement.innerHTML = "作業中";

        updateTimer();
        timerId = setInterval(updateTimer, 1000);
    }
}

// 初期表示と状態復元
loadRecords();
updateMonth();
restoreWorkingStatus();