const taskTitle = $('#tasktitle');
const dueDate = $('#due-date');
const description = $('#description');
const form = $('#formModal');
const lane = $('.swim-lanes');

// Retrieve tasks and nextId from localStorage
function readStorage() {
let stringData = localStorage.getItem("tasks");
let taskList = JSON.parse(stringData) || [];
return taskList;
}

// create random unique id
function random() {
  let id = crypto.randomUUID()

  return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>');
  cardDeleteBtn
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(dueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(dueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const taskList = readStorage();

  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of taskList) {
    if (task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// Todo: create a function to handle adding a new task
function handleAddTask() {
  
  const taskTitle1 = taskTitle.val().trim();
  const description1 = description.val();
  const taskDate = dueDate.val(); // yyyy-mm-dd format

  const newTask = {
    id: random(),
    name: taskTitle1,
    type: description1,
    dueDate: taskDate,
    status: 'to-do',
  };
  let taskList = readStorage(); 
  taskList.push(newTask);
  localStorage.setItem('tasks', JSON.stringify( taskList));
  renderTaskList();
  taskTitle.val("");
  description.val("");
  dueDate.val("");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  const tasks = readStorage();

  tasks.forEach((task, i) => {
    if (task.id === taskId) {
      taskId.splice(i, 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify( tasks));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    const tasks = readStorage();
    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;
    for (let task of tasks) {
      if (task.id === taskId) {
        task.status = newStatus;
      }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
  }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
lane.on('click','.delete', handleDeleteTask);
form.on('click','.submit', function(event){
  event.preventDefault();
  handleAddTask();
  form.modal('hide');
});
$(document).ready(function () {
renderTaskList();
$('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop,
});
});




