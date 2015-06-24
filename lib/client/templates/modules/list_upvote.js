Template.list_upvote.helpers({
  upvoted: function(){
    var user = Meteor.user();
    if(!user) return false;
    return _.include(this.upvoters, user._id);
  }
});

Template.list_upvote.events({
  'click .upvote-link': function(e){
    var list = this;
    e.preventDefault();
    if(!Meteor.user()){
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    Meteor.call('upvoteList', list, function(){
      Events.track("list upvoted", {'_id': list._id});
    });
  }
});
