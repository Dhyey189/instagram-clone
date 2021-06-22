import React,{ useState} from 'react'
import firebase from 'firebase';
import {db,storage} from './Firebase'
import {Button , Input, LinearProgress} from "@material-ui/core";
import  Modal  from '@material-ui/core/Modal';
import {makeStyles} from "@material-ui/core/styles";
import './UploadImage.css'

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

function UploadImage({username,openpost}) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const [openPost, setOpenPost] = useState(false);

    const handleChange = (event) =>{
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection('posts').add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageurl:url,
                        username:username,

                    });
                    setProgress(0);
                    setCaption("Done");
                    setImage(null);
                    setOpenPost(false);
                })
            }
        )
    };


    return (
        <>
        <Button onClick={()=>setOpenPost(true)}>Post</Button>
        <Modal open={openPost} onClose={()=>setOpenPost(false)}>
      <div style={modalStyle} className={classes.paper}>
        <div className="uploadimage">
            <h3 className="uploadimage-postit">Post Something..</h3>
            <LinearProgress variant="determinate" className="uploadimage-progress" value={progress} max="100" />

            <Input type="text" className="uploadimage-caption" placeholder="Enter a caption!" onChange={(e)=>setCaption(e.target.value)}/>
            <label for="file-upload" className="custom-file-upload">
            <p style={{backgroundColor:'lightgray', width:'fitcontent'}}>Choose File Name: { document.getElementById("file-upload")?(document.getElementById("file-upload").value.split(/(\\|\/)/g).pop()):("") }</p>
            </label>
            <Input id="file-upload" type="file" onChange={handleChange} style={{display:"none"}} />
            
            {/* <Input type="file" onChange={handleChange} /> */}
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
        </div>
        </Modal>
        </>
    )
}

export default UploadImage;
