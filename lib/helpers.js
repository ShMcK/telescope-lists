//////////////////
// List Helpers //
//////////////////

/**
 * Grab common list properties.
 * @param {Object} list
 */
Lists.getProperties = function (list) {
  var listAuthor = Meteor.users.findOne(list.userId);
  var p = {
    listAuthorName: Users.getDisplayName(listAuthor),
    listTitle: Telescope.utils.cleanUp(list.title),
    profileUrl: Users.getProfileUrlBySlugOrId(list.userId),
    listUrl: Lists.getPageUrl(list),
    thumbnailUrl: list.thumbnailUrl,
    posts: Lists.getFullPosts(list.posts),
    linkUrl: !!list.url ? Lists.getOutgoingUrl(list.url) : Lists.getPageUrl(list._id)
  };

  if (list.url)
    p.url = list.url;

  if (list.htmlBody)
    p.htmlBody = list.htmlBody;

  return p;
};


/**
 * Get URL of a list page.
 * @param {Object} list
 */
Lists.getPageUrl = function (list) {
  return Telescope.utils.getSiteUrl() + 'lists/' + list._id;
};

/**
 * Get list edit page URL.
 * @param {String} id
 */
Lists.getEditUrl = function (id) {
  return Telescope.utils.getSiteUrl() + 'Lists/' + id + '/edit';
};

/**
 * Return a list's link if it has one, else return its list page URL
 * @param {Object} list
 */
Lists.getLink = function (list) {
  return !!list.url ? Lists.getOutgoingUrl(list.url) : this.getPageUrl(list);
};

/**
 * When on a list page, return the current list
 */
Lists.current = function () {
  return Lists.findOne(Router.current().data()._id);
};

Lists.getOutgoingUrl = function (url) {
  return Telescope.utils.getRouteUrl('out', {}, {query: {url: url}});
};

Lists.getFullPosts = function (postIds) {
  var get = Posts.find({_id: {$in: postIds}});
  console.log('getFullPosts');
  console.log(get);
  return get;
};