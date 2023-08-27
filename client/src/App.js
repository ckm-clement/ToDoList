import ListHeader from './components/ListHeader';
import ListItem from './components/ListItem';
import Auth  from './components/Auth';
import {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';


// Functional component which is the parent component
const App= () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  //Component State
  const user = cookies.User;
  //task is defined as a state variable using the useState hook, initial task is set to null, setTask is a function to update value of task
  const [tasks, setTasks] = useState(null);


  
  // asynchronous data fetching from server side
  const getData = async () => {

    try{
     // use fetch API to make HTTP request to specified URL
      const response = await fetch(`http://localhost:8000/todos/${user}`);
    //  response is  parsed as JSON using response.json()
      const json = await response.json()
    //setTasks function to called to update the task state variable with the fetched data
      setTasks(json)
    }catch(err){
      // if error occurs logged to console
      console.error(err);
    }
  }
  // call getData function when component is mounted, since dependency array [] is empty, effect only runs once
  useEffect(() => {
  if(authToken) {
    getData()}}
    ,[]);



  //sortedTask checks if tasks variable is not null then sorts the task based on the task date property. sort function takes a comparison function that compares the dates and returns a negative, zero, or positive value to determine the order
  const sortedTasks = tasks?.sort((a,b)=> new Date(b.date) - new Date(a.date))
  
  // Return what will be rendered on the screen when this component is used
  return (
    <div>
      <div className="app">
        {/* display login page if not login */}
        {!authToken && <Auth/>}
            {/* listHeader is used here as a child component, `listName` prop is passed to the ListHeader with the value ToDo Tick List */}
        {authToken &&  
        <>
        <ListHeader listName={`📝 ${user} ToDo List`} getData = {getData} /> 
        <p className = "user-email">Welcome back {user}</p>
          {/* Maps through sortedTasks if exists, render ListItem component for each task, passing key prop with task._id and task prop */}
          { sortedTasks?.map((task)=> <ListItem key={task._id} task={task} getData={getData} />)}
          </>}
    
      </div>
      <footer className="copyright">&copy; 2023 KM</footer>
    </div>
  );
}

// Exports the App component
export default App;
