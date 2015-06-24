Template.lists_list_compact.helpers({
  listsCursor: function () {
    if (this.listsCursor) { // not sure why this should ever be undefined, but it can apparently
      var lists = this.listsCursor.map(function (list, index) {
        list.rank = index;
        return list;
      });
      return lists;
    } else {
      console.log('listsCursor not defined');
    }
  },
  fieldLabel: function () {
    return this.controllerOptions.fieldLabel;
  },
  fieldValue: function () {
    var controllerOptions = Template.parentData(3).data.controllerOptions;
    return controllerOptions.fieldValue(this);
  }
});

Template.lists_list_compact.events({
  'click .more-button': function (event) {
    event.preventDefault();
    if (this.controllerInstance) {
      // controller is a template
      this.loadMoreHandler(this.controllerInstance);
    } else {
      // controller is router
      this.loadMoreHandler();
    }
  }
});
