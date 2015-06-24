Template.list_admin.helpers({
  showApprove: function () {
    return this.status === Lists.config.STATUS_PENDING;
  },
  showUnapprove: function(){
    return !!Settings.get('requireListsApproval') && this.status === Lists.config.STATUS_APPROVED;
  },
  shortScore: function(){
    return Math.floor(this.score*1000)/1000;
  }
});

Template.list_admin.events({
  'click .approve-link': function(e){
    Meteor.call('approveList', this);
    e.preventDefault();
  },
  'click .unapprove-link': function(e){
    Meteor.call('unapproveList', this);
    e.preventDefault();
  }
});
