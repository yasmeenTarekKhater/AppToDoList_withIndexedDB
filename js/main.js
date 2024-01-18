//fetch addButton
const addTaskBtn = document.getElementById("add-btn");

//create our Indb
const openRequest = indexedDB.open("todoApp", 2);
//add objectStore(table)
openRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
  objectStore.createIndex("notifiedIndex", "notified", { unique: false });
};

openRequest.onsuccess = function (event) {
  const db = event.target.result;
  // console.log(db);
  //add task to indexed DB
  function addTask(task) {
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks");
    const request = objectStore.add(task);

    request.onsuccess = function () {
      console.log("task added sucessfully");
    };
    request.onerror = function () {
      console.log("error adding task");
    };
  }
  addTaskBtn.addEventListener("click", function () {
    const taskName = document.getElementById("task_title").value;
    const taskHours = document.getElementById("task_hours").value;
    const taskMinutes = document.getElementById("task_mins").value;
    const taskDay = document.getElementById("task_day").value;
    const taskMonth = document.getElementById("months").value;
    const taskYear = document.getElementById("year").value;
    const newtask = {
      name: taskName,
      date: new Date(taskYear, taskMonth, taskDay, taskHours, taskMinutes),
      notified: false,
    };
    // console.log(newtask);
    addTask(newtask);
    const taskList = document.getElementById("my-tasks");
    const li = document.createElement("li");
    li.textContent = taskName;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";

    li.appendChild(deleteButton);
    taskList.appendChild(li);
});
};

// const app = (() => {
//     'use strict';
//     let swRegistration = null;

//     const notifyButton = document.querySelector('.allow_nofication');

//     // TODO 2.1 - check for notification support
//     function displayNotification() {
//       // TODO 2.2 - request permission to show notifications
//     Notification.requestPermission(status=>{
//         console.log('Notification permission ,',status)
//       })
//       // TODO 2.3 - display a Notification
//       if(Notification.permission == 'granted'){
//         navigator.serviceWorker.getRegistration().then(reg=>{
//           const options={
//             body:'any msg',
//             icon:'../images/notification-flat.png',
//             data:{
//               dateOfArrival:Date.now(),
//               primaryKey:1
//             }}
//           reg.showNotification('Hello World!',options)
//         });
//       }
//     }
//     notifyButton.addEventListener('click', () => {
//       displayNotification();
//     });

//     if ('serviceWorker' in navigator) {
//       window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js')
//         .then(swReg => {
//           console.log('Service Worker is registered', swReg);
//           swRegistration = swReg;
//         })
//         .catch(err => {
//           console.error('Service Worker Error', err);
//         });
//       });
//     } else {
//       console.warn('Push messaging is not supported');
//     }

//   })();
