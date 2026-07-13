/* =========================
 WORK LOG v1.0
 Common App
========================= */


// =========================
// 初期データ
// =========================

const defaultData = {

    projects: [
        {
            id: "project_001",
            name: "YouTube編集",
            color: "#D98FA1"
        },
        {
            id: "project_002",
            name: "DTP制作",
            color: "#8FBFD9"
        }
    ],


    records: {}

};




// =========================
// データ取得
// =========================

function loadData(){

    const saved =
        localStorage.getItem("WORK_LOG_DATA");


    if(saved){

        return JSON.parse(saved);

    }


    localStorage.setItem(

        "WORK_LOG_DATA",

        JSON.stringify(defaultData)

    );


    return structuredClone(defaultData);

}





// =========================
// データ保存
// =========================

function saveData(data){

    localStorage.setItem(

        "WORK_LOG_DATA",

        JSON.stringify(data)

    );

}





// =========================
// 日付キー取得
// =========================

function getDateKey(date = new Date()){


    return (

        date.getFullYear()

        +

        "-"

        +

        String(date.getMonth()+1)
        .padStart(2,"0")

        +

        "-"

        +

        String(date.getDate())
        .padStart(2,"0")

    );


}





// =========================
// 案件名取得
// =========================

function getProjectName(id){


    const data = loadData();


    const project =
        data.projects.find(
            p => p.id === id
        );


    return project
        ? project.name
        : "未設定";


}





// =========================
// 時間計算
// =========================

function calculateMinutes(start,end){


    const startTime =
        start.split(":");


    const endTime =
        end.split(":");



    const startMinutes =
        Number(startTime[0]) * 60
        +
        Number(startTime[1]);



    const endMinutes =
        Number(endTime[0]) * 60
        +
        Number(endTime[1]);



    return endMinutes - startMinutes;


}





// =========================
// 分→時間表示
// =========================

function formatMinutes(minutes){

    const hours = (minutes / 60).toFixed(1);

    return `${hours}時間`;

}





// =========================
// 月合計
// =========================

function getMonthlyTotal(year,month){


    const data =
        loadData();


    let total = 0;



    Object.keys(data.records)
    .forEach(key=>{


        const date =
            new Date(key);



        if(

            date.getFullYear()
            ===
            year

            &&

            date.getMonth()
            ===
            month

        ){


            data.records[key]
            .forEach(record=>{


                total += calculateMinutes(

                    record.start,

                    record.end

                );


            });


        }


    });



    return total;


}





// =========================
// PWA
// =========================

if(
    "serviceWorker" in navigator
){


window.addEventListener(
"load",

()=>{


navigator.serviceWorker.register(
"service-worker.js"

)

.then(()=>{

console.log(
"WORK LOG PWA Ready"
);

});


});


}