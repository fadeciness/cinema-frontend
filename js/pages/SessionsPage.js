export default class SessionPage {
  constructor(context) {
    this._context = context;
    this._rootEl = context.rootEl();
  }

  init() {
    this._filmId = this._context.pathParams()[0];
    this._rootEl.innerHTML = `
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="">My Cinema</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-supported-content">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbar-supported-content">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" data-id="menu-main" href="/">Список фильмов</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="card-body">
                            <form data-id="session-edit-form">
                                <input type="hidden" data-id="id-input" value="0">
                                <div class="form-group">
                                    <label for="hall-number-input">Зал</label>
                                    <input type="number" min="1" data-id="hall-number-input" class="form-control" id="hall-number-input" value="1">
                                    
                                    <br>
                                    <div class="form-check">
                                        <input type="checkbox" data-id="type3d-input" class="form-check-input" id="type3d-input">
                                        <label class="form-check-label" for="type3d-input">3D</label>
                                    </div>
                                    <br>
                                    
                                    <label for="date-input">Дата и время</label>
                                    <input type="datetime-local" data-id="date-input" class="form-control" id="date-input" value="2019-12-21T14:00">
                                    <br>
                                    
                                    <label for="price-input">Цена билета</label>
                                    <input type="number" min="0" data-id="price-input" class="form-control" id="price-input" value="100">
                                    
                                </div>
                                <button type="submit" class="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <div class="row" data-id="sessions-container">
        </div>
    </div>
    
    <div class="modal fade" data-id="error-modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ошибка</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div data-id="error-message" class="modal-body">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
    `;

    this._rootEl.querySelector('[data-id=menu-main]').addEventListener('click', evt => {
      evt.preventDefault();
      this._context.route(evt.currentTarget.getAttribute('href'));
    });


    this._errorModal = $('[data-id=error-modal]');
    this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');


    this._sessionsContainerEl = this._rootEl.querySelector('[data-id=sessions-container]');
    this._sessionCreateFormEl = this._rootEl.querySelector('[data-id=session-edit-form]');

    this._idInputEl = this._sessionCreateFormEl.querySelector('[data-id=id-input]');
    this._hallNumberInputEl = this._sessionCreateFormEl.querySelector('[data-id=hall-number-input]');
    this._type3DInputEl = this._sessionCreateFormEl.querySelector('[data-id=type3d-input]');
    this._dateInputEl = this._sessionCreateFormEl.querySelector('[data-id=date-input]');
    this._priceInputEl = this._sessionCreateFormEl.querySelector('[data-id=price-input]');



    this._sessionCreateFormEl.addEventListener('submit', evt => {
      evt.preventDefault();
      this._context.get(`/films/${this._filmId}`, {},
          text => {
            const film = JSON.parse(text);

            let dateObject = new Date(this._dateInputEl.value);
            let timestamp = dateObject.valueOf().toString();

            const data = {
              id: Number(this._idInputEl.value),
              hallNumber: this._hallNumberInputEl.value,
              type3D: this._type3DInputEl.checked,
              date: Number(timestamp),
              priceInRub: this._priceInputEl.value,
              filmEntity: film
            };
            this._context.post(`/sessions/${this._filmId}`, JSON.stringify(data), {'Content-Type': 'application/json'},
                text => {
                  this._idInputEl.value = 0;
                  this._hallNumberInputEl.value = 1;
                  this._type3DInputEl.checked = false;
                  this._dateInputEl.value = "2019-12-21T14:00";
                  this._priceInputEl.value = 100;
                  this.loadAll();
                },
                error => {
                  this.showError(error);
                }
            );
          },
          error => {
            this.showError(error);
          }
      );
    });

    this.loadAll();
    this.pollNewSessions();
  }

  loadAll() {
    this._context.get(`/sessions/${this._filmId}`, {},
        text => {
          const sessions = JSON.parse(text);
          this.rebuildList(sessions);
        },
        error => {
          this.showError(error);
        }
    );
  }

  convert(timestamp) {
    let a = new Date(timestamp);
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let year = a.getFullYear();
    let month = a.getMonth();
    if (numbers.indexOf(month) != -1) {
      month = '0' + month.toString();
    }
    let day = a.getDay();
    if (numbers.indexOf(day) != -1) {
      day = '0' + day.toString();
    }
    let hour = a.getHours();
    if (numbers.indexOf(hour) != -1) {
      hour = '0' + hour.toString();
    }
    let min = a.getMinutes();
    if (numbers.indexOf(min) != -1) {
      min = '0' + min.toString();
    }
    let time = year.toString() + '-' + month.toString() + '-' + day.toString() + 'T' + hour.toString() + ':' + min.toString();
    return time;
  }

  rebuildList(sessions) {
    this._sessionsContainerEl.innerHTML = '';
    for (const session of sessions) {
      const sessionEl = document.createElement('div');
      sessionEl.className = 'col-4';

      let typeD = '2D';
      if (Boolean(session.type3D)) {
        typeD = '3D';
      }

      let time = new Date(session.date);
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      let day = time.getDay().toString();
      if (numbers.indexOf(Number(day)) !== -1) {
        day = '0' + day;
      }

      let month = time.getMonth().toString();
      if (numbers.indexOf(Number(month)) !== -1) {
        month = '0' + month;
      }

      let hour = time.getHours().toString();
      if (numbers.indexOf(Number(hour)) !== -1) {
        hour = '0' + hour;
      }

      let minute = time.getMinutes().toString();
      if (numbers.indexOf(Number(minute)) !== -1) {
        minute = '0' + minute;
      }

      let showDate = day + '.' + month + '.' + time.getFullYear().toString();
      let showTime = hour + ':' + minute;

      sessionEl.innerHTML = `
            <div class="card mt-2">
                <div class="card-body">
                    <h3><p class="card-text" align="center">Сеанс ${typeD}</p></h3><hr>
                    <p class="card-text">Зал: ${session.hallNumber}</p>
                    <p class="card-text">Дата: ${showDate}</p>
                    <p class="card-text">Время: ${showTime}</p>
                    <p class="card-text">Цена билета: ${session.priceInRub}</p>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col">
                            <a href="/sessions/${this._filmId}/${session.id}/tickets" data-action="get-tickets" class="btn btn-bg btn-primary">Купить билеты</a>
                        </div>
                        <div class="col text-right">
                            <a href="#" data-action="edit" class="btn btn-sm btn-primary">Изменить</a>
                            <a href="#" data-action="remove" class="btn btn-sm btn-danger">Удалить</a>
                        </div>
                    </div>
                </div>
            </div>
            `;

      sessionEl.querySelector('[data-action=get-tickets]').addEventListener('click', evt => {
        evt.preventDefault();
        this._context.route(evt.currentTarget.getAttribute('href'));
      });
      sessionEl.querySelector('[data-action=edit]').addEventListener('click', evt => {
        evt.preventDefault();
        this._idInputEl.value = session.id;
        this._hallNumberInputEl.value = session.hallNumber;
        this._type3DInputEl.checked = session.type3D;
        this._dateInputEl.value = this.convert(session.date);
        this._priceInputEl.value = session.priceInRub;
      });
      sessionEl.querySelector('[data-action=remove]').addEventListener('click', evt => {
        evt.preventDefault();
        this._context.delete(`/sessions/${this._filmId}/${session.id}`, {},
            () => {
              this.loadAll();
            }, error => {
              this.showError(error);
            });
      });
      this._sessionsContainerEl.appendChild(sessionEl);
    }
  }


  pollNewSessions() {
    this._timeout = setTimeout(() => {
      this.loadAll();
      this.pollNewSessions();
    }, 5000);
  }

  showError(error) {
    const data = JSON.parse(error);
    let message = this._context.translate(data.message);
    console.log(message);
    if (data.errors) {
      for (let code in data.errors) {
        message += '. ' + this._context.translate(data.errors[code]);
      }
    }
    this._errorMessageEl.textContent = message;
    this._errorModal.modal('show');
  }

  destroy() {
    clearTimeout(this._timeout);
  }
}