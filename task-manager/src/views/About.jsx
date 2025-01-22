import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

const About = () => {
    return (
        <div className='info-container'>
            <div className='heading-container'>
                <h1>About the Application</h1>
                <h3>Author: Rafsan Ahmed</h3>
                <strong><FontAwesomeIcon icon="fa-solid fa-stopwatch" /> Basic task tracker</strong>
            </div>
            <div className='project-info'>
            <h4>Features of the application</h4>
               
                    
                   <p>The application contains 4 main views & task element pages.</p>
                    <ul>
                        <li> 
                        <strong>Home view:</strong> 
                        <ul>
                            <li>Displays a quick preview of all task elements.</li>
                            <li>Users can add a new task via the Home view.</li>
                            <li>Filter tasks based on their associated tags</li>
                        </ul> 
                        </li>
                        <li> 
                        <strong>About view:</strong> 
                        <ul>
                            <li>Contains general information about the application & usage instructions.</li>
                        </ul> 
                        </li>
                        <li> 
                        <strong>Tags view:</strong> 
                        <ul>
                            <li>Displays the list of all available tags.</li>
                            <li>Users can add new arbitrary tags to the application via Tags view.</li>
                            <li>Users can delete existing tags from the application.</li>
                        </ul> 
                        </li>
                        <li> 
                        <strong>Tasks view:</strong> 
                        <ul>
                            <li>Displays the names of all available task elements in the navigation under the "Tasks" menu item.</li>
                            <li>Users can click on a task to open the task element page.</li>
                            <li>Task element page contians the name of task, associated tags and a time tracker.</li>
                            <li>Users can edit task names via the task element page.</li>
                            <li>Users can remove tasks from the application via the task element page.</li>
                            <li>Users can add tags to the task via the task element page.</li>
                            <li>Users can track time spent on the task via the task element page.</li>
                        </ul> 
                        </li>
                    </ul>
                    <h4>Usage instruction</h4>
                    <ul>
                        <li>
                        <strong>Adding a new task:</strong>
                            <ul>
                                <li>Naviagte to the first section of the Home view titled "Add new task".</li>
                                <li>Enter the task name and associated tags (separated by comma).</li>
                                <li>After successful addition the newly added task will appear on the naviagation menu under the "Tasks" menu item.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Adding a new tag:</strong>
                            <ul>
                                <li>New tags can be added when adding a new task to the application.</li>
                                <li>Open the "Tags" view from the navigation menu. Under the "Manage Tags" section enter the name of the tag and click on the "Add Tag" button to add a new or existing tag.</li>
                                <li>Open an individual task element page by clcking on the task name from the navigation menu. Under "Tags" section inside the page enter the tag name to add a new or existing tag.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Filterting tasks by associated tags:</strong>
                            <ul>
                                <li>Naviagte to the second section of the Home view titled "Filter by Tags:".</li>
                                <li>Click on the "Filter by Tags: "button to view the list of tags.</li>
                                <li>Select or click on the tags to filter the tasks based on associated tags.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Tracking time:</strong>
                            <p>Time tracking for the tasks can be done via the Home view or by opening indivudual task element pages.</p>
                            <ul>
                                <li>Naviagte to the "Tasks" section of the Home view where a quick preview of individual task elements are displayed.</li>
                                <li>Click on the "Start Tracking" button to start the timer & the "Stop Tracking" button on a running task to stop the timer.</li>
                                <li>Open individual task element pages by selecting them form the navigation or by clickig on the "Open Task" button on task preview cards in the Home view.</li>
                                <li>Time tracking can be done inside the task element pages by using the "Start Tracking" and "Stop Tracking" buttons.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Editing task names:</strong>
                            <ul>
                                <li>Navigate to the indivudal task element pages from the navigation menu under "Tasks" menu item.</li>
                                <li>While inside the task element page, click on the "Edit Name" button to edit a task name.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Deleting tasks:</strong>
                            <ul>
                                <li>Navigate to the indivudal task element pages from the navigation menu under "Tasks" menu item.</li>
                                <li>While inside the task element page, click on the "Delete Task" button to delete a task from the application.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Deleting tags:</strong>
                            <ul>
                                <li>click on the "Tags" view in the navigation menu.</li>
                                <li>Tags are listed inside the Tags view. Click on the "Delete" button to delete a tag.</li>
                            </ul>
                        </li>
                        <li>
                        <strong>Removing tags from a Task:</strong>
                            <ul>
                                <li>Inside the indivudal task element page, click on a tag to reveal the "Remove Tag" button.</li>
                                <li>Click on the "Remove Tag" button to remove that specific tag from the Task.</li>
                            </ul>
                        </li>
                    </ul>
               
            </div>
            <div className='project-info'>
                <h3>License</h3>
              
                    <ul>
                        <li>Icons: Font Awesome by Dave Gandy - http://fontawesome.io</li>
                    </ul>
                
            </div>
            <div className='project-info'>
                <h3>Usage of AI</h3>
                <p>AI tools have been used mostly for debugging and learning different concepts related to React libraries & state management.</p>
            </div>
            <div className='project-info'>
                <h3>Hours spent</h3>
                <p>About 38 hours have spent working on the application.</p>
            </div>
            <div className='project-info'>
                <h3>Implementaion of features</h3>
                <p>Most difficult features to implement were: Task timer, time formatting, Task filtering based on tags, Addition and delation of tags and other server related operations for the most part.</p>
            </div>
        </div>
    );
};

export default About;
library.add(fas)
