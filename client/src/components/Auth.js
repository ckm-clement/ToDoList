// import useState hook from react
import {useState} from 'react';
import {useCookies} from 'react-cookie';


// Functional component Auth
const Auth= () => {

    const[cookies, setCookie, removeCookie] = useCookies(null);

  // useState hook create stateVariable isLogIn, associated with setter function setIsLogin, initial value is set to true
  const [isLogIn, setIsLogin] = useState(true);

  const [user, setUser] = useState(null);
  const[password, setPassword] = useState(null);
  const[confirmPassword, setConfirmPassword] = useState(null);

  //state variable error, setter function setError initial value of error is null
  const [error,setError] = useState(null);

    // console.log(cookies);
    // console.log(user,password,confirmPassword);
    //validation function that uses regex to check if password contains at least one lowercase, one uppercase, one digitm, one special character and minimum length of 8 chars
    const validatePassword = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    }
  // custom function viewLogin which take in status arg, when this function is called, set error state to null, update isLogIn state using the provided status arg
  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  }

  const handleSubmit = async (e, endpoint) =>{
    e.preventDefault()
    if (!isLogIn && password !== confirmPassword){
      setError('Make sure password match!')
      return
    }
    if (!isLogIn && !validatePassword(password)) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and have a minimum length of 8 characters.')
      return
    }
    const response = await fetch(`http://localhost:8000/${endpoint}`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user,password})
    })

    const data = await response.json();
    if (data.detail){
      setError(data.detail)
    } else{
      setCookie('User',data.user);
      setCookie('AuthToken', data.token);

      window.location.reload();
    }
  
  }
 
    // Display form with then following inputs and button
    return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form>
            {/* Form heading to dynamically change based on isLogIn */}
            <h2>{isLogIn ? 'Please log in' : 'Please sign up' }</h2>
            <input type="text" placeholder = "username" class= "auth-credentials" onChange ={(e) => setUser(e.target.value)}/>
            <input type="password" placeholder="password" class= "auth-credentials" onChange = {(e) =>setPassword(e.target.value)}/>
            {!isLogIn && <input type="password" placeholder="confirm password" class= "auth-credentials" onChange = {(e) =>setConfirmPassword(e.target.value)}/>}
            <input type="submit" className="create" onClick={(e) => handleSubmit(e,isLogIn ? 'login': 'signup')}/>
            {/* if error state is not null, error message is displayed */}
            {error && <p>{error}</p>} 
          </form>
          
          <div className="auth-options">
            {/* event handlers for signup and login buttons, when clicked, called the viewLogin Function with false for signup and true for login mode */}
            <button onClick ={() =>viewLogin(false )}
            style={{backgroundColor: !isLogIn ? 'rgb(188,188,188)' :'rgb(255,255,255)'}}
            >Sign Up</button>
            <button onClick ={() => viewLogin(true)}
            style={{backgroundColor: isLogIn ? 'rgb(188,188,188)' :'rgb(255,255,255)'}}
            >Login</button>
          </div>
          </div> 
      </div>
    );
  }
  
  export default Auth;
  