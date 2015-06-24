Template.list_edit.helpers({
  listFields: function () {
    return Lists.simpleSchema().getEditableFields(Meteor.user());
  }
});

AutoForm.hooks({
  editListForm: {

    before: {
      "method-update": function() {
        
        var list = this.currentDoc;
        var modifier = this.updateDoc;

        // ------------------------------ Checks ------------------------------ //

        if (!Meteor.user()) {
          Messages.flash(i18n.t('you_must_be_logged_in'), "");
          return false;
        }

        // ------------------------------ Callbacks ------------------------------ //

        modifier = Telescope.callbacks.run("listEditClient", modifier, list);
        return modifier;
      }
    },

    onSuccess: function(formType, list) {
      list = this.currentDoc;
      Events.track("edit list", {'listId': list._id});
      Router.go('list_page', {_id: list._id});
    },

    onError: function(formType, error) {
      console.log(error);
      Messages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      Messages.clearSeen();
    }

  }
});

// delete link
Template.list_edit.events({
  'click .delete-link': function(e){
    var list = this.list;

    e.preventDefault();

    if(confirm("Are you sure?")){
      Router.go("/");
      Meteor.call("deleteListById", list._id, function(error) {
        if (error) {
          console.log(error);
          Messages.flash(error.reason, 'error');
        } else {
          Messages.flash(i18n.t('your_list_has_been_deleted'), 'success');
        }
      });
    }
  }
});
