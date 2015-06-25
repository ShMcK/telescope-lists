/**
 * Insert a list in the database (note: optional list properties not listed here)
 * @param {Object} list - the post being inserted
 * @param {string} list.userId - the id of the user the list belongs to
 * @param {string} list.title - the list's title
 */
Lists.submit = function (list) {

  var userId = list.userId, // at this stage, a userId is expected
    user = Users.findOne(userId);

  // ------------------------------ Checks ------------------------------ //

  // check that a title was provided
  if (!list.title)
    throw new Meteor.Error(602, i18n.t('please_fill_in_a_title'));

  // check that there are no lists with the same URL
  //if(!!post.url)
  //  Posts.checkForSameUrl(post.url, user);

  // ------------------------------ Properties ------------------------------ //

  var defaultProperties = {
    createdAt: new Date(),
    author: Users.getDisplayNameById(userId),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    clickCount: 0,
    viewCount: 0,
    baseScore: 0,
    score: 0,
    inactive: false,
    //sticky: false,
    posts: []
  };

  list = _.extend(defaultProperties, list);

  list.createdAt = new Date();

  // clean up post title
  list.title = Telescope.utils.cleanUp(list.title);

  // ------------------------------ Callbacks ------------------------------ //

  // run all post submit server callbacks on list object successively
  list = Telescope.callbacks.run("listSubmit", list);

  // -------------------------------- Insert ------------------------------- //

  list._id = Lists.insert(list);

  // --------------------- Server-Side Async Callbacks --------------------- //

  Telescope.callbacks.runAsync("listSubmitAsync", list);

  return list;
};