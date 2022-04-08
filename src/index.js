let projects = new Array;

//Adds event listener to progress bar
function progressBar() {
    const progress = document.querySelectorAll(".progress");
    progress.forEach(element => {
        element.addEventListener("mouseover", hoverProgress);
        element.addEventListener("mousedown", selectProgress);
    });
}

//Sets the project progress case to lightgray base on mouse hover event
function hoverProgress() {
    const target = event.target;
    const progressBar = target.parentElement.children;
    let targetIndex = 0;
    for (let index in progressBar) {
        if (progressBar[index] === target) {
            targetIndex = index;
        }
    }
    for (let i = 0; i < progressBar.length; i++) {
        if (progressBar[i].style.backgroundColor === "gray") {
            continue;
        } else if (i <= targetIndex) {
            progressBar[i].style.backgroundColor = "lightgray";
        } else {
            progressBar[i].style.backgroundColor = "transparent";
        }
    }
}

//Sets the project progress case to gray base on mousedown event
function selectProgress() {
    const target = event.target;
    const progressBar = target.parentElement.children;
    let targetIndex = 0;
    for (let index in progressBar) {
        if (progressBar[index] === target) {
            targetIndex = index;
        }
    }
    for (let i = 0; i < progressBar.length; i++) {
        if (i <= targetIndex) {
            progressBar[i].style.backgroundColor = "gray";
        } else {
            progressBar[i].style.backgroundColor = "transparent";
        }
    }
}

//Removes project from DOM and local storage
function removeProject(project) {
    //Removes project from DOM
    const projectTarget = (project.className === "project") ? project : event.target.parentElement.parentElement.parentElement;
    const projectId = projectTarget.children[2].firstChild.innerText;
    projectTarget.remove();
    //Removes project from local storage
    localStorage.removeItem(projectId);
    //Removes project from local storage project keys
    keys = localStorage.projectKeys.replace(projectId, "");
    localStorage.projectKeys = keys;
    storageCleanUp();
}

//Displays project menu
function displayProjectMenu() {

    const dashboard = document.getElementById("dashboard");

    if (document.getElementById("add-project-menu") === null) {
        const projectMenu = document.createElement("div");
        projectMenu.id = "add-project-menu";
        projectMenu.className = "add-project-menu";

        const title = document.createElement("input");
        title.type = "text";
        title.id = "title";
        title.placeholder = "Project title";

        const description = document.createElement("input");
        description.type = "text";
        description.id = "description";
        description.placeholder = "Project description";

        const status = document.createElement("div");
        status.id = "status";
        const statusLabel = document.createElement("label");
        statusLabel.name = "status";
        statusLabel.innerText = "Status: ";
        const progressBar = document.createElement("div");
        progressBar.id = "progress-bar";
        for (let i = 0; i < 20; i++) {
            const progress = document.createElement("div");
            progress.className = "progress";
            progressBar.appendChild(progress);
        }

        status.appendChild(statusLabel);
        status.appendChild(progressBar);

        const startDate = document.createElement("div");
        startDate.id = "start-date";
        const startDateLabel = document.createElement("label");
        startDateLabel.name = "start-date";
        startDateLabel.innerText = "Starting date:";
        const startDateInput = document.createElement("input");
        startDateInput.type = "date";
        startDateInput.name = "start-date";

        startDate.appendChild(startDateLabel);
        startDate.appendChild(startDateInput);

        const dueDate = document.createElement("div");
        dueDate.id = "due-date";
        const dueDateLabel = document.createElement("label");
        dueDateLabel.name = "due-date";
        dueDateLabel.innerText = "Due date:";
        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.name = "due-date";

        dueDate.appendChild(dueDateLabel);
        dueDate.appendChild(dueDateInput);

        const actionMenu = document.createElement("div");
        actionMenu.id = "action-menu";

        const add = document.createElement("div");
        add.className = "action";
        add.id = "add";
        add.addEventListener("mousedown", addProject);
        const addIcon = document.createElement("img");
        addIcon.src = "plus.svg";
        add.appendChild(addIcon);

        const del = document.createElement("div");
        del.className = "action";
        del.id = "delete";
        del.addEventListener("mousedown", resetProjectMenu);
        const delIcon = document.createElement("img");
        delIcon.src = "back.svg";
        del.appendChild(delIcon);

        actionMenu.appendChild(add);
        actionMenu.appendChild(del);

        projectMenu.appendChild(title);
        projectMenu.appendChild(description);
        projectMenu.appendChild(status);
        projectMenu.appendChild(startDate);
        projectMenu.appendChild(dueDate);
        projectMenu.appendChild(actionMenu);

        const separator = document.createElement("div");
        separator.className = "separator-h"

        dashboard.prepend(separator);
        dashboard.prepend(projectMenu);
    } else {
        removeProjectMenu();
    }

    progressBar();

}

//Removes project menu when 'add' or 'delete' buttons are clicked
function removeProjectMenu() {
    const projectMenu = document.getElementById('add-project-menu');
    const separator = document.getElementsByClassName('separator-h')[0];
    projectMenu.remove();
    separator.remove();
}

//Assigns project to an instance of Project
function addProject() {
    const title = document.getElementById("title").value;
    if (title != '') {
        const description = document.getElementById("description").value;
        const status = (function() {
            const progressBar = document.getElementsByClassName("progress");
            let value = 0;
            for (let i of progressBar) {
                if (i.style.backgroundColor === "gray") {
                    value +=1;
                }
            }
            return value;
        })();
        const startingDate = document.getElementById("start-date").children[1].value;
        const dueDate = document.getElementById("due-date").children[1].value;
        
        project = new Project(); 
        project.setTitle(title);
        project.setDescription(description);
        project.setStatus(status);
        project.setStatingDate(startingDate);
        project.setDueDate(dueDate);

        projects.push(project);
        localStorage.projects = projects;
        storeProject(title, description, status, startingDate, dueDate);
        displayProject(title, description, status, startingDate, dueDate);

        resetProjectMenu('', '', 0, '', '');
    }
}

//Resets project menu to blank fields
function resetProjectMenu(event, title='', description='', statu=0, startingDate='', dueDate='') {
    const projectMenu = document.getElementById("add-project-menu");
    projectMenu.children[0].value = title;
    projectMenu.children[1].value = description;
    projectMenu.children[3].children[1].value = startingDate;
    projectMenu.children[4].children[1].value = dueDate;
    const progressBar = document.getElementsByClassName("progress");
    for (let i = 0; i < progressBar.length; i++) {
        progressBar[i].style.backgroundColor = (i < status) ? "gray" : "";
    }
}

//Stores project and project key to local storage
function storeProject(title, description, status, startingDate, dueDate) {
    let projectData = [];

    projectData.push(title);
    projectData.push(description);
    projectData.push(status);
    projectData.push(startingDate);
    projectData.push(dueDate);

    localStorage.setItem(project.getTitle(), projectData);
    localStorage.projectKeys += title + ';';
}

//Displays project. Called by project menu or local storage when loaded
function displayProject(title, description, status, startingDate, dueDate) {
    const projectElement = document.createElement("div");
    projectElement.className = "project";

    const checkBox = document.createElement("label");
    checkBox.className = "checkbox";
    const checkBoxInput = document.createElement("input");
    checkBoxInput.type = "checkbox";
    const checkBoxSpan = document.createElement("span");
    checkBoxSpan.className = "checkmark";
    checkBox.appendChild(checkBoxInput);
    checkBox.appendChild(checkBoxSpan);

    const separator = document.createElement("div");
    separator.className = "separator-v";

    const projectDetail = document.createElement("div");
    projectDetail.className = "project-detail";

    const projectTitle = document.createElement("div");
    projectTitle.className = "project-title";
    projectTitle.innerText = title;
    const projectDescription = document.createElement("div");
    projectDescription.className = "project-description";
    projectDescription.innerText = description;
    const projectProgress = status;
    const projectStatusBar = document.createElement("div");
    projectStatusBar.className = "progress-bar-unselectable";
    for (let i = 0; i < 20; i++) {
        const projectProgress = document.createElement("div");
        projectProgress.className = "progress-unselectable";
        projectStatusBar.appendChild(projectProgress);
    }
    for (let i = 0; i < projectStatusBar.children.length; i++) {
        if (i < projectProgress) {
            projectStatusBar.children[i].style.backgroundColor = "gray";
        }
    }
    const projectStartDate = document.createElement("div");
    projectStartDate.className = "project-start-date";
    projectStartDate.innerText = startingDate;
    const projectDueDate = document.createElement("div");
    projectDueDate.className = "project-due-date";
    projectDueDate.innerText = dueDate;

    projectDetail.appendChild(projectTitle);
    projectDetail.appendChild(projectDescription);
    projectDetail.appendChild(projectStatusBar);
    projectDetail.appendChild(projectStartDate);
    projectDetail.appendChild(projectDueDate);

    const actionMenu = document.createElement("div");
    actionMenu.className = "action-menu";

    const edit = document.createElement("div");
    edit.className = "action";
    const editIcon = document.createElement("img");
    editIcon.src = "edit.svg";

    const del = document.createElement("div");
    del.className = "action";
    const delIcon = document.createElement("img");
    delIcon.src = "delete.svg";

    const add = document.createElement("div");
    add.className = "action";
    const addIcon = document.createElement("img");
    addIcon.src = "plus.svg";

    edit.appendChild(editIcon);
    del.appendChild(delIcon);
    add.appendChild(addIcon);

    del.addEventListener("mousedown", removeProject);
    edit.addEventListener("mousedown", editProject);
    add.addEventListener("mousedown", addTask);

    actionMenu.appendChild(edit);
    actionMenu.appendChild(del);
    actionMenu.appendChild(add);

    projectElement.appendChild(checkBox);
    projectElement.appendChild(separator);
    projectElement.appendChild(projectDetail);
    projectElement.appendChild(actionMenu);

    if (document.getElementById("todo-list") === null) {
        const todoList = document.createElement("div");
        todoList.id = "todo-list";
        todoList.appendChild(projectElement);
        const dashboard = document.getElementById("dashboard");
        dashboard.appendChild(todoList);
    } else {
        const todoList = document.getElementById("todo-list");
        todoList.appendChild(projectElement);
    }
}

//Project object
const Project = (function() {

    const properties = {
        title: "title",
        description: "description",
        status: 0,
        startingDate: '',
        dueDate: '',
        tasks: []
    }

    const getTitle = () => properties.title;
    const getDescription = () => properties.description;
    const getStatus = () => properties.status;
    const getStartingDate = () => properties.startingDate;
    const getDueDate = () => properties.dueDate;
    const getTasks = () => properties.tasks;

    const setTitle = title => properties.title = title;
    const setDescription = description => properties.description = description;
    const setStatus = status => properties.status = status;
    const setStatingDate = startingDate => properties.startingDate = startingDate;
    const setDueDate = dueDate => properties.dueDate = dueDate;
    const setTasks = tasks => properties.tasks = tasks;

    return function(title, description, status, startingDate, dueDate, tasks) {

        properties.title = title;
        properties.description = description;
        properties.status = status;
        properties.startingDate = startingDate;
        properties.dueDate = dueDate;
        properties.tasks = tasks;

        return {
            setTitle,
            setDescription,
            setStatus,
            setStatingDate,
            setDueDate,
            setTasks,
            getTitle,
            getDescription,
            getStatus,
            getStartingDate,
            getDueDate,
            getTasks
        };
    };

})();

//Load projects from local storage
function loadProjects() {
    storageCleanUp();
    const keys = localStorage.projectKeys.split(';');
    for (let i of keys) {
        let test = checkProjectList(i);
        if (test === true) {
            continue;
        } else {
            const data = localStorage.getItem(i).split(',');
            displayProject(data[0], data[1], data[2], data[3], data[4]);
        }
    }
}

//Checks wether project is already displayed. Called by loadProjects.
function checkProjectList(key) {
    projects = document.getElementsByClassName("project-title");
    let result = null;
    for (let i of projects) {
        result = (i.innerText === key) ? true : false;
    }
    return result;
}

//Database initialization on pageload
function storageInit() {
    if (localStorage.projectKeys === undefined) {
        localStorage.projectKeys += '';
        const keys = localStorage.projectKeys.replace('undefined', '');
        localStorage.projectKeys = keys;
    }
}

//Database cleanup on project load and project storage
function storageCleanUp() {
    let keys = localStorage.projectKeys;
    keys = keys.replace(";;", ";");
    if (keys[0] === ";") {
        keys = keys.replace(";", "");
    }
    localStorage.projectKeys = keys;
}

//Edit project by removing from project list and moves project content to project menu
function editProject() {
    //Adds project by default if user tries to edit another project
    if (document.getElementById("title") != '' && document.getElementById("add-project-menu") != null) {
        addProject();
    }
    //Retrieves projects fields content
    const project = event.target.parentElement.parentElement.parentElement;
    const title = project.children[2].children[0].innerText;
    const description = project.children[2].children[1].innerText;
    const status = (function() {
        const progressBar = project.querySelectorAll(".progress-unselectable");
        let value = 0;
        for (let i of progressBar) {
            if (i.style.backgroundColor === "gray") {
                value +=1;
            }
        }
        return value;        
    })();
    const startingDate = project.children[2].children[3].innerText;
    const dueDate = project.children[2].children[4].innerText;
    //Displays project menu if not already opened
    if (document.getElementById("add-project-menu") === null) {
        displayProjectMenu();
    }
    //Resets project menu with selected project values
    resetProjectMenu(title, description, status, startingDate, dueDate);
    //Removes project from database to avoid double entries
    removeProject(project);
}

//Delete selected projects
function deleteSelected() {
    const selectedProjects = document.querySelectorAll(".project");
    for (let i of selectedProjects) {
        checkbox = window.getComputedStyle(i.firstChild.children[1], '::after').getPropertyValue('display')
        if (checkbox === "block") {
            removeProject(i);
        }
    }
}

function addTask() {

}

storageInit();