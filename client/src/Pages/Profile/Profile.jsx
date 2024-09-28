import React, { useState, useEffect } from 'react';
import axios from 'axios';
import avatar from '../../image/avatar.jpg';
import './Profile.css';
import Activity from '../../Components/Activity/Activity';
import Camera from '../../Components/Camera/Camera';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [userData, setUserData] = useState();
    const [ LogedUserId,setLogedUserId]=useState("");
    const[LogedUserData,setLogedUserData] =useState();
    const [alluserdata,setAllUserData]=useState([]);
    const {  userId } = useParams();
    const [LoginuserId,setLoginUserId]=useState("");


    console.log(userId)
    const callAbout = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/user', {
                withCredentials: true, // to include cookies
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            setLogedUserId(res.data._id);
            setLogedUserData(res.data);

        } catch (error) {
            console.error(error);
        }
    };

    // Clear userData when token is missing or logout occurs
    useEffect(() => {
        callAbout();
    }, []);

    const getalldata = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/getalldata', {
            withCredentials: true,
          });
    
          const alldata = res.data.users;
    
          if (alldata.length > 0) {
            setAllUserData(alldata);
          } else {
            console.log("Error: Data is not in expected format or empty", res.data);
          }
    
          if (res.status !== 200) {
            throw new Error('Error fetching all user data');
          }
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };
    
      useEffect(() => {
        getalldata();
      }, [alluserdata]);

      useEffect(() => {
        if (LogedUserId === userId) {
            setUserData(LogedUserData);
            setLoginUserId(userId);
        } else {
            const selectedUser = alluserdata.find(user => user._id === userId);
            setUserData(selectedUser || {});
        }
    }, [LogedUserId, userId, LoginuserId, LogedUserData, alluserdata]);


  
    const imageSrc = userData && userData.image 
    ? `http://localhost:5000/Images/${userData.image}` // Display the uploaded image
    : avatar; // Default avatar if no image is uploaded

    

    return (
        <div>
            <div className='profile-container'>
                <section className='user-content'>
                    <div className='user-details'>
                        <div className='user-image-div'>
                            <img src={imageSrc} alt='profile-photo' className='user-image' />
                            {LoginuserId?<Camera userId={LogedUserId}/>:""}
                        </div>
                        <div className='username-div'>
                            <span className='username-span'>{userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].firstname : ""} {userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].lastname : ""}</span>
                        </div>
                        <div className='user-profession'>
                            <span className='profession-span'>{userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].profession : ""} | {userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].professionplace : ""}</span>
                        </div>
                        <div className='user-followers'>
                            <span className='followers-span'>{userData && userData.followers? userData.followers.length:""} Followers</span> <span className='followers-span'> | </span>
                            <span className='followers-span'>{userData && userData.following? userData.following.length:""} Connections</span>
                        </div>
                    </div>
                    <div className='editable-details'>
                        <div className='perInfo-div'>
                            <h1 className='perInfo'>Personal Information</h1>
                           {LoginuserId? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                <path d="M13.5 6.5l4 4" />
                            </svg>:""}
                        </div>
                        <div className='email-div'>
                            <span className='email-index'>Email Address</span>
                            <span className='email-span'>{userData ? userData.email : ""}</span>
                        </div>
                        <div className='fname-div'>
                            <span className='fname-index'>Firstname</span>
                            <span className='fname-span'>{userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].firstname : ""}</span>
                        </div>
                        <div className='lname-div'>
                            <span className='lname-index'>Lastname</span>
                            <span className='lname-span'>{userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].lastname : ""}</span>
                        </div>
                        <div className='profe-div'>
                            <span className='profe-index'>Profession</span>
                            <span className='profe-span'>{userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].profession : ""}</span>
                        </div>
                        <div className='place-div'>
                            <span className='place-index'>Place</span>
                            <span className='place-span'>{userData && userData.basicdata && userData.basicdata.length > 0 ? userData.basicdata[0].professionplace : ""}</span>
                        </div>
                    </div>
                    <div className='activity-content'>
                        <div className='activity-div'>
                            <h1 className='activity-head'>Activity</h1>
                           {LoginuserId? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>:""}
                        </div>
                        <div>
                            <Activity userData={userData} LogedUserId={LogedUserId}/>
                        </div>
                    </div>
                </section>
                <section className='other-section'>hello</section>
            </div>
        </div>
    );
}

export default Profile;
