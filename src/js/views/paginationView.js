import View from "./View.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }

    // last page
    if (currPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
        </button>
      `;
    }
    // other page
    if (currPage < numPages) {
      return `
      <button data-goto="${
        currPage - 1
      }"      class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
          </button>
          <button data-goto="${
            currPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    // Page 1, and there are no other pages
    return "";
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
