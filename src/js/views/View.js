import icons from "url:../../img/icons.svg";

export default class View {
  _data;
  //   Public Methods
  /**
   * Render the recieved Object
   * @param {Object | Object[]} data The data to be rendered (eg. Recipe)
   * @param {boolean} {render=true} If false create markup string instead of rendering
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll("*");
    const currElements = this._parentElement.querySelectorAll("*");
    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      //   console.log(currEl, newEl.isEqualNode(currEl));
      //   Updates changed text
      if (
        !newEl.isEqualNode(currEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        currEl.textContent = newEl.textContent;
      }

      //   Update changed attributes
      if (!newEl.isEqualNode(currEl))
        Array.from(newEl.attributes).forEach((attr) =>
          currEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner = function () {
    const markup = `
          <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  _clear() {
    this._parentElement.innerHTML = "";
  }
}