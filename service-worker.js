/* =========================
 WORK LOG v1.0
 Service Worker
========================= */


const CACHE_NAME =

"WORK_LOG_v1";




const FILES_TO_CACHE = [


"./",


"./index.html",

"./calendar.html",

"./monthly.html",

"./projects.html",

"./settings.html",



"./css/style.css",



"./js/app.js",

"./js/home.js",

"./js/calendar.js",

"./js/monthly.js",

"./js/projects.js",

"./js/settings.js",



"./manifest.json"


];









// =========================
// インストール
// =========================


self.addEventListener(

"install",

(event)=>{


event.waitUntil(


caches.open(CACHE_NAME)

.then(cache=>{


return cache.addAll(

FILES_TO_CACHE

);


})


);


}

);









// =========================
// 起動時
// =========================


self.addEventListener(

"activate",

(event)=>{


event.waitUntil(


caches.keys()

.then(keys=>{


return Promise.all(


keys.map(key=>{


if(

key !== CACHE_NAME

){


return caches.delete(key);


}



})


);


})


);


}

);









// =========================
// ファイル取得
// =========================


self.addEventListener(

"fetch",

(event)=>{


event.respondWith(


caches.match(

event.request

)

.then(response=>{


return response ||

fetch(event.request);


})


);


}

);