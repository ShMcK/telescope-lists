Package.describe({
  name: 'shmck:telescope-lists',
  summary: 'Adds user organized lists for Telescope',
  version: "0.1.0",
  git: "https://github.com/ShMcK/telescope-lists.git"
});

Package.onUse(function (api) {
  api.versionsFrom("METEOR@1.0.4");
  api.use([
    'telescope:core@0.20.4',
    'telescope:lib@0.20.4',
    'telescope:i18n@0.20.4',
    'telescope:settings@0.20.4',
    'telescope:users@0.20.4',
    'telescope:comments@0.20.4'
  ]);

  // i18n must come first & last
  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // client
  api.addFiles([
    'lib/client/templates/after_list_item.html',
    'lib/client/templates/before_list_item.html',
    'lib/client/templates/modules/list_actions.html',
    'lib/client/templates/modules/list_actions.js',
    'lib/client/templates/modules/list_admin.html',
    'lib/client/templates/modules/list_admin.js',
    'lib/client/templates/modules/list_author.html',
    'lib/client/templates/modules/list_avatars.html',
    'lib/client/templates/modules/list_avatars.js',
    'lib/client/templates/modules/list_comments_link.html',
    'lib/client/templates/modules/list_content.html',
    'lib/client/templates/modules/list_content.js',
    'lib/client/templates/modules/list_discuss.html',
    'lib/client/templates/modules/list_domain.html',
    'lib/client/templates/modules/list_domain.js',
    'lib/client/templates/modules/list_info.html',
    'lib/client/templates/modules/list_info.js',
    'lib/client/templates/modules/list_rank.html',
    'lib/client/templates/modules/list_rank.js',
    'lib/client/templates/modules/list_title.html',
    'lib/client/templates/modules/list_title.js',
    'lib/client/templates/modules/list_upvote.html',
    'lib/client/templates/modules/list_upvote.js',
    'lib/client/templates/list_body.html',
    'lib/client/templates/list_edit.html',
    'lib/client/templates/list_edit.js',
    'lib/client/templates/list_item.html',
    'lib/client/templates/list_item.js',
    'lib/client/templates/list_page.html',
    'lib/client/templates/list_page.js',
    'lib/client/templates/list_submit.html',
    'lib/client/templates/list_submit.js',
    'lib/client/templates/lists_list_top.html',
    'lib/client/templates/lists_views_nav.html',
    'lib/client/templates/lists_view_nav.js',
    'lib/client/templates/lists_list/lists_list.html',
    'lib/client/templates/lists_list/lists_list.js',
    'lib/client/templates/lists_list/lists_list_controller.html',
    'lib/client/templates/lists_list/lists_list_controller.js'
  ], 'client');

  // both
  api.addFiles([
    'lib/model/model.js',
    'lib/model/schema.js',
    'lib/parameters.js',
    'lib/views.js',
    'lib/callbacks.js',
    'lib/helpers.js',

    'lib/menus.js',
    'lib/modules.js',
    //'lib/user.js',

    'lib/methods.js',
    'lib/routes.js'
  ], ['client', 'server']);

  // server
  api.addFiles([
    'lib/server/seed.js',
    'lib/server/publications.js'
  ], 'server');


  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

  api.export('Lists');
});