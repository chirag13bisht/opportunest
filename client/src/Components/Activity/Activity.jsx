import React, { useState, useEffect } from 'react';
import avatar from '../../image/avatar.jpg';
import './Activity.css';
import axios from 'axios'; // Import Axios

const Activity = ({ userData ,LogedUserId}) => {
    const [clickedLike, setClickedLike] = useState({});
    const [visiblePosts, setVisiblePosts] = useState(2); // Initially show only 2 posts

    // Use the passed `userData` to populate posts
    const userDataPost = userData?.posts || [];

    useEffect(() => {
        if (userData && LogedUserId) {
            const storedLikes = JSON.parse(localStorage.getItem(`likedPosts_${LogedUserId}`)) || {};
            setClickedLike(storedLikes);
        }
    }, [LogedUserId]);

    const handleSvgClick = (_id) => {
        if (!userData || !LogedUserId) return;
        setClickedLike((prev) => {
            const updatedLikes = {
                ...prev,
                [_id]: !prev[_id], // Toggle the like status
            };

            localStorage.setItem(`likedPosts_${LogedUserId}`, JSON.stringify(updatedLikes));

            if (!prev[_id]) {
                console.log("like"); // If previously not liked, it's now liked
                updateLikeorUnlike(_id, LogedUserId, "like");
            } else {
                console.log("delete"); // If previously liked, it's now unliked
                updateLikeorUnlike(_id, LogedUserId, "unlike");
            }

            return updatedLikes;
        });
    };

    const updateLikeorUnlike = async (postId, userId, action) => {
        try {
            const url = action === 'like'
                ? 'https://opportunest-1.vercel.app/api/auth/like'
                : 'https://opportunest-1.vercel.app/api/auth/unlike'; // Assuming this endpoint for unlike

            const response = await axios({
                method: action === 'like' ? 'post' : 'delete',
                url,
                data: { postId, userId },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log(`${action === 'like' ? "Like" : "Unlike"} status updated successfully.`);
            } else {
                console.log(`Failed to update ${action === 'like' ? "like" : "unlike"} status.`);
            }
        } catch (error) {
            console.error(`Error sending ${action} data:`, error);
        }
    };

    const showMorePosts = () => {
        setVisiblePosts(userDataPost.length); // Show all posts
    };

    const showLessPosts = () => {
        setVisiblePosts(2); // Show only 2 posts
    };

    const imageSrc = userData && userData.image 
    ? `https://opportunest-1.vercel.app/Images/${userData.image}` // Display the uploaded image
    : avatar; // Default avatar if no image is uploaded

    return (
        <div>
            {userDataPost.length > 0 ? (
                <>
                    {userDataPost.slice(0, visiblePosts).map((post, postIndex) => (
                        <div key={postIndex} className="post-content-activity">
                            <div className="user-info-activity">
                                <img src={imageSrc} alt="profile_photo" className="profile-photo" />
                                <div className="span-content">
                                    <span className="main-text-span">
                                        {userData?.basicdata?.[0]?.firstname || "Unknown"} {userData?.basicdata?.[0]?.lastname || "User"}
                                        <span className="second-span-text"> | {userData?.basicdata?.[0]?.profession || "Unknown Profession"}</span>
                                    </span>
                                    <span className="main-text-span">
                                        <span className="second-span-text">attends</span> {userData?.basicdata?.[0]?.professionplace || "Unknown Institution"}
                                    </span>
                                </div>
                            </div>
                            <div className="post-item">
                                <p>{post.sharedtext || "No content available"}</p>
                            </div>
                            <div><span>{post.likes ? post.likes.length : 0} likes</span></div>
                            <div className="like-comment-share-activity">
                                <div className="like-activity">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={clickedLike[post._id] ? 'red' : 'white'} stroke={clickedLike[post._id] ? 'red' : 'black'}
                                        onClick={() => handleSvgClick(post._id)} className="reaction-svg">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                    </svg>
                                    <span className="reaction">Like</span>
                                </div>
                                <div className="comment-activity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="reaction-svg">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9h8" /><path d="M8 13h6" />
                                        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                                    </svg>
                                    <span className="reaction">Comment</span>
                                </div>
                                <div className="share-activity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="reaction-svg">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                                    </svg>
                                    <span className="reaction">Share</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Conditionally show the "Show more" or "Show less" button */}
                    {userDataPost.length > visiblePosts ? (
                        <span onClick={showMorePosts} className="show-more">Show More</span>
                    ) : userDataPost.length > 2 ? (
                        <span onClick={showLessPosts} className="show-more">Show Less</span>
                    ) : null}
                </>
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Activity;
