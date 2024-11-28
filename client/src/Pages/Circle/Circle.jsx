import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Circle.css'; // Import the CSS file
import avatar from "../../image/avatar.jpg";
import { Link } from 'react-router-dom'; 

const Circle = () => {
    const [alluserdata, setAllUserData] = useState([]);
    const [logedUserId, setLogedUserId] = useState(""); // State to store logged user ID
    const [searchTerm, setSearchTerm] = useState(""); // State for search filter
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [FollowersId, setFollowersId] = useState("")
    const [LogedUserFollowing, setLogedUserFollowing] = useState();
    const [LogedUserFollowers, setLogedUserFollowers] = useState();

    console.log(FollowersId)

    const callAbout = async () => {
        try {
            const res = await axios.get('https://opportunest-1.vercel.app/api/auth/user', {
                withCredentials: true, // to include cookies
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            setLogedUserId(res.data._id);
            setLogedUserFollowing(res.data.following);
            setLogedUserFollowers(res.data.followers);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch logged-in user data on mount
    useEffect(() => {
        callAbout();
    }, []);

    const getalldata = async () => {
        try {
            const res = await axios.get('https://opportunest-1.vercel.app/api/auth/getalldata', {
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
            setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
            console.log("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Fetch all users' data
    useEffect(() => {
        getalldata();
    }, []);

    const FollowingUser = async () => {

        try {
            const res = await axios.post('https://opportunest-1.vercel.app/api/auth/followinguser', {
                logedUserId,
                FollowersId,
            });

            if (res.status === 422 || !res.data) {
                window.alert("Invalid");
            } else {
                window.alert("Followed");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    // Filter the users based on the search term
    const filteredUsers = alluserdata
        .filter(user => user._id !== logedUserId) // Filter out logged-in user
        .filter(user => {
            const fullName = `${user.basicdata[0]?.firstname} ${user.basicdata[0]?.lastname}`.toLowerCase();
            const profession = user.basicdata[0]?.profession?.toLowerCase();
            return (
                fullName.includes(searchTerm.toLowerCase()) ||
                (profession && profession.includes(searchTerm.toLowerCase()))
            );
        });




    return (
        <div className="circle-page">
            <h1 className="circle-title">Build Your Circle</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by name or profession..."
                className="circle-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Loading Indicator */}
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="circle-container">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <div className="user-card" key={index}>
                                 <Link to={`/profile/${user.basicdata?.[0]?.firstname}-${user.basicdata?.[0]?.lastname}/${user._id}`}>
    <img
        src={user?.image ? `https://opportunest-1.vercel.app/Images/${user.image}` : avatar}
        alt={`${user.basicdata?.[0]?.firstname} ${user.basicdata?.[0]?.lastname}`}
        className="user-image"
    />
</Link>

                                
                                <div className="user-info">
                                    <h3>{user.basicdata[0]?.firstname} {user.basicdata[0]?.lastname}</h3>
                                    <p>{user.basicdata[0]?.profession} at {user.basicdata[0]?.professionplace}</p>
                                    {LogedUserFollowing && LogedUserFollowing.some(follow => follow.followingId === user._id) ? (
                                        <button className="follow-button">Followed</button>
                                    ) : (
                                        <button className="follow-button" onClick={() => { setFollowersId(user._id); FollowingUser(); }}>
                                            Follow
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No users found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Circle;
