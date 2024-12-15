import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FaSave, FaPlay, FaPause } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { LuTimerReset } from "react-icons/lu";

function LoggedIn() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dataArray, setDataArray] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [timers, setTimers] = useState({});
    const [isRunning, setIsRunning] = useState({});
    const [runningTimers, setRunningTimers] = useState({});

    const email = localStorage.getItem('email');

    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 8;

    const getData = async () => {
        const data = { filter: { email: email } };
        try {
            const res = await axios.get("http://localhost:5000/tasks", { params: data });
            const fetchedTasks = res.data.result || [];
            setDataArray(fetchedTasks);

            // Reset timers and running states
            const initialTimers = {};
            const initialRunningStatus = {};
            fetchedTasks.forEach(task => {
                const savedTime = localStorage.getItem(`timer-${task._id}`);
                const savedRunningStatus = localStorage.getItem(`isRunning-${task._id}`);
                initialTimers[task._id] = savedTime ? parseInt(savedTime, 10) : task.timeSpent || 0;
                initialRunningStatus[task._id] = savedRunningStatus === 'true';
            });

            setTimers(initialTimers);
            setIsRunning(initialRunningStatus);
            setRunningTimers(initialRunningStatus);
        } catch (err) {
            console.log(err);
        }
    };

    const addTask = async () => {
        const data = { title: title, status: status, dueDate: dueDate, email: email };
        try {
            await axios.post("http://localhost:5000/addTask", { data: data });
            closeModal();
            getData();
        } catch (err) {
            console.log(err);
        }
    };

    const editTask = async (task, newStatus, newDeadline) => {
        const data = {
            filter: { _id: task._id },
            update: {
                status: newStatus,
                dueDate: newDeadline
            }
        };
        try {
            await axios.post("http://localhost:5000/editTask", { data });
            getData();
            setEditingTaskId(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTask = async (task) => {
        const data = { filter: { _id: task._id } };
        try {
            await axios.delete("http://localhost:5000/deleteTask", { data });
            getData();
        } catch (err) {
            console.log(err);
        }
    };

    const startTimer = (taskId) => {
        setRunningTimers(prevState => ({ ...prevState, [taskId]: true }));
        setIsRunning(prev => ({ ...prev, [taskId]: true }));
        localStorage.setItem(`isRunning-${taskId}`, 'true');
    };

    const pauseTimer = (taskId) => {
        setRunningTimers(prevState => ({ ...prevState, [taskId]: false }));
        setIsRunning(prev => ({ ...prev, [taskId]: false }));
        updateTimeSpent(taskId, timers[taskId]);
        localStorage.setItem(`isRunning-${taskId}`, 'false');
    };

    const resetTimer = (taskId) => {
        setTimers(prev => ({ ...prev, [taskId]: 0 }));
        setIsRunning(prev => ({ ...prev, [taskId]: false }));
        updateTimeSpent(taskId, 0);
        localStorage.setItem(`timer-${taskId}`, 0);
        localStorage.setItem(`isRunning-${taskId}`, 'false');
    };

    const updateTimeSpent = async (taskId, timeSpent) => {
        try {
            const data = { filter: { _id: taskId }, update: { timeSpent } };
            await axios.post("http://localhost:5000/editTask", { data });
            getData();
        } catch (err) {
            console.log(err);
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setTitle('');
        setStatus('');
        setDueDate('');
        setIsOpen(false);
    };

    const handleEditClick = (taskId) => {
        setEditingTaskId(taskId);
    };

    const handleSaveClick = (task) => {
        editTask(task, status || task.status, dueDate || task.dueDate);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prevTimers) => {
                const updatedTimers = { ...prevTimers };
                Object.keys(isRunning).forEach((taskId) => {
                    if (isRunning[taskId]) {
                        updatedTimers[taskId] = (prevTimers[taskId] || 0) + 1;
                        localStorage.setItem(`timer-${taskId}`, updatedTimers[taskId]);
                    }
                });
                return updatedTimers;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning]);

    // Pagination Logic
    const indexOfLastTask = (currentPage + 1) * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = dataArray.slice(indexOfFirstTask, indexOfLastTask);
    
    return (
        <div className="App">
          <div className="App-body">
            {dataArray.length > 0 ? (
              <div className="TaskList">
                <h3>Task List</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Time Spent (hh:mm:ss)</th>
                      <th>Deadline</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTasks.map((task, index) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>
                        {editingTaskId === task._id ? (
                          <input type="text"  defaultValue={task.status} onChange={(e) => setStatus(e.target.value)}/>) : 
                          (task.status)}
                      </td>
                      <td>
                        {new Date(timers[task._id] * 1000).toISOString().substr(11, 8)}
                        <div>
                          {runningTimers[task._id] ? (
                          <button onClick={() => pauseTimer(task._id)}><FaPause /></button>) : 
                          (<button onClick={() => startTimer(task._id)}><FaPlay /></button>)}
                          <button onClick={() => resetTimer(task._id)}><LuTimerReset /></button></div>
                      </td>
                      <td>
                        {editingTaskId === task._id ? (
                        <input  type="date" defaultValue={task.dueDate} onChange={(e) => setDueDate(e.target.value)}/>) :
                        (task.dueDate)}
                      </td>
                      <td>{editingTaskId === task._id ? (<button className="button-save" onClick={() => handleSaveClick(task)}><FaSave /></button>) :
                      (<><button onClick={() => handleEditClick(task._id)}><MdEdit /></button>
                        <button className="button-delete" onClick={() => deleteTask(task)}><MdDelete /></button>
                        </>)}
                      </td>
                    </tr>  ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Previous</button>
                    <span>Page {currentPage + 1} of {Math.ceil(dataArray.length / tasksPerPage)}</span>
                    <button onClick={() => setCurrentPage(prev => (indexOfLastTask < dataArray.length ? prev + 1 : prev))}
                    disabled={indexOfLastTask >= dataArray.length}> Next </button>
                </div>
              </div>) : (<div>No tasks available</div>)}
                <button onClick={openModal}>
                    <RiAddCircleFill /> Add Task
                </button>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Example Modal">
                <div className="CreateTask">
                  <h3>Add Task</h3>
                  <button onClick={closeModal}>X</button>
                  <form onSubmit={(e) => { e.preventDefault(); addTask(); }}>
                    <label>Task</label><br />
                    <input onChange={(e) => setTitle(e.target.value)} placeholder="Enter Task" /><br />
                    <label>Status</label><br />
                    <input onChange={(e) => setStatus(e.target.value)} placeholder="Enter Status" /><br />
                    <label>Deadline</label><br />
                    <input onChange={(e) => setDueDate(e.target.value)} type="date" placeholder="Deadline" /><br />
                    <button type="submit">Add Task</button>
                  </form>
                </div>
              </Modal>
            </div>
        </div>
    );
}

export default LoggedIn;
