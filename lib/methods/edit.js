/**
 * Edit a list in the database
 * @param {string} listId – the ID of the list being edited
 * @param {Object} modifier – the modifier object
 * @param {Object} list - the current list object
 */
Lists.edit = function (listId, modifier, list) {

  if (typeof list === "undefined") {
    list = Lists.findOne(listId);
  }


  // ------------------------------ Callbacks ------------------------------ //

  // run all post edit server callbacks on modifier successively
  modifier = Telescope.callbacks.run("listEdit", modifier, list);

  // ------------------------------ Update ------------------------------ //

  Lists.update(listId, modifier);

  // ------------------------------ Callbacks ------------------------------ //

  Telescope.callbacks.runAsync("listEditAsync", Lists.findOne(listId));

  // ------------------------------ After Update ------------------------------ //
  return Lists.findOne(listId);
};