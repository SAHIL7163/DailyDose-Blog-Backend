const Posts = require('../model/Posts');

const likeDislikePost = async (req, res) => {
    try {
        const { username, action } = req.body;

        const post = await Posts.findOne({ _id: req.params.id }).exec();
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (action === 'like') {
            if (post.usersLiked.includes(username)) {
                // Remove the like if the user already liked the post
                post.usersLiked = post.usersLiked.filter((user) => user !== username);
                post.likes -= 1;
            } else {
                // Remove dislike if present
                if (post.usersDisliked.includes(username)) {
                    post.usersDisliked = post.usersDisliked.filter((user) => user !== username);
                    post.dislikes -= 1;
                }
                // Add the like
                post.usersLiked.push(username);
                post.likes += 1;
            }
        } else if (action === 'dislike') {
            if (post.usersDisliked.includes(username)) {
                // Remove the dislike if the user already disliked the post
                post.usersDisliked = post.usersDisliked.filter((user) => user !== username);
                post.dislikes -= 1;
            } else {
                // Remove like if present
                if (post.usersLiked.includes(username)) {
                    post.usersLiked = post.usersLiked.filter((user) => user !== username);
                    post.likes -= 1;
                }
                // Add the dislike
                post.usersDisliked.push(username);
                post.dislikes += 1;
            }
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await post.save();

        // Return the updated post with the new like/dislike count
        res.status(200).json({
            likes: post.likes,
            dislikes: post.dislikes,
            usersLiked: post.usersLiked,
            usersDisliked: post.usersDisliked,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { likeDislikePost };
