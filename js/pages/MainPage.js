export default class MainPage {
    constructor(context) {
        this._context = context;
        this._rootEl = context.rootEl();
    }

    init() {
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
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <form data-id="film-edit-form">
                                <input type="hidden" data-id="id-input" value="0">
                                <div class="form-group">
                                    <label for="title-input">Название:</label>
                                    <input type="text" data-id="title-input" class="form-control" id="title-input">
                                    
                                    <label for="description-input">Описание:</label>
                                    <input type="text" data-id="description-input" class="form-control" id="description-input">
                                    
                                    <label for="genres-input">Жанры:</label>
                                    <select class="custom-select" data-id="genres-input" multiple>
                                        <option value="COMEDY">Комедия</option>
                                        <option value="CARTOON">Мультфильм</option>
                                        <option value="ADVENTURE">Приключение</option>
                                        <option value="ACTION">Боевик</option>
                                        <option value="DRAMA">Драма</option>
                                        <option value="FANTASY">Фэнтези</option>
                                        <option value="FAMILY">Семейный</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="image-input">Постер</label>
                                    <div class="custom-file">
                                        <input type="hidden" data-id="image-name-input">
                                        <input type="file" data-id="image-input" class="custom-file-input" id="image-input" accept="image/jpeg,image/png">
                                        <label class="custom-file-label" for="image-input">Выберите изображение</label>
                                    </div>
                                    <label for="trailer-input">Трейлер</label>
                                    <div class="custom-file">
                                        <input type="hidden" data-id="trailer-name-input">
                                        <input type="file" data-id="trailer-input" class="custom-file-input" id="trailer-input" accept="video/mp4,video/webm">
                                        <label class="custom-file-label" for="trailer-input">Выберите трейлер</label>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Сохранить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        <div class="row" data-id="films-container">
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
        });



        this._errorModal = $('[data-id=error-modal]');
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');



        this._filmsContainerEl = this._rootEl.querySelector('[data-id=films-container]');
        this._filmCreateFormEl = this._rootEl.querySelector('[data-id=film-edit-form]');

        this._idInputEl = this._filmCreateFormEl.querySelector('[data-id=id-input]');
        this._titleInputEl = this._filmCreateFormEl.querySelector('[data-id=title-input]');
        this._descriptionInputEl = this._filmCreateFormEl.querySelector('[data-id=description-input]');
        this._genresInputEl = this._filmCreateFormEl.querySelector('[data-id=genres-input]');

        this._imageNameInputEl = this._filmCreateFormEl.querySelector('[data-id=image-name-input]');
        this._imageInputEl = this._filmCreateFormEl.querySelector('[data-id=image-input]');

        this._trailerNameInputEl = this._filmCreateFormEl.querySelector('[data-id=trailer-name-input]');
        this._trailerInputEl = this._filmCreateFormEl.querySelector('[data-id=trailer-input]');



        this._imageInputEl.addEventListener('change', evt => {
            const [file] = Array.from(evt.currentTarget.files);
            const formData = new FormData();
            formData.append('file', file);
            this._context.post('/files/multipart', formData, {},
                text => {
                    const data = JSON.parse(text);
                    this._imageNameInputEl.value = data.name;
                },
                error => {
                    this.showError(error);
                });
        });

        this._trailerInputEl.addEventListener('change', evt => {
            const [file] = Array.from(evt.currentTarget.files);
            const formData = new FormData();
            formData.append('file', file);
            this._context.post('/files/multipart', formData, {},
                text => {
                    const data = JSON.parse(text);
                    this._trailerNameInputEl.value = data.name;
                },
                error => {
                    this.showError(error);
                });
        });



        this._filmCreateFormEl.addEventListener('submit', evt => {
            evt.preventDefault();
            let selectedGenres = [];
            const options = this._genresInputEl.getElementsByTagName('option');
            for (const option of options) {
                if (option.selected) {
                    selectedGenres.push(option.value);
                }
            }
            const data = {
                id: Number(this._idInputEl.value),
                title: this._titleInputEl.value,
                description: this._descriptionInputEl.value,
                image: this._imageNameInputEl.value || null,
                trailer: this._trailerNameInputEl.value || null,
                genres: selectedGenres
            };
            this._context.post('/films', JSON.stringify(data), {'Content-Type': 'application/json'},
                text => {
                    this._idInputEl.value = 0;
                    this._titleInputEl.value = '';
                    this._descriptionInputEl.value = '';
                    for (const option of this._genresInputEl.getElementsByTagName('option')) {
                        option.selected = false;
                    }
                    this._imageNameInputEl.value = '';
                    this._imageInputEl.value = '';
                    this._trailerNameInputEl.value = '';
                    this._trailerInputEl.value = '';
                    this.loadAll();
                },
                error => {
                    this.showError(error);
                }
            );
        });

        this.loadAll();
    }

    loadAll() {
        this._context.get('/films', {},
            text => {
                const films = JSON.parse(text);
                this.rebuildList(films);
            },
            error => {
                this.showError(error);
            }
        );
    }

    rebuildList(films) {
        this._filmsContainerEl.innerHTML = '';
        for (const film of films) {
            const filmEl = document.createElement('div');
            filmEl.className = 'col-4';

            let filmImage = '';
            if (film.image !== null) {
                if (film.image.endsWith('.png') || film.image.endsWith('.jpg')) {
                    filmImage += `
                        <img src="${this._context.mediaUrl()}/${film.image}" class="card-img-top" alt="Нет постера">
                    `;
                }
            }

            let filmTrailer = '';
            if (film.trailer !== null) {
                if (film.trailer.endsWith('.mp4') || film.trailer.endsWith('.webm')) {
                    filmTrailer += `
                        <div class="card-img-topcard-img-top embed-responsive embed-responsive-16by9 mb-2">
                            <video src="${this._context.mediaUrl()}/${film.trailer}" class="embed-responsive-item" controls>
                        </div>
                    `;
                }
            }

            let filmGenres = '';
            for (const genre of film.genres) {
                if (genre.toString() === 'COMEDY') {
                    filmGenres += 'комедия, ';
                }
                if (genre.toString() === 'CARTOON') {
                    filmGenres += 'мультфильм, ';
                }
                if (genre.toString() === 'ADVENTURE') {
                    filmGenres += 'приключение, ';
                }
                if (genre.toString() === 'ACTION') {
                    filmGenres += 'боевик, ';
                }
                if (genre.toString() === 'DRAMA') {
                    filmGenres += 'драма, ';
                }
                if (genre.toString() === 'FANTASY') {
                    filmGenres += 'фэнтези, ';
                }
                if (genre.toString() === 'FAMILY') {
                    filmGenres += 'семейный, ';
                }
            }
            filmGenres = filmGenres.substr(0, filmGenres.length - 2);

            filmEl.innerHTML = `
            <div class="card mt-2">
                ${filmImage}<br>
                <div class="card-body">
                    <h3><p class="card-text" align="center">${film.title}</p></h3><hr>
                    ${filmTrailer}
                    <p class="card-text">Описание: ${film.description}</p>
                    <p class="card-text">Жанр: ${filmGenres}</p>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col">
                            <a href="/sessions/${film.id}" data-action="get-sessions" class="btn btn-lg btn-primary">Сеансы</a>
                        </div>
                        <div class="col text-right">
                            <a href="#" data-action="edit" class="btn btn-sm btn-primary">Изменить</a>
                            <a href="#" data-action="remove" class="btn btn-sm btn-danger">Удалить</a>
                        </div>
                    </div>
                </div>
            </div>
            `;

            filmEl.querySelector('[data-action=get-sessions]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.route(evt.currentTarget.getAttribute('href'));
            });
            filmEl.querySelector('[data-action=edit]').addEventListener('click', evt => {
                evt.preventDefault();
                this._idInputEl.value = film.id;
                this._titleInputEl.value = film.title;
                this._descriptionInputEl.value = film.description;
                const options = this._genresInputEl.getElementsByTagName('option');
                for (const genre of film.genres) {
                    for (const option of options) {
                        if (option.value === genre) {
                            option.selected = true;
                        }
                    }
                }
                this._imageNameInputEl.value = film.image;
                this._imageInputEl.value = '';
                this._trailerNameInputEl.value = film.trailer;
                this._trailerInputEl.value = '';
            });
            filmEl.querySelector('[data-action=remove]').addEventListener('click', evt => {
                evt.preventDefault();
                this._context.delete(`/films/${film.id}`, {},
                    () => {
                        this.loadAll();
                    }, error => {
                        this.showError(error);
                    });
            });
            this._filmsContainerEl.appendChild(filmEl);
        }
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

    }
}
