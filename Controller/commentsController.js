// controllers/commentController.js
const Posts = require('../model/Posts'); // Import the Post model

// Add a new comment to a post
const addComment = async (req, res) => {
  const { username, content } = req.body;

  try {
    // Find the post by ID
    const post = await Posts.findOne({ _id: req.params.id }).exec();
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create a new comment
    const newComment = { username, content };

    // Add the comment to the comments array
    post.comments.push(newComment);

    // Save the updated post document
    await post.save();

    // Return the updated comments array
    res.status(201).json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
};

// Get all comments for a post
const getComments = async (req, res) => {
  try {
    // Find the post by ID and select only the comments
    const post = await Posts.findOne({ _id: req.params.id }).select('comments');
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Return the comments array
    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};

// Delete a specific comment from a post
const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

  try {
    // Find the post by ID
    const post = await Posts.findOne({ _id: postId }).exec(); // Use postId here instead of req.params.id
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Remove the comment from the comments array
    post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

       await post.save();

    // Return the updated comments array
    res.json({ message: 'Comment deleted successfully.', comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete comment.' });
  }
};

// Export the functions
module.exports = { addComment, getComments, deleteComment };
