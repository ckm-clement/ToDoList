import {useState} from 'react';
import Modal from './Model';
import TickIcon from './TickIcon';
import ProgressBar from './ProgressBar';


// Define functional component ListItem that takes a single prop named task
const ListItem= ({task,getData}) => {
  const [showModal, setShowModal] = useState(false)

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
    return (
      // Displaying the value of the listItem prop
      <li className="list-item">
        <div className="info-container">
        <p className="task-title">{task.title}</p>
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
  