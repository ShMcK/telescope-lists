Lists._ensureIndex({"createdAt": 1, "baseScore": -1});

// Publish a list of lists

Meteor.publish('listsList', function(terms) {
  if(Users.can.viewById(this.userId)){
    var parameters = Lists.getSubParams(terms),
      lists = Lists.find(parameters.find, parameters.options);

    return lists;
  }
  return [];
});

// Publish all the users that have posted the currently displayed list of lists
// plus the commenters for each post

Meteor.publish('listsListUsers', function(terms) {
  if(Users.can.viewById(this.userId)){
    var parameters = Lists.getSubParams(terms),
      lists = Lists.find(parameters.find, parameters.options),
      userIds = _.pluck(lists.fetch(), 'userId');

    // for each post, add first four commenter's userIds to userIds array
    lists.forEach(function (list) {
      userIds = userIds.concat(_.first(list.commenters,4));
    });

    userIds = _.unique(userIds);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.avatarProperties, multi: true});
  }
  return [];
});

// Publish a single post

Meteor.publish('singleList', function(id) {
  if (Users.can.viewById(this.userId)){
    return Lists.find(id);
  }
  return [];
});

// Publish author of the current list, authors of its comments, and upvoters of the post

Meteor.publish('listUsers', function(listId) {
  if (Users.can.viewById(this.userId)){
    // publish post author and post commenters
    var list = Lists.findOne(listId);
    var users = [];

    if (list) {

      users.push(list.userId); // publish post author's ID

      // get IDs from all commenters on the post
      var comments = Comments.find({listId: list._id}).fetch();
      if (comments.length) {
        users = users.concat(_.pluck(comments, "userId"));
      }

      // publish upvoters
      if (list.upvoters && list.upvoters.length) {
        users = users.concat(list.upvoters);
      }

      // publish downvoters
      if (list.downvoters && list.downvoters.length) {
        users = users.concat(list.downvoters);
      }

    }

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});
  }
  return [];
});
