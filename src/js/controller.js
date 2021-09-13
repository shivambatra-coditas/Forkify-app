import * as model from "./model.js";
import searchView from "./views/searchView.js";
import recipeView from "./views/recipeViews.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";
import { MODAL_CLOSE_SEC } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // gaurd clause
    if (!id) return;
    recipeView.renderSpinner();

    bookmarksView.update(model.state.bookmarks);
    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);

    resultsView.update(model.getSearchResultsPage());
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search
    await model.loadSearchResults(query);

    // 3) Rendering Results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW Paginations buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings in the state
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipeView
  recipeView.update(model.state.recipe);

  // 3) Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();
    // Upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render Recipe
    recipeView.render(model.state.recipe);

    // Display Success
    addRecipeView.renderMessage();

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
