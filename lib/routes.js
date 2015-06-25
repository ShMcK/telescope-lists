/**
 * The Lists.controllers namespace
 * @namespace Lists.controllers
 */

Lists.controllers = {};

/**
 * Controller for all lists lists
 */
Lists.controllers.list = RouteController.extend({

  template: "lists_list_controller",

  onBeforeAction: function () {
    var showViewsNav = (typeof this.showViewsNav === 'undefined') ? true : this.showViewsNav;

    if (showViewsNav) {
      this.render('lists_list_top', {to: 'listsListTop'});
    }
    this.next();
  },

  data: function () {

    var terms = {
      view: this.view,
      limit: this.params.limit || Settings.get('listsPerPage', 10)
    };

     console.log('----------------- router running');

    // note: the list list controller template will handle all subscriptions, so we just need to pass in the terms
    return {
      terms: terms
    };
  },

  getTitle: function () {
    return i18n.t(this.view);
  },

  getDescription: function () {
    if (Router.current().route.getName() === 'lists_default') { // return site description on root path
      return Settings.get('description');
    } else {
      return i18n.t(_.findWhere(Telescope.menuItems.get("viewsMenu"), {label: this.view}).description);
    }
  },

  fastRender: true
});

var getDefaultViewController = function () {
  var defaultView = Settings.get('defaultView', 'top');
  // if view we got from settings is available in Lists.views object, use it
  if (!!Lists.controllers[defaultView]) {
    return Lists.controllers[defaultView];
  } else {
    return Lists.controllers.top;
  }
};

// wrap in startup block to make sure Settings list is defined
Meteor.startup(function () {
  Lists.controllers.default = getDefaultViewController().extend({
    getTitle: function () {
      var title = Settings.get('title', 'Telescope');
      var tagline = Settings.get('tagline');
      return !!tagline ? title + ' – ' + tagline : title ;
    }
  });

});

/**
 * Controller for top view
 */
Lists.controllers.top = Lists.controllers.list.extend({
  view: 'top'
});

/**
 * Controller for new view
 */
Lists.controllers.new = Lists.controllers.list.extend({
  view: 'new'
});

/**
 * Controller for best view
 */
Lists.controllers.best = Lists.controllers.list.extend({
  view: 'best'
});

/**
 * Controller for single list page
 */
Lists.controllers.page = RouteController.extend({

  template: 'list_page',

  waitOn: function() {
    this.listSubscription = coreSubscriptions.subscribe('singleList', this.params._id);
    this.postSubscription = coreSubscriptions.subscribe('singlePost', this.params._id);
    this.listUsersSubscription = coreSubscriptions.subscribe('listUsers', this.params._id);
    this.commentSubscription = coreSubscriptions.subscribe('commentsList', {view: 'listComments', listId: this.params._id});
  },

  list: function() {
    return Lists.findOne(this.params._id);
  },

  getTitle: function () {
    if (!!this.list())
      return this.list().title;
  },

  onBeforeAction: function() {
    if (! this.list()) {
      if (this.listSubscription.ready() && this.postSubscription.ready()) {
        this.render('not_found');
      } else {
        this.render('loading');
      }
    } else {
      this.next();
    }
  },

  onRun: function() {
    var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
    Meteor.call('increaseListViews', this.params._id, sessionId);
    this.next();
  },

  data: function() {
    return this.list();
  },
  fastRender: true
});

Meteor.startup(function () {

  Router.route('/lists', {
    name: 'lists_default',
    controller: Lists.controllers.default
  });

  Router.route('/lists/top/:limit?', {
    name: 'lists_top',
    controller: Lists.controllers.top
  });

  // New

  Router.route('/lists/new/:limit?', {
    name: 'lists_new',
    controller: Lists.controllers.new
  });

  // Best

  Router.route('/lists/best/:limit?', {
    name: 'lists_best',
    controller: Lists.controllers.best
  });

  // List Page

  Router.route('/lists/:_id', {
    name: 'list_page',
    controller: Lists.controllers.page
  });

  Router.route('/lists/:_id/comment/:commentId', {
    name: 'list_page_comment',
    controller: Lists.controllers.page,
    onAfterAction: function () {
      // TODO: scroll to comment position
    }
  });

  // List Edit

  Router.route('/lists/:_id/edit', {
    name: 'list_edit',
    template: 'list_edit',
    waitOn: function () {
      return [
        coreSubscriptions.subscribe('singleList', this.params._id),
        coreSubscriptions.subscribe('allUsersAdmin')
      ];
    },
    data: function() {
      return {
        listId: this.params._id,
        list: Lists.findOne(this.params._id)
      };
    },
    fastRender: true
  });
//
//  // List Submit

  Router.route('/lists/submit', {
    name: 'list_submit',
    template: 'list_submit',
    waitOn: function () {
      return coreSubscriptions.subscribe('allUsersAdmin');
    }
  });

});
