Template.list_title.helpers({
  listLink: function(){
    return !!this.url ? Lists.getOutgoingUrl(this.url) : "/lists/"+this._id;
  },
  listTarget: function() {
    return !!this.url ? '_blank' : '';
  }
});
