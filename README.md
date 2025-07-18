# Advance_TodoList
This is a personal To-Do List application designed to help you stay organized. It allows you to add, manage, and track your tasks across custom lists. Tasks can be marked as important or completed, and filtered for a clear overview of your progress, with all data saved directly in your browser

# My To-Do List Application

A simple and intuitive web-based To-Do List application designed to help you organize your tasks efficiently. You can create custom lists to categorize your tasks, mark tasks as important or complete, and filter them for a clear overview of your progress. All your lists and tasks are saved directly in your browser's local storage for persistence.

## Features

  * **Task Management:**
      * Easily add new tasks using the prominent **"+ Add Task" button**.
      * Mark tasks as completed/incomplete with a simple click.
      * Designate tasks as important or unimportant.
      * Edit existing task names.
      * Delete tasks you no longer need.
  * **List Management:**
      * Comes with pre-defined "All Tasks" and "Important" lists for quick access.
      * Create custom lists to categorize tasks, with a clear **"+ Add List" button**.
      * Delete custom lists, including all their associated tasks.
      * Seamlessly switch between different lists to focus on specific task sets.
  * **Task Filtering:**
      * Filter tasks to show "All", "Active" (incomplete), or "Completed" items within the current list.
  * **Persistent Storage:**
      * All your data (lists and tasks) is automatically saved in your browser's local storage, ensuring your information is retained even after closing the application.

## Technologies Used

  * **HTML5:** For the core structure of the application.
  * **CSS3:** For styling and visual presentation (`static/styles.css`).
  * **JavaScript (ES6+):** Powers all interactive elements, task/list management logic, and data persistence (`static/script.js`).
  * **Font Awesome:** Integrated for various icons (e.g., add, edit, delete, star, check).

## Getting Started

To run this To-Do List application locally, follow these steps:

1.  **Project Structure:** Ensure your project files are arranged as follows:
    ```
    Advance_TodoList/
    ├── index.html
    └── static/
        ├── script.js
        └── styles.css
    ```
2.  **Open `index.html`:** Navigate to the `Advance_TodoList` folder and simply open the `index.html` file in your preferred web browser.

## How to Use

### Adding a Task

1.  Select the desired list from the sidebar (e.g., "All Tasks" or a custom list).
2.  Type your task into the "Add a task..." input field at the bottom right of the main content area.
3.  Click the blue **"+ Add Task" button** or press `Enter`.

### Managing Tasks

  * **Mark as Complete/Incomplete:** Click the checkbox/empty circle on the left side of a task item.
  * **Mark as Important/Unimportant:** Click the star icon next to the task name.
  * **Edit Task:** Click the "\<i class='fas fa-edit'\>\</i\>" (edit) button next to a task. Type the new name and press `Enter` or click outside the input field.
  * **Delete Task:** Click the "\<i class='fas fa-trash'\>\</i\>" (trash) button next to a task. Confirm the deletion when prompted.

### Adding a Custom List

1.  In the sidebar, locate the "New list name" input field under "Custom Lists".
2.  Type the name for your new list.
3.  Click the blue **"+ Add List" button** or press `Enter`. The new list will appear and be automatically selected.

### Deleting a Custom List

1.  Hover over the custom list name in the sidebar.
2.  Click the "\<i class='fas fa-trash'\>\</i\>" (trash) icon that appears next to it.
3.  Confirm the deletion when prompted. **Warning: Deleting a custom list will also permanently delete all tasks associated with that list.**

### Filtering Tasks

In the header of the main content area, click one of the filter buttons:

  * **All:** Displays all tasks for the currently selected list.
  * **Active:** Displays only incomplete tasks for the current list.
  * **Completed:** Displays only completed tasks for the current list.

## Local Storage Usage

The application leverages `localStorage` to save your data persistently within your browser. This means your lists and tasks will be available even if you close and reopen your browser or device.

  * **Key:** `todoLists`
  * **Value:** A JSON string representing an array of list objects, each containing its own array of task objects.

## Potential Improvements

  * Implement drag-and-drop functionality for reordering tasks.
  * Add features like due dates, reminders, or notes for tasks.
  * More advanced sorting options.

-----