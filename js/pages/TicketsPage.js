export default class TicketsPage {
  constructor(context) {
    this._context = context;
    this._rootEl = context.rootEl();
  }

  init() {
    this._filmId = this._context.pathParams()[0];
    this._sessionId = this._context.pathParams()[1];
    this._rootEl.innerHTML = `
        <div class="container">
            <h1>HELLO</h1>
            <p>Id FILM ${this._filmId}</p>
            <p>Id Session ${this._sessionId}</p>
        </div>
        `;
  }
}