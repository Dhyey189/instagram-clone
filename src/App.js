import React, { useState, useEffect } from 'react';
import './App.css';
// import logo110 from "./110.jpg";
import { db, auth } from './Firebase';
import instagram from './instagram-name-logo.png';
import Post from './Post';
import UploadImage from './UploadImage';
import  Modal  from '@material-ui/core/Modal';
import {makeStyles} from "@material-ui/core/styles";
import {Button , Input,} from "@material-ui/core";
import { SocialIcon } from 'react-social-icons';
// import InstagramEmbed from'react-instagram-embed';

function getModalStyle() {
  const top = 50  ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function aboutmeText()
{
  const text = "Hello I am Dhyey Patel currently in 3rd year of CS. I am passionate about Web Development, Machine Learning and Cloud Computing. This is the Instagram-clone which contain some functionalities of Intagram app build using React-JS library and using firbase for database. Please Contact me for more web devlopment Queries. Thankyou for visiting this site.";
  return text;
}

function App() {
  const [posts, setPosts] = useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [openlogin, setOpenLogin] = useState(false);
  const [openAboutme, setAboutMe] = useState(false);
  // const [openPost, setOpenPost] = useState(false);
  useEffect(() =>{
    const unsubscribe =  auth.onAuthStateChanged((authuser) =>{
      if(authuser)
      {
        setUser(authuser);
        // if(authuser.displayName)
        // {

        // }else{
        //   return ;
        // }
      }
      else{
        setUser(null);
      }
    })
    return (()=>{
      unsubscribe();
    })

  }, [user, username]);
  useEffect(() => {

    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snap => {
      setPosts(snap.docs.map(post => ({
        id: post.id,
        post: post.data(),
      })));
    })

  }, []);
  
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const signup = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authuser) => {return authuser.user.updateProfile({displayName:username})})
    .catch((error) => alert(error.message))

    setOpen(false)
    setPassword('');
  }

  const login = (event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))
    setPassword('');
    setOpenLogin(false)
  }


  
  return (

    <div className="App">

    

    
      
      <Modal open={open} onClose={handleClose}>
        
        
            <div style={modalStyle} className={classes.paper}>
            <form className="app-signup">
            <center>
            <img className="app-header-image"
          src={instagram}
          alt=""
        />
        </center>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}

          />
          <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}

          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}

          />
          
          <Button type="submit" onClick={signup}>Sign Up</Button>
           </form>   
          </div>
        
      </Modal>
      <Modal open={openlogin} onClose={handleClose}>
        
        
            <div style={modalStyle} className={classes.paper}>
            <form className="app-signup">
            <center>
            <img className="app-header-image"
          src={instagram}
          alt=""
        />
        </center>
        <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}

          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}

          />
          
          <Button type="submit" onClick={login}>Login</Button>
           </form>   
          </div>
        
      </Modal>
      <div className="app-header">
        <img className="app-header-image"
          src={instagram}
          alt=""
        />
        {user?
      <div className="app-post-container">
        {
    user?.displayName ? 
      ( <UploadImage username={user.displayName}  /> )
    : 
    user?
    ( <h1> Sorry you need to login </h1>
    ):("")}
        <Button onClick={()=>setAboutMe(true)}>About Me</Button>
        <Button onClick={()=>auth.signOut()}>Logout</Button>
      </div>:
      <div className="app-logincontainer">
        <Button onClick={()=>setOpenLogin(true)}>Login</Button>
        <Button onClick={handleOpen}>Sign Up</Button>
      </div>
      }
      
      </div>
      <div className="app-post">
      {
        posts.map(
          ({ id, post }) =>
            <Post key={id} postid={id} user={user}  username={post.username} caption={post.caption} image={post.imageurl} />
        )

      }
      </div>
      
      <Modal open={openAboutme} onClose={()=>setAboutMe(false)}>        
      <div style={modalStyle} className={classes.paper}>
    <div className="app-aboutme">
      <div className="app-aboutme-0">
      <div className="app-aboutme-1" ><strong><h2 >About Me</h2></strong></div>
      <div className="app-aboutme-2">{aboutmeText()}</div>
      </div>
      <div className="app-contactme-0">
      <div className="app-contactme"><strong><h2>Contact Me</h2></strong></div>
      <div className="app-contactme-logo">
        <SocialIcon className="app-contactme-logo-url" url="https://www.linkedin.com/in/dhyeyatcoding/" />
        <SocialIcon className="app-contactme-logo-url" url="https://www.instagram.com/dhyey_patel_18/" />
        <SocialIcon className="app-contactme-logo-url" url="mailto:dhyeypatel189@gmail.com/" />
        <SocialIcon className="app-contactme-logo-url" url="https://github.com/DP1809/" />
        
      </div>
      </div>
    </div>
    </div>
    </Modal>
    </div>
    
  );
}

export default App;
