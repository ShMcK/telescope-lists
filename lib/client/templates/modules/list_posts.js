Template.list_posts.helpers({
  postIds: function () {
    return Posts.find({_id: {$in: this.postIds}});
  }
});