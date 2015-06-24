/**
 * List views are filters used for subscribing to and viewing lists
 * @namespace Posts.views
 */
Lists.views = {};

/**
 * Add a list view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Lists.views.add = function (viewName, viewFunction) {
  Lists.views[viewName] = viewFunction;
};

/**
 * Base parameters that will be common to all other view unless specific properties are overwritten
 */
Lists.views.baseParameters = {
  find: {},
  options: {
    limit: 10
  }
};

/**
 * Top view
 */
Lists.views.add("top", function (terms) {
  return {
    options: {sort: {sticky: -1, score: -1}}
  };
});

/**
 * New view
 */
Lists.views.add("new", function (terms) {
  return {
    options: {sort: {sticky: -1, createdAt: -1}}
  };
});

/**
 * Best view
 */
Lists.views.add("best", function (terms) {
  return {
    options: {sort: {sticky: -1, baseScore: -1}}
  };
});


/**
 * User lists view
 */
Lists.views.add("userLists", function (terms) {
  return {
    find: {userId: terms.userId},
    options: {limit: 5, sort: {createdAt: -1}}
  };
});

/**
 * User upvoted lists view
 */
Lists.views.add("userUpvotedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var listsIds = _.pluck(user.telescope.upvotedPosts, "itemId");
  return {
    find: {_id: {$in: listsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {createdAt: -1}}
  };
});

/**
 * User downvoted lists view
 */
Lists.views.add("userDownvotedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var listsIds = _.pluck(user.telescope.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    find: {_id: {$in: listsIds}},
    options: {limit: 5, sort: {createdAt: -1}}
  };
});