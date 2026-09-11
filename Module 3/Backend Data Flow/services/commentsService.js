const postsRepo = require('./../repository/postsRepo');
const commentsRepo = require('./../repository/commentsRepo');
const AppError = require('./../utils/AppError');

/**
 * TODO (Multi-step workflow): add a comment to a post.
 * All checks happen before any write.
 */
exports.addComment = async (postId, userId, body) => {
  // 1. The post must exist
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. The post must not be locked
  if (post.locked) {
    throw new AppError('Post is locked for new comments', 409);
  }

  // 3. Insert the comment
  const comment = await commentsRepo.insert({
    postId,
    authorId: userId,
    body
  });

  // 4. Bump the post's comment count
  await postsRepo.incrementCommentCount(postId);

  // 5. Return the created comment
  return comment;
};