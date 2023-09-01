// imports useState hook from react library, to manage state in functional components
import {useState} from 'react'
import {useCookies} from 'react-cookie'

// Defines functional component named Model which takes in two props mode and setShowModal
const Model= ({mode,setShowModal,getData,task}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const [titleError, setTitleError] = useState('');

  // Determines whether the component is in edit mode
  const editMode = mode === "edit" ? true : false ;

    //Uses the useState hook to create data state, initial state of data containing the following properties
    const [data, setData] = useState({
      user : editMode ? task.user : cookies.User,
      title: editMode ? task.title : null,
      progress: editMode ? task.progress: 50 ,
      date: editMode ? task.date : new Date(),
      completed: false,
      category: editMode ? task.category : "personal"
    });


    // async arrow function with event object, function used as an event handler
    const postData = async (e) => {
      // Prevents default behavior of the form submission event
      e.preventDefault();
      if (!data.title) {
        setTitleError('Task field is required.');
        return;
      }
      try {
        //fetch API to send POST request
        const response = await fetch('http://localhost:8000/todos', {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify(data),
          
        });
  
       // closed new task form 
        if(response.status === 200) {
          // console.log('WORKED');
          setShowModal(false);
          // refresh task list after new task is created
          getData();
        }

      } catch(err){
          console.error(err);
      }
    };


    const editData = async(e) => {
      e.preventDefault();
      try{
         const response =  await fetch(`http://localhost:8000/todos/${task._id}`,{
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
          });
          if (response.status === 200){
            setShowModal(false);
            getData();
          }
      }
      catch(err){
          console.log(err)
      }
    };



    // Defines function handleChange, this is called whenever an input's value changes
    const handleChange = (e) => {
      //extract name and value attributes from the changed input element
      const {name, value } = e.target;
      //setData function is then called with a callback function 
      setData(data => ({
        ...data, //spread all properties from the exisitng data, inherits all properoties from the exisitng data object
        [name] : value //update the property specified by the name with the new value
      }));

     console.log(data);

    }
    //return the JSX content of the Model component
    return (
      <div className="overlay">
          <div className="modal">
            <div className = "form-title-container">
              <h3>{mode} a  task</h3>
              <button onClick = {() =>setShowModal(false)}>X</button>
            </div>
              <form>
                <input
                className ="task-input"
                required
                maxLength = {30}
                placeholder = " Your task goes here"
                name = "title"
                value={data.title}
                onChange = {handleChange} />
                <br/>
                <label for ="range">Drag to select your current progress</label>
                <input type="range"
                id="range"
                min ="0"
                max = "100"
                name = "progress"
                value ={data.progress}
                onChange = {handleChange} />

                <label for="category">Choose a category:</label> 
                    <select value = {data.category} className ='drop-down'name="category" id="categories"  onChange = {handleChange} > 
                        <option value="personal">Personal</option> 
                        <option value="work">Work</option> 
                    </select>
                  

               
                 {titleError && <p className="error">{titleError}</p>}
                <input className= {mode} type="submit" onClick = {editMode ? editData:postData}/>
              </form>
          </div>
      </div>
    );
  }
  
  export default Model;
  