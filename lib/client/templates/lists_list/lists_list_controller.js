// see https://www.discovermeteor.com/blog/template-level-subscriptions/

/*

 This template acts as the controller that sets and manages the reactive context
 for the embedded listsList template. It receives its parameters from a "caller" template.

 */

Template.lists_list_controller.onCreated(function () {

  // 1. Initialization (*not* reactive!)
  var instance = this;

  // initialize the reactive variables
  instance.terms = new ReactiveVar(instance.data.terms);
  instance.listsLimit = new ReactiveVar(Settings.get('listsPerPage', 10));

  // 2. Autorun

  // Autorun 1: when terms change, reset the limit
  instance.autorun(function () {
    // add a dependency on data context to trigger the autorun
    var terms = Template.currentData().terms; // ⚡ reactive ⚡
    instance.listsLimit.set(Settings.get('listsPerPage', 10));
  });

  // Autorun 2: will re-run when limit or terms are changed
  instance.autorun(function () {

    // get terms from data context
    var terms = Template.currentData().terms; // ⚡ reactive ⚡

    // get limit from local template variable
    var listsLimit = instance.listsLimit.get(); // ⚡ reactive ⚡

    // create new subscriptionTerms object using the new limit
    var subscriptionTerms = _.extend(_.clone(terms), {limit: listsLimit}); // extend terms with limit

    // use this new object to subscribe
    var listsSubscription = instance.subscribe('listsList', subscriptionTerms);
    var postsSubscription = instance.subscribe('postsList', subscriptionTerms);
    var usersSubscription = instance.subscribe('listListUsers', subscriptionTerms);

    var subscriptionsReady = instance.subscriptionsReady(); // ⚡ reactive ⚡

    // console.log('// ------ autorun running ------ //');
    // console.log("terms: ", terms);
    // console.log("limit: ", listsLimit);
    // console.log("ready: ", subscriptionsReady);
    // Tracker.onInvalidate(console.trace.bind(console));

    // if subscriptions are ready, set terms to subscriptionsTerms
    if (subscriptionsReady) {
      instance.terms.set(subscriptionTerms);
    }

  });

});

Template.lists_list_controller.helpers({
  template: function () {
    return !!this.template? this.template: "lists_list";
  },
  data: function () {

    var context = this;

    var instance = Template.instance();

    var terms = instance.terms.get(); // ⚡ reactive ⚡
    var listsReady = instance.subscriptionsReady(); // ⚡ reactive ⚡

    var listsLimit = terms.limit;
    var parameters = Lists.getSubParams(terms);
    var listsCursor = Lists.find(parameters.find, parameters.options);

    var data = {

      // lists cursor
      listsCursor: listsCursor,

      // lists subscription readiness, used to show spinner
      listsReady: listsReady,

      // whether to show the load more button or not
      hasMoreLists: listsCursor.count() >= listsLimit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (instance) {
        event.preventDefault();

        // increase limit by 5 and update it
        var limit = instance.listsLimit.get();
        limit += Settings.get('listsPerPage', 10);
        instance.listsLimit.set(limit);

      },

      // the current instance
      controllerInstance: instance,

      controllerOptions: context.options // pass any options on to the template

    };

    return data;
  }
});