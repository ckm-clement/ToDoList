import {useState} from 'react';
import Modal from './Model';
import {useCookies} from 'react-cookie';

// Define functional component ListHeader that takes a single prop named listName
const ListHeader = ({listName,getData}) => {
  const [cookies,setCookie, removeCookie] = useCookies(null);
  const [showModal, setShowModal] = useState(false)

  // Define function signOut, callback function that will be triggered when the "Sign out button is clicked"
  const signOut=() =>{
    // console.log('signout');
    removeCookie('Email');
    removeCookie('AuthToken');
    window.location.reload();
  }
    //The return what the component will render on the screen.
    //It returns a JSX (JavaScript XML) representation of the component's UI.
    // In this case, it's a <div> element with a className of "list-header".
    // Inside the <div> element, there is an <h1> element displaying the value of the listName prop, and a <div> with a className of "button-container".
    // Inside the "button-container", there are two <button> elements. The first one has a className of "create" and displays "Add New" as its label.
    // The second button has a className of "signout" and displays "Sign out" as its label. Additionally, it has an onClick event handler that will trigger the signOut function when the button is clicked.
    return (
      <div className="list-header">
          <h1>{listName}</h1>
          <div className="button-container">
            {/* The onClick attribute sets up an event handler that triggers the setShowModal which will show the dialog for create task*/}
            <button className="create" onClick = { () =>setShowModal(true)}>Add New</button>
            <button className="signout" onClick = {signOut}>Sign out</button>
          </div>
          {/* renders Modal components, if showModal is true, then modal component is passed the prop with value of create  */}
          {showModal && <Modal mode = {'create'} setShowModal={setShowModal} getData= {getData} />}
      </div>
    );
  }
  


  //Export the ListHeader component as the default export so it can be imported and used in other files.
  export default ListHeader;
  