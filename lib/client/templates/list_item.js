var list = {};

Template.list_item.created = function () {
  list = this.data;
};

Template.list_item.helpers({
  moduleContext: function () { // not used for now
    var module = this;
    module.templateClass = Telescope.utils.camelToDash(this.template) + ' ' + this.position + ' cell';
    module.list = list;
    return module;
  },
  listClass: function () {
    var list = this;
    var listClass = "author-"+list.author;
    listClass = Telescope.callbacks.run("listClass", listClass);
    return listClass;
  }
});
