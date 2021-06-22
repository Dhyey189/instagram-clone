import React,{ useState, useEffect} from "react";
// import logo110 from "./110.jpg";
import "./Post.css";
import { db} from './Firebase';
// import {Button , Input,} from "@material-ui/core";
import firebase from 'firebase';
import Avatar from "@material-ui/core/Avatar";



function Post({postid,user,username,caption,image}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  
  useEffect(()=>{
    let unsubscribe;
    if(postid!=null)
    {
      unsubscribe = db
      .collection("posts")
      .doc(postid)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snap)=>{
        setComments(snap.docs.map((doc)=>doc.data()));
      });
      // setComment('');
    }

    return ()=>{
      unsubscribe();
    };
  },[postid]);

  const postComment = (event) => {
    event.preventDefault();
  
    db.collection('posts').doc(postid).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment('');

  
  }



  return (
    <div className="post">
      <div className="post-header">
        <Avatar className="post-avatar" alt="Dhyey" src={image} />
        <h3>{username}</h3>
      </div>
      <img className="post-image" src={image} alt="" />
      <h4 className="post-caption"><strong>{username}</strong> {caption}</h4>
      <div className="post-comments">
        {
          comments.map((comment) => 
            
            (<p>
              <strong>{comment.username}</strong> {comment.text}
            </p>)
          )
        }
      </div>
      {user &&
      (<form className="post-commentbox">
        <input className="post-input" type="text" placeholder="Add a comment..."
        value={comment} onChange={(e)=>setComment(e.target.value)}/>
        <button type="submit" className="pos-button" onClick={postComment}
          disabled={!comment}
          
        >
          Post
        </button>
      </form>)}
    </div>
  );
}

export default Post;
