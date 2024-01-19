//fetch addButton
const addTaskBtn = document.getElementById("add-btn");
const notifyButton = document.querySelector(".allow_nofication");

//create our Indb
const openRequest = indexedDB.open("todoApp", 2);
//add objectStore(table)
openRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
  objectStore.createIndex('notifiedIndex', "notified", { unique: false });
};
let db;
openRequest.onsuccess = function (event) {
  db = event.target.result;
  // console.log(db);
  //add task to indexed DB
  function addTask(task) {
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks");
    const request = objectStore.add(task);

    request.onsuccess = function (event) {
      const generatedId = event.target.result;
      task.id= generatedId;
      console.log("task added sucessfully",generatedId);
    };
    request.onerror = function () {
      console.log("error adding task");
    };
  }
  //delete task from indexed DB
  function deleteTask(taskId) {
    const transaction = db.transaction(["tasks"], "readwrite");
    const objectStore = transaction.objectStore("tasks");
    const request = objectStore.delete(taskId);

    request.onsuccess = function () {
      console.log("task deleted sucessfuly");
    };
    request.onerror = function () {
      console.log("error deleteing this task");
    };
  }
  //fetch tasks from IndexedDB and show on ul
  function getAllTasks() {
    const transaction = db.transaction(["tasks"], "readonly");
    const objectStore = transaction.objectStore("tasks");
    const request = objectStore.getAll();

    request.onsuccess = function () {
      const tasks = request.result;
      const taskList = document.getElementById("my-tasks");
      taskList.innerHTML = "";

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.name;

        if (task.notified) {
          li.classList.add("completed");
        }

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteBtn");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", function () {
          deleteTask(task.id);
          taskList.removeChild(li);
        });

        li.appendChild(deleteButton);
        taskList.appendChild(li);
      });
    };
    request.onerror = function () {
      console.log("error getting tasks from Indexed DB");
    };
  }
  //get inputs value and add to ul & push object to addTask function
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
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "X";

    deleteButton.addEventListener("click", function () {
      deleteTask(newtask.id);
      taskList.removeChild(li);
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
  function checkAndNotifyTasks() {
      const transaction = db.transaction(['tasks'], 'readonly');
      const objectStore = transaction.objectStore('tasks');
      const getAllRequest = objectStore.getAll();
      // console.log(getAllRequest)
      getAllRequest.onsuccess=function(){
        const tasks=getAllRequest.result;
        tasks.forEach(task=>{
          if(!task.notified && new Date(task.date)<= new Date()){
            notifyUser(task.name);
            task.notified=true;
            const updateTransaction = db.transaction(['tasks'], 'readwrite');
            const updateStore = updateTransaction.objectStore('tasks');
            const updateRequest = updateStore.put(task);
            getAllTasks();//call this function again to add line through task title
            updateRequest.onerror = function() {
              console.error('Error updating task in IndexedDB');
            };
          }
        });
      };
      getAllRequest.onerror=function(){
        console.error('Error retrieving tasks from IndexedDB');
      };
  }
  function notifyUser(taskName){
    if (Notification.permission === 'granted') {
      const notification = new Notification(`Task Due: ${taskName}`, {
        body: 'This task is now due!',
      });
    }
  }
  // Request permission and check tasks periodically
  if ('Notification' in window && Notification.permission !== 'denied') {
    setInterval(checkAndNotifyTasks, 60000); // Check every minute
  }
  // Display tasks from IndexedDB on page load
  getAllTasks();
};

//handle allow notification button
function displayNotification() {
      Notification.requestPermission(status=>{
          console.log('Notification permission',status)
      });
      notifyButton.classList.add('hidden')
}
notifyButton.addEventListener('click', () => {
      displayNotification();
});
