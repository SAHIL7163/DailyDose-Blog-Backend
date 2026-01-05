const express = require("express");
const app = express();
const router = express.Router();
const PostsController = require("../../Controller/PostsController");
const likeDislikeController = require("../../Controller/likeDislikeController");
const commentController = require("../../Controller/commentsController");

const verifyJWT = require("../../middleware/verifyJWT");
const ROLES_LIST = require("../../Config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

const storage = require("../../utils/cloudinary");
const multer = require("multer");
const upload = multer({ storage: storage });

router
  .route("/")
  .get(PostsController.getAllPosts)
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    upload.single("image"),
    PostsController.createNewPost
  );

router.route("/:id/like").put(likeDislikeController.likeDislikePost);

router
  .route("/:id/comments")
  .get(commentController.getComments)
  .post(commentController.addComment);

router
  .route("/:postId/comments/:commentId")
  .delete(commentController.deleteComment);

router
  .route("/:id")
  .get(
    verifyJWT,
    verifyRoles(ROLES_LIST.User, ROLES_LIST.Admin, ROLES_LIST.Editor),
    PostsController.getPost
  )
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), PostsController.deletePost)
  .put(
    verifyJWT,
    upload.single("image"),
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    PostsController.updatePost
  );

module.exports = router;
