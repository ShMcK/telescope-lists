/**
 * Lists schema
 * @type {SimpleSchema}
 */
var listsSchema = new SimpleSchema({
  /**
   ID
   */
  _id: {
    type: String,
    optional: true
  },
  /**
   Timetstamp of list creation
   */
  createdAt: {
    type: Date,
    optional: true
  },
  posts: {
    type: [String],
    optional: true,
    editableBy: ["member", "admin"]
  },

  /**
   Title
   */
  title: {
    type: String,
    optional: false,
    editableBy: ["member", "admin"]
  },
  /**
   Post body (markdown)
   */
  body: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      rows: 5
    }
  },
  /**
   HTML version of the post body
   */
  htmlBody: {
    type: String,
    optional: true
  },
  /**
   Count of how many times the post's page was viewed
   */
  viewCount: {
    type: Number,
    optional: true
  },
  /**
   Count of the post's comments
   */
  commentCount: {
    type: Number,
    optional: true
  },
  /**
   An array containing the `_id`s of commenters
   */
  commenters: {
    type: [String],
    optional: true
  },
  /**
   Timestamp of the last comment
   */
  lastCommentedAt: {
    type: Date,
    optional: true
  },
  /**
   Count of how many times the post's link was clicked
   */
  clickCount: {
    type: Number,
    optional: true
  },
  /**
   The post's base score (not factoring in the post's age)
   */
  baseScore: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
   How many upvotes the post has received
   */
  upvotes: {
    type: Number,
    optional: true
  },
  /**
   An array containing the `_id`s of the post's upvoters
   */
  upvoters: {
    type: [String],
    optional: true
  },
  /**
   How many downvotes the post has received
   */
  downvotes: {
    type: Number,
    optional: true
  },
  /**
   An array containing the `_id`s of the post's downvoters
   */
  downvoters: {
    type: [String],
    optional: true
  },
  /**
   The post's current score (factoring in age)
   */
  score: {
    type: Number,
    decimal: true,
    optional: true
  },
  /**
   Whether the post is inactive. Inactive posts see their score recalculated less often
   */
  inactive: {
    type: Boolean,
    optional: true
  },
  /**
   The post author's name
   */
  author: {
    type: String,
    optional: true
  },
  /**
   The post author's `_id`.
   */
  userId: {
    type: String, // XXX
    optional: true,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      options: function () {
        return Meteor.users.find().map(function (user) {
          return {
            value: user._id,
            label: Users.getDisplayName(user)
          };
        });
      }
    }
  }
});

Lists.attachSchema(listsSchema);

// schema transforms
//Lists.schema.internationalize();

//////////////////////////////////////////////////////
// List Hooks                                 //
// https://atmospherejs.com/matb33/list-hooks //
//////////////////////////////////////////////////////

/**
 * Generate HTML body from Markdown on post insert
 */
Lists.before.insert(function (userId, doc) {
  if(!!doc.body)
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

/**
 * Generate HTML body from Markdown when post body is updated
 */
Lists.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
});