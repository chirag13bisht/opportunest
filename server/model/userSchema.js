const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    image: String,

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],

    basicdata: [
        {
            firstname: {
                type: String,
                required: true,
            },
            lastname: {
                type: String,
                required: true,
            },
            profession: {
                type: String,
                required: true,
            },
            professionplace: {
                type: String,
                required: true,
            }

        }
    ],
    posts: [
        {
            sharedtext: {
                type: String,
                required: true,
            },
            likes: [
                {
                    userId: {
                        type: String, // Assuming users are tracked by ObjectId
                        required: true, // Reference to the User model
                    },
                    likedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ]
        }
    ],
    followers:[
        {
            followersId:{
                type:String,
                required: true,
            },
            followedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    following:[
        {
            followingId:{
                type:String,
                required: true,
            },
            followingdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

userSchema.methods.generateAuthToken = async function () {
    try {

        let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'  // Adjust the expiration as needed
        });
        this.tokens = this.tokens.concat({ token: token });

        // Save the user document to persist the token
        await this.save();
        return token;
    } catch (error) {
        console.error(error);
        throw new Error('Unable to generate token');
    }
};
userSchema.methods.addBasicDetails = async function (firstname, lastname, profession, professionplace) {
    try {
        this.basicdata.push({ firstname, lastname, profession, professionplace });
        await this.save();
        return this.basicdata;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

userSchema.methods.addUserPost = async function (sharedtext) {
    try {
        this.posts.push({ sharedtext });
        await this.save();
        return this.posts;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
userSchema.methods.addUserId = function(postId, userId) {
    const post = this.posts.id(postId);
    
    // Check if the post is found
    if (!post) {
        throw new Error("Post not found.");
    }

    // Initialize the likes array if not already present
    if (!post.likes) {
        post.likes = []; 
    }

    // Check if the user already liked the post to avoid duplicate likes
    const alreadyLiked = post.likes.some(like => like.userId.toString() === userId);
    if (alreadyLiked) {
        throw new Error("User already liked this post.");
    }

    // Add the userId to the likes array
    post.likes.push({ userId });

    // Return the updated post
    return post;
};

const User = mongoose.model('USER', userSchema);
module.exports = User;