import { Comment } from './Comment';
import { Reaction } from './Reaction';
import { Reply } from './Reply';
import { Topic } from './Topic';
import { User } from './User';

Comment.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });
Topic.hasMany(Comment, { foreignKey: 'topicId', as: 'comments' });

Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });

Reply.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
Comment.hasMany(Reply, { foreignKey: 'commentId', as: 'replies' });

Reply.belongsTo(Reply, { foreignKey: 'parentReplyId', as: 'parentReply' });
Reply.hasMany(Reply, { foreignKey: 'parentReplyId', as: 'childReplies' });

Reaction.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });
Comment.hasMany(Reaction, { foreignKey: 'commentId', as: 'reactions' });

Topic.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Topic, { foreignKey: 'userId', as: 'topics' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

Reply.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Reply, { foreignKey: 'userId', as: 'replies' });

Reaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Reaction, { foreignKey: 'userId', as: 'reactions' });

export { Topic, Comment, Reply, Reaction, User };
