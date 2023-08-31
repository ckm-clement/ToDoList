import {useState,useEffect} from 'react';
import Modal from './Model';
import TickIcon from './TickIcon';
import ProgressBar from './ProgressBar';


// Define functional component ListItem that takes a single prop named task
const ListItem= ({task,getData}) => {
  const [showModal, setShowModal] = useState(false)
  const [completed, setCompleted] = useState(task.commpleted);

  useEffect(() => {
    // Fetch and set the initial completed state from the server
    setCompleted(task.completed);
  }, [task.completed]);

  
  const deleteData = async(e) => {
    try{
      const response = await fetch(`http://localhost:8000/todos/${task._id}`,{
        method:'DELETE'
      });

      if (response.status === 200) {
        // console.log('Task deleted successfully') ;
        getData();
      }

    }
    catch(err){
      console.error(err)
    }
  };

  // const toggleCompleted = async () => {
  //   try{
  //     const response = await fetch(`http://localhost:8000/complete/${task._id}`,{
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({completed:!completed}),
  //     });
  //     if (response.ok){
  //       const updatedTask = await response.json();
  //       setCompleted(updatedTask.completed);
  //     }else{
  //       console.error('Failed to update task');
  //     }
  //   } catch(error){
  //     console.error('Error updating task:' , error);
  //   }
  // };

    const completedTask = async () => {
      if (completed){
        deleteData();
      }
      else{
      alert('Task is not yet completed, complete it first!');
      }
    }


    return (

      // Displaying the value of the listItem prop
      <li className="list-item">
        <div className="info-container">
        <button className="tick-btn" onClick={completedTask} > <TickIcon/></button>
        <p className="task-title" style={{ textDecoration: completed ? 'line-through' : 'none' }}>
        {task.title}
      </p>
        <ProgressBar progress={task.progress}/>
        </div>

        <div className="button-container">
          <button className="edit" onClick = {() => setShowModal(true)}>EDIT</button>
          <button className="delete" onClick = {() => deleteData()}>DELETE</button>
        </div>
        {showModal && <Modal mode ={'edit'} setShowModal={setShowModal} getData = {getData} task = {task} />}
      </li>
    );
  }
  
  export default ListItem;
  