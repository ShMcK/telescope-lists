Template.list_page.helpers({
  isPending: function () {
    return this.status === Lists.config.STATUS_PENDING;
  }
});

Template.list_page.rendered = function(){
  $('body').scrollTop(0);
};
