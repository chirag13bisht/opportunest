const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../model/userSchema"); // Import User model
const authenticate = require("../middleware/authenticate");
const multer = require('multer');
const upload = require("../middleware/StoreImage")

// Test route
router.get("/", (req, res) => {
    res.status(200).send("Hello World");
});

// User login route

router.post('/logup', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill in all the data" });
        }

        const userLogin = await User.findOne({ email });
       

        if (userLogin) {

            token = await userLogin.generateAuthToken();
            
           res.cookie("jwtoken", token, {
               expires: new Date(Date.now() + 25892000000),
               httpOnly: true,
               sameSite: 'None', // Allows cross-origin requests to work
               secure: true, // Ensure this is set if using HTTPS
               path: '/' // Set the path for the cookie
});
               
               
          

            console.log("Cookie Set: jwtoken"); 
            
            // Direct password comparison (this assumes you are storing plain text passwords, which is not secure)
            if (password !== userLogin.password) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
             else{
              
            res.json({ message: "Login successful" });
             }
            
        } else {
            res.status(400).json({ error: "User not found" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/emailCheck', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if email exists in the user list
      const userLogin = await User.findOne({ email });
  
      if (!userLogin) {
        // Return 400 if email is not found
        return res.status(400).json({ error: 'Email not found' });
      }
  
      // If email is found, return success
      res.status(200).json({ message: 'Email found' });
    } catch (error) {
      // Log the error for debugging
      console.error('Error in emailCheck route:', error);
  
      // Return 500 if an error occurs
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password ) {
        return res.status(422).json({ error: "plz fill" });
    }
    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "already exist" });

        }
        else {
            const user = new User({email, password });
            await user.save();
            res.status(201).json({ message: "succesfull register " });
        }

    } catch (error) {
        console.log(error);
    }


});
router.get('/user', authenticate ,(req,res)=>{
    res.send(req.rootUser);
     
 })

 router.post('/userdata',async(req, res) => {
    try {
        const { email,firstname, lastname, profession, professionplace } = req.body;
        // Check if all required fields are provided
        if (!firstname || !lastname || !profession || !professionplace|| !email) {
            return res.json({ error: "Please fill in all the fields." });
        }

        // Find the user by their user ID (or email if preferred)
        const userGot = await User.findOne({ email:email});
      
        // If user is found, add user details
        if (userGot) {
            // Assuming you have a method to add basic data to user
            const userBasicDetails = await userGot.addBasicDetails(
                firstname, lastname, profession, professionplace
            );
            

            // Save the updated user document
            await userGot.save();

            res.status(201).json({ message: "User details added successfully." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error." });
    }
});

router.post('/post',async(req, res) => {
    try {
        const { email,sharedtext } = req.body;
        // Check if all required fields are provided
        if (!sharedtext|| !email) {
            return res.json({ error: "Please fill in all the fields." });
        }

        // Find the user by their user ID (or email if preferred)
        const userGot = await User.findOne({ email:email});
      
        // If user is found, add user details
        if (userGot) {
            // Assuming you have a method to add basic data to user
            const userPost = await userGot.addUserPost(
                sharedtext
            );
            

            // Save the updated user document
            await userGot.save();

            res.status(201).json({ message: "User details added successfully." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error." });
    }
});
router.get("/getalldata", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    
    // Send the user data as a response
    res.status(200).json({
       users
    });
  
  } catch (error) {
    // Handle any errors that occur
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
});

router.get('/jobs', async (req, res) => {
    try {
      const apiUrl = `http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id={3db8d242}&app_key={94c932bd91d82b2ce8d929fbc8faf159}&results_per_page=20&what=javascript%20developer&content-type=application/json`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/like', async (req, res) => {
    try {
        const { postId, userId } = req.body;

        // Check if all required fields are provided
        if (!postId || !userId) {
            return res.status(400).json({ error: "Missing postId or userId." });
        }

        // Find the user who owns the post
        const user = await User.findOne({ 'posts._id': postId });

        if (!user) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Add the userId to the post's likes array
        user.addUserId(postId, userId);

        // Save the updated user document
        await user.save();

        res.status(201).json({ message: "Like added successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message || "Server error." });
    }
});
router.delete('/unlike', async (req, res) => {
    try {
        const { postId, userId } = req.body;

        if (!postId || !userId) {
            return res.status(400).json({ error: "Missing postId or userId." });
        }

        // Find the user that has the post with the given postId
        const user = await User.findOne({ 'posts._id': postId });

        if (!user) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Find the specific post by its postId in the user's posts array
        const post = user.posts.id(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found." });
        }

        // Find the index of the like that belongs to the userId
        const likeIndex = post.likes.findIndex(like => like.userId == userId);

        if (likeIndex === -1) {
            return res.status(404).json({ error: "Like not found for this user." });
        }

        // Remove the like from the array
        post.likes.splice(likeIndex, 1);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Like removed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});
router.post('/UploadingImage', upload.single('file'), (req, res) => {
    const userId = req.body.userId;  // Access the userId sent via form data
    const imageFilename = req.file.filename;  // Access the uploaded image file name

    // Now use the userId to update the user's record with the uploaded image
    User.updateOne({ _id: userId }, { $set: { image: imageFilename } })
        .then(result => res.json({ message: "Image uploaded successfully", result }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error uploading image" });
        });
});
router.post('/followinguser', async (req, res) => {
    try {
        const { logedUserId, FollowersId } = req.body; // Get logged in user ID and the ID of the user to follow

        if (!logedUserId || !FollowersId) {
            return res.status(400).json({ message: 'Missing required data.' });
        }

        // Find the logged-in user (who is following another user)
        const logedUser = await User.findById(logedUserId);
        if (!logedUser) {
            return res.status(404).json({ message: 'Logged in user not found.' });
        }

        // Find the user to be followed
        const followedUser = await User.findById(FollowersId);
        if (!followedUser) {
            return res.status(404).json({ message: 'User to be followed not found.' });
        }

        // Check if the user is already following this person
        const isAlreadyFollowing = logedUser.following.some(follow => follow.followingId === FollowersId);
        if (isAlreadyFollowing) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        // Add the FollowersId to the logged-in user's following array
        logedUser.following.push({ followingId: FollowersId });

        // Add the logedUserId to the followed user's followers array
        followedUser.followers.push({ followersId: logedUserId });

        // Save both user documents
        await logedUser.save();
        await followedUser.save();

        return res.status(200).json({ message: 'Successfully followed the user!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'This is protected data', user: req.rootUser });
});

router.get('/logout',(req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send("user logout");
})

 
  

module.exports = router;
