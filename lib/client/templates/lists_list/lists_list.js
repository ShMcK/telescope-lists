// ----------------------------------- Post List -----------------------------------//

Template.lists_list.created = function() {
  Session.set('listsListPopulatedAt', new Date());
};

Template.lists_list.helpers({
  listsLayout: function () {
    return Settings.get('listsLayout', 'lists-list');
  },
  description: function () {
    var controller = Iron.controller();
    if (typeof controller.getDescription === 'function')
      return Iron.controller().getDescription();
  },
  listsCursor : function () {
    if (this.listsCursor) { // not sure why this should ever be undefined, but it can apparently
      var lists = this.listsCursor.map(function (list, index) {
        list.rank = index;
        return list;
      });
      return lists;
    } else {
      console.log('listsCursor not defined');
    }
  }
});

// ----------------------------------- Incoming -----------------------------------//

Template.listsListIncoming.events({
  'click .show-new': function() {
    Session.set('listsListPopulatedAt', new Date());
  }
});

// ----------------------------------- Load More -----------------------------------//

Template.listsLoadMore.helpers({
  listsReady: function () {
    return this.listsReady;
  },
  hasPosts: function () {
    return !!this.listsCursor.count();
  }
});

Template.listsLoadMore.events({
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
