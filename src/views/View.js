import icons from 'url:../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [render=true] If false, create a markup string instead of rendering to DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {object} View instance
   * @author Rajya Lakshmi
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //function that updates DOM only in places where the text or attributes changes
  //-instead of rendering entire DOM
  update(data) {
    //if (!data || (Array.isArray(data) && data.length === 0))
    //return this.renderError();

    this._data = data;
    const newmarkup = this._generateMarkup();

    //creates a virtual DOM object
    const newDOM = document.createRange().createContextualFragment(newmarkup);
    //getting node elements from virtual and current DOM's
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    //for each changed node updating text and attributes
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        const newArray = Array.from(newEl.attributes);
        newArray.forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
  renderMessage(message = this._successMessage) {
    const markup = `<div class="error">
      <div>
      <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
}
