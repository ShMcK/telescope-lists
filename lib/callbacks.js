/**
 * Increment the user's list count and upvote the poconsole.log(Lists.find().count());
 */
function afterListSubmitOperations (list) {
  var userId = list.userId,
    listAuthor = Meteor.users.findOne(userId);

  Meteor.users.update({_id: userId}, {$inc: {"telescope.listCount": 1}});
  Telescope.upvoteItem(Lists, list, listAuthor);
  return list;
}
Telescope.callbacks.add("listSubmitAsync", afterListSubmitOperations);