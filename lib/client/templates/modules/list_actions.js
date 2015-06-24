Template.list_actions.events({
  'click .toggle-actions-link': function(e){
    e.preventDefault();
    var $list = $(e.target).parents('.list');
    var h = $list.height();
    if ($list.hasClass('show-actions')) {
      $list.height('auto');
      $list.removeClass('show-actions');
    } else {
      $list.height(h+'px');
      $list.addClass('show-actions');
    }
  }
});
