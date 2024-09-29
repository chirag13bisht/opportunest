import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import AccountDetailsModal from "../../Components/AccountDetailsModal/AccountDetailsModal";
import './Community.css';
import avatar from "../../image/avatar.jpg";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Community = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postModal, setPostModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sharedtext, setSharedText] = useState("");
  const [alluserdata, setAllUserData] = useState([]);
  const [clickedLike, setclickedLike] = useState({});

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Toggle post modal
  const togglePostModal = () => {
    setPostModal(!postModal);
  };

  // Fetch user data and check if basicdata exists
  const callAbout = async () => {
    try {
      const res = await axios.get('https://opportunest-1.onrender.com/api/auth/user', {
        withCredentials: true, // Ensures cookies are sent
      });

      const data = res.data;
      setUserData(data);
      setEmail(data.email);

      if (!data.basicdata || data.basicdata.length === 0) {
        setIsModalOpen(true); // Open modal if no basicdata
      }

      if (res.status !== 200) {
        throw new Error('Error fetching user data');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callAbout();
  }, [userData]);

  // Initialize clickedLike state from localStorage
  useEffect(() => {
    if (userData && userData._id) {
      const storedLikes = JSON.parse(localStorage.getItem(`likedPosts_${userData._id}`)) || {};
      setclickedLike(storedLikes);
    }
  }, [userData?._id]);

  const handleSvgClick = (_id) => {
    if (!userData || !userData._id) return;
    setclickedLike((prev) => {
      const updatedLikes = {
        ...prev,
        [_id]: !prev[_id],
      };

      localStorage.setItem(`likedPosts_${userData._id}`, JSON.stringify(updatedLikes));

      // Perform like/unlike action
      if (!prev[_id]) {
        updateLikeorUnlike(_id, userData._id, "like");
      } else {
        updateLikeorUnlike(_id, userData._id, "unlike");
      }

      return updatedLikes;
    });
  };

  const updateLikeorUnlike = async (postId, userId, action) => {
    try {
      const url = action === 'like' 
        ? 'https://opportunest-1.onrender.com/api/auth/like'
        : 'https://opportunest-1.onrender.com/api/auth/unlike';

      const res = await axios({
        method: action === 'like' ? 'POST' : 'DELETE',
        url,
        data: { postId, userId },
      });

      if (res.status === 200) {
        console.log(`${action === 'like' ? "Like" : "Unlike"} status updated successfully.`);
      } else {
        console.log(`Failed to update ${action === 'like' ? "like" : "unlike"} status.`);
      }
    } catch (error) {
      console.error(`Error sending ${action} data:`, error);
    }
  };

  // Fetch all users' data
  const getalldata = async () => {
    try {
      const res = await axios.get('https://opportunest-1.onrender.com/api/auth/getalldata', {
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

  // Post to the community
  const postCommunity = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://opportunest-1.onrender.com/api/auth/post', {
        email,
        sharedtext,
      });

      if (res.status === 422 || !res.data) {
        window.alert("Invalid submission");
      } else {
        window.alert("Post shared");
        setPostModal(false);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const userImage = userData && userData.image 
  ? `https://opportunest-1.onrender.com/Images/${userData.image}` // Display the uploaded image
  : avatar; // Default avatar if no image is uploaded

   // Default avatar if no image is uploaded
  


  return (
    <div className="whole-div">
      <AccountDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <div className="community-container">
        <section className="community-left">
          <div className="profile-section">
            <img src={userImage} alt="profile-phtoto" />
            <span>{userData?.basicdata?.[0]?.firstname || ""} {userData?.basicdata?.[0]?.lastname || ""}</span>
          </div>
          <div className="profile-stats">
            <div>
              <span>Posts</span>
              <span>{userData?.posts?.length || 0}</span>
            </div>
            <div>
              <span>Followers</span>
              <span>10</span>
            </div>
          </div>
        </section>

        <section className="community-middle">
          <div className="share-post">
            <img src={avatar} alt="profile_photo" className="profile-photo" />
            <button className="share-button" onClick={togglePostModal}>"{userData?.basicdata?.[0]?.firstname || ""}" Share a post</button>
          </div>

          {postModal && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-button" onClick={togglePostModal}>✕</button>
                <div className="modal-header">
                  <img src={userImage} alt="profile_photo" className="profile-photo" />
                  <span className="username">{userData?.basicdata?.[0]?.firstname || ""} {userData?.basicdata?.[0]?.lastname || ""}</span>
                </div>
                <div className="modal-body">
                  <textarea
                    className="post-input"
                    placeholder="Share something with your friends"
                    onChange={(e) => setSharedText(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="post-button" onClick={postCommunity} >Post</button>
                </div>
              </div>
            </div>
          )}

          {/* Map through all users' data and display them */}
          {alluserdata.length > 0 ? (
            alluserdata.map((user, index) =>
              user.posts?.map((post, postIndex) => (
                <div key={`${index}-${postIndex}`} className="post-content">
                 <Link className="post-link" to={`/profile/${user.basicdata[0].firstname}-${user.basicdata[0].lastname}/${user._id}`} > <div className="user-info">
                  <img src={user && user.image ?`https://opportunest-1.onrender.com/Images/${user.image}` : avatar} alt="profile_photo" className="profile-photo" />
                    <div className="span-content">
                      {user.basicdata?.length > 0 ? (
                        <>
                          <span className="main-text-span">
                           {user.basicdata[0].firstname || "Unknown"} {user.basicdata[0].lastname || "User"}
                            <span className="second-span-text"> | {user.basicdata[0].profession || "Unknown Profession"}</span>
                          </span>
                          <span className="main-text-span">
                            <span className="attends-span-text">at</span>    {user.basicdata[0].professionplace || "Unknown Institution"}
                          </span>
                        </>
                      ) : (
                        <span className="main-text-span">No basic data available</span>
                      )}
                    </div>
                  </div></Link>
                  <div className="post-item">
                    <p>{post.sharedtext || "No content available"}</p>
                  </div>
                  <div><span>{post.likes?.length || 0} likes</span></div>
                  <div className="like-comment-share">
                    <div className="like">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={clickedLike[post._id] ? 'red' : 'white'} stroke={clickedLike[post._id] ? 'red' : 'black'} onClick={() => handleSvgClick(post._id)} className="reaction-svg">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                      </svg>
                      <span className="reaction">Like</span>
                    </div>
                    <div className="comment">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="reaction-svg">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 9h8" />
                        <path d="M8 13h6" />
                        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                      </svg>
                      <span className="reaction">Comment</span>
                    </div>
                    <div className="share">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="reaction-svg">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                      </svg>
                      <span className="reaction">Share</span>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <p>No users available</p>
          )}
        </section>

        <section className="community-right"></section>
      </div>
      </div>
  );
};

export default Community;
