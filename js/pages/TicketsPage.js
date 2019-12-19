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
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">My Cinema</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-supported-content">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbar-supported-content">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" data-id="menu-main" href="/">Список фильмов</a>
                        </li>
                        <li class="nav-item active">
                            <a class="nav-link" data-id="menu-sessions" href="/sessions/${this._filmId}">Сеансы</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <br>
            <nav class="navbar navbar-expand-lg navbar-light bg-dark">_
            </nav>
            <br><br><br><br><br>
        <div class="row" data-id="tickets-container">
        </div>
    </div>
    
    <div class="modal fade" data-id="error-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Error!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div data-id="error-message" class="modal-body">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;

    this._rootEl.querySelector('[data-id=menu-main]').addEventListener('click', evt => {
      evt.preventDefault();
      this._context.route(evt.currentTarget.getAttribute('href'));
    });
    this._rootEl.querySelector('[data-id=menu-sessions]').addEventListener('click', evt => {
      evt.preventDefault();
      this._context.route(evt.currentTarget.getAttribute('href'));
    });



    this._errorModal = $('[data-id=error-modal]');
    this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');



    this._ticketsContainerEl = this._rootEl.querySelector('[data-id=tickets-container]');

    this.loadAll();
    this.pollTicketsStatus();
  }

  loadAll() {
    this._context.get(`/sessions/${this._filmId}/${this._sessionId}/tickets`, {},
        text => {
          const tickets = JSON.parse(text);
          this.rebuildList(tickets);
        },
        error => {
          this.showError(error);
        }
    );
  }

  rebuildList(tickets) {
    this._ticketsContainerEl.innerHTML = '';
    for (const ticket of tickets) {
      const ticketEl = document.createElement('div');
      ticketEl.className = 'col-3';

      if (ticket.seatStatus === "TAKEN") {
        ticketEl.innerHTML = `
        <button data-action="buy-ticket" class="btn btn-secondary" disabled>Ряд: ${ticket.line} Место: ${ticket.seat}</button>
      `;
      }
      if (ticket.seatStatus === "FREE") {
        ticketEl.innerHTML = `
        <button data-action="buy-ticket" class="btn btn-success">Ряд: ${ticket.line} Место: ${ticket.seat}</button>
      `;
      }
      ticketEl.querySelector('[data-action=buy-ticket]').addEventListener('click', evt => {
        evt.preventDefault();
        this._context.delete(`/sessions/${this._filmId}/${this._sessionId}/tickets/${ticket.id}`, {},
            () => {
              this.loadAll();
            }, error => {
              this.showError(error);
            });
      });

      this._ticketsContainerEl.appendChild(ticketEl);
    }
  }

  pollTicketsStatus() {
    this._timeout = setTimeout(() => {
      this.loadAll();
      this.pollTicketsStatus();
    }, 3000);
  }

  showError(error) {
    const data = JSON.parse(error);
    const message = this._context.translate(data.message);
    this._errorMessageEl.textContent = message;
    this._errorModal.modal('show');
  }

  destroy() {
    clearTimeout(this._timeout);
  }
}