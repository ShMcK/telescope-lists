// ------------------------------------------------------------------------------------------- //
// ----------------------------------------- Methods ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

var listViews = [];

Meteor.methods({

  /**
   * Meteor method for submitting a list from the client
   * @memberof Lists
   * @param {Object} list - the list being inserted
   */
  submitList: function (list) {

    // required properties:
    // title
    // posts (atleast one)
    // optional properties
    // URL
    // body
    // categories
    // thumbnailUrl

    // NOTE: the current user and the list author user might be two different users!
    var user = Meteor.user(),
      hasAdminRights = Users.is.admin(user),
      schema = Lists.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can post
    //if (!user || !Users.can.post(user))
    //  throw new Meteor.Error(601, i18n.t('you_need_to_login_to_create_a_list'));

    // ------------------------------ Properties ------------------------------ //

    // admin-only properties
    // status
    // postedAt
    // userId
    // sticky (default to false)

    // go over each schema field and throw an error if it's not editable
    _.keys(list).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.can.submitField(user, field)) {
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
      }

    });

    // if no post status has been set, set it now
    if (!list.status) {
      list.status = Lists.getDefaultStatus(user);
    }

    // if no userId has been set, default to current user id
    if (!list.userId) {
      list.userId = user._id;
    }

    return Lists.submit(list);
  },

  /**
   * Meteor method for editing a list from the client
   * @memberof Lists
   * @param {Object} modifier - the update modifier
   * @param {Object} listId - the id of the list being updated
   */
  editList: function (modifier, listId) {

    var user = Meteor.user(),
      list = Lists.findOne(listId),
      schema = Lists.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(user, list)) {
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_list'));
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {

        var field = schema[fieldName];
        if (!Users.can.editField(user, field, list)) {
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    return Lists.edit(listId, modifier, list);

  },

  setListStartedAt: function (list, customStartedAt) {

    var startedAt = new Date(); // default to current date and time

    if (Users.is.admin(Meteor.user()) && typeof customStartedAt !== 'undefined') // if user is admin and a custom datetime has been set
      startedAt = customStartedAt;

    Lists.update(list._id, {$set: {startedAt: startedAt}});
  },

  increaseListViews: function (listId, sessionId) {
    this.unblock();

    // only let users increment a post's view counter once per session
    var view = {_id: listId, userId: this.userId, sessionId: sessionId};

    if (_.where(listViews, view).length === 0) {
      listViews.push(view);
      Lists.update(listId, {$inc: {viewCount: 1}});
    }
  },

  deleteListById: function (listId) {
    // remove post comments
    // if(!this.isSimulation) {
    //   Comments.remove({post: postId});
    // }
    // NOTE: actually, keep comments after all

    var list = Lists.findOne({_id: listId});

    if (!Meteor.userId() || !Users.can.editById(Meteor.userId(), list)) throw new Meteor.Error(606, 'You need permission to edit or delete a list');

    // decrement post count
    Users.update({_id: list.userId}, {$inc: {"telescope.postCount": -1}});

    // delete post
    Lists.remove(listId);
  }

});
