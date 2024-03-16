// Save tasks to localStorage
function saveTasks() {
    var taskList = document.getElementById("taskList").innerHTML;
    var completedTaskList = document.getElementById("completedTaskList").innerHTML;
    localStorage.setItem("taskList", taskList);
    localStorage.setItem("completedTaskList", completedTaskList);
}

// Load tasks from localStorage
function loadTasks() {
    var taskList = localStorage.getItem("taskList");
    var completedTaskList = localStorage.getItem("completedTaskList");
    if (taskList) {
        document.getElementById("taskList").innerHTML = taskList;
    }
    if (completedTaskList) {
        document.getElementById("completedTaskList").innerHTML = completedTaskList;
    }
    attachEventListeners(); // Attach event listeners after loading tasks
}

// Attach event listeners to buttons
function attachEventListeners() {
    var completeButtons = document.querySelectorAll(".completeButton");
    completeButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            completeTask(this.parentNode);
        });
    });

    var undoButtons = document.querySelectorAll(".undoButton");
    undoButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            incompleteTask(this.parentNode);
        });
    });

    var deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            this.parentNode.remove();
            saveTasks();
        });
    });
}

// Call loadTasks when the page loads
window.onload = function() {
    loadTasks();
};

// Add Task function
function addTask() {
    var input = document.getElementById("taskInput").value;
    if (input !== '') {
        var li = document.createElement("li");

        var taskText = document.createElement("span");
        taskText.textContent = input;

        var completeButton = document.createElement("button");
        completeButton.appendChild(document.createTextNode("Complete"));
        completeButton.classList.add("completeButton");
        completeButton.onclick = function () {
            completeTask(li);
        };

        var timestamp = document.createElement("span");
        var now = new Date();
        var timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        var dateString = now.toLocaleDateString('en-US');
        timestamp.textContent = timeString + " " + dateString; // Add timestamp and date
        timestamp.classList.add("timestamp");

        var deleteButton = document.createElement("button");
        deleteButton.appendChild(document.createTextNode("X"));
        deleteButton.classList.add("deleteButton");
        deleteButton.onclick = function () {
            li.remove();
            saveTasks(); // Save tasks after deletion
        };

        li.appendChild(taskText);
        li.appendChild(completeButton);
        li.appendChild(timestamp); // Add timestamp
        li.appendChild(deleteButton); // Add delete button

        document.getElementById("taskList").appendChild(li);
        document.getElementById("taskInput").value = "";

        // Adding a delay of 300 milliseconds
        setTimeout(function () {
            li.style.opacity = "1";
        }, 300);

        // Fading in the newly added task
        li.style.opacity = "0";

        saveTasks(); // Save tasks after addition
    } else {
        alert("Please enter a task!");
    }
}

// Complete Task function
function completeTask(task) {
    var taskText = task.childNodes[0].textContent.trim();
    var timestampExists = task.querySelector(".timestamp");

    if (!timestampExists) {
        var timestamp = document.createElement("span");
        var now = new Date();
        var timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        var dateString = now.toLocaleDateString('en-US');
        timestamp.textContent = timeString + " " + dateString; // Add timestamp and date
        timestamp.classList.add("timestamp");
        task.appendChild(timestamp);
    }

    var undoButton = document.createElement("button");
    undoButton.appendChild(document.createTextNode("Undo"));
    undoButton.classList.add("undoButton"); // Corrected class name
    undoButton.onclick = function () {
        incompleteTask(task);
    };

    var deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("X"));
    deleteButton.classList.add("deleteButton");
    deleteButton.onclick = function () {
        task.remove();
        saveTasks(); // Save tasks after deletion
    };

    // Remove the existing complete button
    var existingCompleteButton = task.querySelector(".completeButton");
    existingCompleteButton.remove();

    // Remove the task text
    task.removeChild(task.childNodes[0]);

    // Add the task text back
    var taskTextNode = document.createTextNode(taskText);
    task.appendChild(taskTextNode);

    // Add undo button
    task.appendChild(undoButton);
    // Add delete button
    task.appendChild(deleteButton);

    // Move the completed task to the completed task list
    document.getElementById("completedTaskList").appendChild(task);

    saveTasks(); // Save tasks after completion
}

// Incomplete Task function
function incompleteTask(task) {
    // Remove complete button and timestamp
    var completeButton = task.querySelector(".undoButton"); // Corrected class name
    var timestamp = task.querySelector(".timestamp");
    completeButton.remove();
    timestamp.remove();

    // Remove any existing undo button
    var existingUndoButton = task.querySelector(".undoButton");
    if (existingUndoButton) {
        existingUndoButton.remove();
    }

    // Remove delete button if it exists
    var existingDeleteButton = task.querySelector(".deleteButton");
    if (existingDeleteButton) {
        existingDeleteButton.remove();
    }

    // Recreate complete button
    var newCompleteButton = document.createElement("button");
    newCompleteButton.appendChild(document.createTextNode("Complete"));
    newCompleteButton.classList.add("completeButton");
    newCompleteButton.onclick = function() {
        completeTask(task);
    };

    // Recreate delete button only if it doesn't exist
    if (!task.querySelector(".deleteButton")) {
        var newDeleteButton = document.createElement("button");
        newDeleteButton.appendChild(document.createTextNode("X"));
        newDeleteButton.classList.add("deleteButton");
        newDeleteButton.onclick = function() {
            task.remove();
            saveTasks();
        };
        
        task.appendChild(newDeleteButton); // Add delete button back
    }

    // Add complete button back
    task.appendChild(newCompleteButton);

    // Move task back to incomplete task list
    document.getElementById("taskList").appendChild(task);

    saveTasks();
}