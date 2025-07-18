     let lists = [
    { id: 'all', name: 'All Tasks', tasks: [] },
    { id: 'important', name: 'Important', tasks: [] },
    // Custom lists will be added here
];

// Task object structure:
// { id: 'uniqueId', name: 'Task Name', completed: false, important: false, listId: 'listId' }
    document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const customListsContainer = document.getElementById('custom-lists-container');
    const newListInput = document.getElementById('new-list-input');
    const addListBtn = document.getElementById('add-list-btn');
    const currentListTitle = document.getElementById('current-list-title');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');

    let lists = [];
    let currentListId = 'all'; // Default to 'All Tasks'
    let currentFilter = 'all'; // Default filter

    // --- Utility Functions ---
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveData() {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    }

    function loadData() {
        const storedLists = localStorage.getItem('todoLists');
        if (storedLists) {
            lists = JSON.parse(storedLists);
            // Ensure 'all' and 'important' lists exist if loaded data somehow doesn't have them
            if (!lists.find(list => list.id === 'all')) {
                lists.unshift({ id: 'all', name: 'All Tasks', tasks: [] });
            }
            if (!lists.find(list => list.id === 'important')) {
                lists.splice(1, 0, { id: 'important', name: 'Important', tasks: [] });
            }
        } else {
            lists = [
                { id: 'all', name: 'All Tasks', tasks: [] },
                { id: 'important', name: 'Important', tasks: [] }
            ];
        }
    }

    // --- List Management ---
    function addList(name) {
        if (!name.trim()) return;
        const newList = { id: generateUniqueId(), name: name.trim(), tasks: [] };
        lists.push(newList);
        saveData();
        renderLists();
        newListInput.value = '';
        switchList(newList.id);
    }

    function deleteList(listId) {
        if (listId === 'all' || listId === 'important') return; // Prevent deleting default lists
        lists = lists.filter(list => list.id !== listId);
        // Also remove tasks associated with this list from 'all' and 'important' views if they originated here
        lists.forEach(list => {
            if (list.id === 'all' || list.id === 'important') {
                list.tasks = list.tasks.filter(task => task.listId !== listId);
            }
        });

        saveData();
        renderLists();
        if (currentListId === listId) {
            switchList('all'); // Go back to 'All Tasks' if the current list was deleted
        }
    }

    function renderLists() {
        const defaultListsContainer = sidebar.querySelector('.list-nav');
        defaultListsContainer.innerHTML = `
            <li class="nav-item ${currentListId === 'all' ? 'active' : ''}" data-list-id="all">
                <i class="fas fa-home"></i> All Tasks
            </li>
            <li class="nav-item ${currentListId === 'important' ? 'active' : ''}" data-list-id="important">
                <i class="fas fa-star"></i> Important
            </li>
        `;
        customListsContainer.innerHTML = ''; // Clear previous custom lists

        lists.filter(list => list.id !== 'all' && list.id !== 'important').forEach(list => {
            const listItem = document.createElement('li');
            listItem.className = `nav-item ${currentListId === list.id ? 'active' : ''}`;
            listItem.dataset.listId = list.id;
            listItem.innerHTML = `
                <span>${list.name}</span>
                <button class="delete-list-btn" data-list-id="${list.id}"><i class="fas fa-trash"></i></button>
            `;
            customListsContainer.appendChild(listItem);
        });

        // Add event listeners for list switching
        document.querySelectorAll('.nav-item').forEach(item => {
            item.removeEventListener('click', handleListSwitch); // Remove old to prevent duplicates
            item.addEventListener('click', handleListSwitch);
        });

        // Add event listeners for delete custom list buttons
        document.querySelectorAll('.delete-list-btn').forEach(btn => {
            btn.removeEventListener('click', handleDeleteList);
            btn.addEventListener('click', handleDeleteList);
        });
    }

    function handleListSwitch(event) {
        // Prevent event bubbling from delete button
        if (event.target.closest('.delete-list-btn')) return;

        const listItem = event.currentTarget;
        const listId = listItem.dataset.listId;
        switchList(listId);
    }

    function handleDeleteList(event) {
        event.stopPropagation(); // Prevent list switch when deleting
        const listIdToDelete = event.currentTarget.dataset.listId;
        if (confirm('Are you sure you want to delete this list and all its tasks?')) {
            deleteList(listIdToDelete);
        }
    }

    function switchList(listId) {
        currentListId = listId;
        currentFilter = 'all'; // Reset filter when switching lists
        filterAllBtn.classList.add('active');
        filterActiveBtn.classList.remove('active');
        filterCompletedBtn.classList.remove('active');

        const selectedList = lists.find(list => list.id === listId);
        if (selectedList) {
            currentListTitle.textContent = selectedList.name;
        } else if (listId === 'all') {
            currentListTitle.textContent = 'All Tasks';
        } else if (listId === 'important') {
            currentListTitle.textContent = 'Important';
        }

        renderLists(); // Update active class in sidebar
        renderTasks();
    }

    // --- Task Management ---
    function addTask(taskName) {
        if (!taskName.trim()) return;

        const newTask = {
            id: generateUniqueId(),
            name: taskName.trim(),
            completed: false,
            important: false,
            listId: currentListId === 'all' || currentListId === 'important' ? 'default' : currentListId // Track original list for 'All Tasks' view
        };

        // Add to the specific list
        const targetList = lists.find(list => list.id === currentListId);
        if (targetList && targetList.id !== 'all' && targetList.id !== 'important') {
            targetList.tasks.push(newTask);
        } else if (targetList && (targetList.id === 'all' || targetList.id === 'important')) {
             // If adding from 'All Tasks' or 'Important', add to a default/main list (e.g., 'Tasks' if you had one)
             // For simplicity, let's add it to the first non-special list, or create a 'Tasks' list if none exists.
             // Or, we can just add it to 'all' and specify it belongs to a generic 'Tasks' list type.
             // For now, let's add it to the 'all' tasks list directly for display
             // A better approach would be to have a default "My Tasks" list.
             // For this example, if currentListId is 'all', it still belongs to a conceptual 'main' list.
             // Let's assume there's always a list with id 'default-tasks' or similar for this case.
             // For this basic example, if 'all' is selected, tasks are added to the 'all' bucket.
             // A more robust app would have a default conceptual list, e.g., 'Tasks'.
             const defaultTasksList = lists.find(list => list.id === 'all');
             if (defaultTasksList) {
                 defaultTasksList.tasks.push({ ...newTask, listId: 'all' }); // Mark as belonging to 'all'
             }
        }
        saveData();
        renderTasks();
        newTaskInput.value = '';
    }

    function toggleTaskComplete(taskId) {
        lists.forEach(list => {
            const task = list.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
            }
        });
        saveData();
        renderTasks();
    }

    function toggleTaskImportant(taskId) {
        lists.forEach(list => {
            const task = list.tasks.find(t => t.id === taskId);
            if (task) {
                task.important = !task.important;
            }
        });
        saveData();
        renderTasks();
    }

    function editTaskName(taskId, newName) {
        lists.forEach(list => {
            const task = list.tasks.find(t => t.id === taskId);
            if (task) {
                task.name = newName.trim();
            }
        });
        saveData();
        renderTasks();
    }

    function deleteTask(taskId) {
        lists.forEach(list => {
            list.tasks = list.tasks.filter(task => task.id !== taskId);
        });
        saveData();
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = ''; // Clear existing tasks

        let tasksToRender = [];

        if (currentListId === 'all') {
            // Aggregate all tasks from all lists
            lists.forEach(list => {
                if (list.id !== 'all' && list.id !== 'important') {
                    tasksToRender = tasksToRender.concat(list.tasks);
                } else if (list.id === 'all') { // Tasks directly added to 'all'
                     tasksToRender = tasksToRender.concat(list.tasks.filter(task => task.listId === 'all'));
                }
            });
            // Ensure no duplicates if a task is already in a custom list AND directly in 'all' (handle carefully)
            // A better way is to only have tasks stored in their specific lists, and 'all' just renders them.
            // For now, assume a task added to a custom list is NOT also added to the 'all' list directly.
        } else if (currentListId === 'important') {
            // Aggregate all important tasks from all lists
            lists.forEach(list => {
                tasksToRender = tasksToRender.concat(list.tasks.filter(task => task.important));
            });
        } else {
            // Specific custom list
            const selectedList = lists.find(list => list.id === currentListId);
            if (selectedList) {
                tasksToRender = selectedList.tasks;
            }
        }

        // Apply filtering
        if (currentFilter === 'active') {
            tasksToRender = tasksToRender.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            tasksToRender = tasksToRender.filter(task => task.completed);
        }

        // Sort by importance (important first), then by completion status (incomplete first)
      tasksToRender.sort((a, b) => {
    // Prioritize incomplete tasks over completed tasks
    if (a.completed && !b.completed) return 1; // 'a' (completed) goes after 'b' (incomplete)
    if (!a.completed && b.completed) return -1; // 'a' (incomplete) goes before 'b' (completed)

    // If completion status is the same, sort by importance (important first)
    if (a.completed === b.completed) {
        if (a.important && !b.important) return -1; // 'a' (important) goes before 'b' (not important)
        if (!a.important && b.important) return 1;  // 'a' (not important) goes after 'b' (important)
    }

    return 0; // Maintain original order for tasks that are otherwise equal
});


        if (tasksToRender.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">No tasks here yet!</li>';
            return;
        }

        tasksToRender.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.taskId = task.id;

            taskItem.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'completed' : ''}">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <span class="task-name ${task.completed ? 'completed' : ''}">${task.name}</span>
                <div class="task-actions">
                    <i class="fas fa-star importance-star ${task.important ? 'important' : ''}"></i>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });

        // Add event listeners for task interactions
        taskList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                toggleTaskComplete(taskId);
            });
        });

        taskList.querySelectorAll('.importance-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                toggleTaskImportant(taskId);
            });
        });

        taskList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskItem = e.target.closest('.task-item');
                const taskId = taskItem.dataset.taskId;
                const taskNameSpan = taskItem.querySelector('.task-name');

                const currentName = taskNameSpan.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentName;
                input.className = 'edit-task-input';

                taskNameSpan.replaceWith(input);
                input.focus();

                const saveEdit = () => {
                    const newName = input.value;
                    if (newName && newName !== currentName) {
                        editTaskName(taskId, newName);
                    }
                    input.replaceWith(taskNameSpan); // Replace input with original span
                    renderTasks(); // Re-render to update UI
                };

                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
            });
        });

        taskList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTask(taskId);
                }
            });
        });
    }

    // --- Event Listeners ---
    addListBtn.addEventListener('click', () => addList(newListInput.value));
    newListInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addList(newListInput.value);
    });

    addTaskBtn.addEventListener('click', () => addTask(newTaskInput.value));
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(newTaskInput.value);
    });

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        filterAllBtn.classList.add('active');
        filterActiveBtn.classList.remove('active');
        filterCompletedBtn.classList.remove('active');
        renderTasks();
    });

    filterActiveBtn.addEventListener('click', () => {
        currentFilter = 'active';
        filterActiveBtn.classList.add('active');
        filterAllBtn.classList.remove('active');
        filterCompletedBtn.classList.remove('active');
        renderTasks();
    });

    filterCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        filterCompletedBtn.classList.add('active');
        filterAllBtn.classList.remove('active');
        filterActiveBtn.classList.remove('active');
        renderTasks();
    });

    // --- Initial Load ---
    loadData();
    renderLists();
    renderTasks();
});