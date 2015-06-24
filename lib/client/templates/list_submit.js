Template.list_submit.helpers({
  listFields: function () {
    return Lists.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  submitListForm: {

    before: {
      method: function(doc) {

        var list = doc;

        this.template.$('button[type=submit]').addClass('loading');

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), 'error');
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        // run all list submit client callbacks on properties object successively
        list = Telescope.callbacks.run("listSubmitClient", list);

        return list;
      }
    },

    onSuccess: function(operation, list) {
      this.template.$('button[type=submit]').removeClass('loading');
      Events.track("new list", {'listId': list._id});
      Router.go('list_page', {_id: list._id});
    },

    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      Messages.clearSeen();
      // $(e.target).removeClass('disabled');
      if (error.error === 603) {
        var dupeListId = error.reason.split('|')[1];
        Router.go('list_page', {_id: dupeListId});
      }
    }

  }
});