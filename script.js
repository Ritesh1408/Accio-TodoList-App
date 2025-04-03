let today = [];
let future = [];
let complete = [];

const taskDetail = document.querySelector('.task_detail');
const dateInput = document.querySelector('.date');
const priorityInput = document.getElementById('priority');
const mainBtn = document.getElementById('main_btn');

function toSortByPriority(task) {
    return task.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify([...today, ...future, ...complete]));
}

function retrieveFromLocalStorage() {
    const storedData = JSON.parse(localStorage.getItem('todoList')) || [];
    today = [];
    future = [];
    complete = [];
    const todayDate = new Date().setHours(0, 0, 0, 0);

    storedData.forEach(item => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
        if (!item.complete && itemDate === todayDate) today.push(item);
        else if (!item.complete && itemDate > todayDate) future.push(item);
        else complete.push(item);
    });
}

window.addEventListener('load', () => {
    retrieveFromLocalStorage();
    renderTodo();
});

mainBtn.addEventListener('click', () => {
    const selectedDate = new Date(dateInput.value).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);

    if (!taskDetail.value || !dateInput.value || !priorityInput.value) {
        alert('Please enter all details');
        return;
    }

    const newTask = { name: taskDetail.value, date: selectedDate, priority: priorityInput.value, complete: false };

    if (selectedDate > todayDate) future.push(newTask);
    else if (selectedDate === todayDate) today.push(newTask);
    else return alert('You cannot enter a past date');

    updateLocalStorage();
    renderTodo();
});

function renderTodo() {
    let todayContainer = document.querySelector('.today_box_container');
    let futureContainer = document.querySelector('.future_box_container');
    let completeContainer = document.querySelector('.completed_box_container');

    if (!todayContainer || !futureContainer || !completeContainer) {
        console.error("Container elements not found.");
        return;
    }

    // Clear existing tasks
    todayContainer.innerHTML = '';
    futureContainer.innerHTML = '';
    completeContainer.innerHTML = '';

    appendTasks(toSortByPriority(today), todayContainer, 'today');
    appendTasks(toSortByPriority(future), futureContainer, 'future');
    appendTasks(toSortByPriority(complete), completeContainer, 'complete');
}

function appendTasks(taskList, container, type) {
    taskList.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('box_body', 'fade-in');
        taskElement.innerHTML = `
            <div class="body_item1">${index + 1}. ${task.name}</div>
            <div class="body_item2">${formatDate(task.date)}</div>
            <div class="body_item3">${capitalizeFirstLetter(task.priority)}</div>
            <div class="body_item4">
                ${type !== 'complete' ? `<img src="check.svg" class="complete" data-type="${type}" data-index="${index}">` : ''}
                <img src="del.png" class="delete" data-type="${type}" data-index="${index}">
            </div>`;
        container.appendChild(taskElement);
    });
    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll('.complete').forEach(button => {
        button.addEventListener('click', function () {
            moveToComplete(this.dataset.type, this.dataset.index);
        });
    });

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function () {
            deleteTask(this.dataset.type, this.dataset.index);
        });
    });
}


function moveToComplete(type, index) {
    index = Number(index); 
    let taskList = type === 'today' ? today : future;

    if (!taskList || index < 0 || index >= taskList.length) {
        console.log("Invalid task index. Please try again.");
        return;
    }

    // Move task to the completed list
    const task = taskList.splice(index, 1)[0];

    if (task) {
        task.complete = true;
        complete.push(task);
        updateLocalStorage();
        renderTodo();
        alert("Task marked as completed ✅");
    }
}



function deleteTask(type, index) {
    const list = type === 'today' ? today : type === 'future' ? future : complete;
    list.splice(index, 1);
    updateLocalStorage();
    renderTodo();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB');
}
