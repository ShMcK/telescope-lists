
Telescope.modules.add("listsListTop", {
  template: 'lists_views_nav',
  order: 99
});

Telescope.modules.add("listComponents", [
  //{
  //  template: 'list_rank',
  //  order: 1
  //},
  {
    template: 'post_upvote',
    order: 10
  },
  {
    template: 'list_content',
    order: 20
  },
  {
    template: 'post_avatars',
    order: 30
  }
  //{
  //  template: 'list_discuss',
  //  order: 40
  //}
  //{
  //  template: 'list_posts',
  //  order: 50
  //}
]);

Telescope.modules.add("listHeading", [
  {
    template: 'list_title',
    order: 10
  }
  //{
  //  template: 'list_body',
  //  order: 20
  //}
]);

Telescope.modules.add("listMeta", [
  //{
  //  template: 'post_author',
  //  order: 10
  //},
  {
    template: 'post_info',
    order: 20
  },
  //{
  //  template: 'list_comments_link',
  //  order: 30
  //},
  {
    template: 'post_admin',
    order: 50
  }
]);
