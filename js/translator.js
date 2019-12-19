export default class Translator {
  constructor() {
    this.init();
  }

  init() {
    this.lang = languages[0];
    for (const language of languages) {
      if (navigator.languages.includes(language)) {
        this.lang = language;
        break;
      }
    }
  }

  translate(code) {
    return translations[this.lang][code] || translations[this.lang]['error.unknown'];
  }
}

const languages = ['ru', 'en'];

const translations = {
  ru: {
    'error.exception.film_not_found': 'Запись о фильме не найдена',
    'error.exception.session_not_found': 'Запись о сеансе не найдена',
    'error.exception.ticket_not_found': 'Запись о билете не найдена',
    'error.exception.file_storage_error': 'Невозможно сохранить файл',
    'error.exception.file_unsupported_type': 'Неподдерживаемый тип файла',
    'error.exception.file_null_content_type': 'Null тип файла',
    'error.network': 'Ошибка сети. Проверьте подключение',
    'error.unknown': 'Неизвестная ошибка',

    'error.validation': 'Ошибка ввода',
    'error.validation.min_value.film_id': 'ID меньше допустимого',
    'error.validation.min_value.film_title': 'Отсутствует название',
    'error.validation.max_value.film_title': 'Название больше допустимого',
    'error.validation.null_value.film_title': 'Название null',
    'error.validation.max_value.film_description': 'Описание больше допустимого',
    'error.validation.null_value.film_description': 'Описание null',
    'error.validation.empty_list.film_genres': 'Не выбран ни один жанр',
    'error.validation.null_value.film_genres': 'Жанр null',

    'error.validation.min_value.session_id': 'ID меньше допустимого',
    'error.validation.min_value.session_hall_number': 'Номер зала меньше допустимого',
    'error.validation.max_value.session_hall_number': 'Не существует зала с таким номером',
    'error.validation.min_value.session_date': 'Неверный формат даты',
    'error.validation.min_value.session_price': 'Цена билета не может быть отрицательной',

  },
  en: {
    'error.exception.film_not_found': 'Movie record not found',
    'error.exception.session_not_found': 'Session record not found',
    'error.exception.ticket_not_found': 'Ticket entry not found',
    'error.exception.file_storage_error': 'Unable to save file',
    'error.exception.file_unsupported_type': 'Unsupported file type',
    'error.exception.file_null_content_type': 'Null-type file',
    'error.network': 'Network error',
    'error.unknown': 'Unknown error',

    'error.validation': 'Input error',
    'error.validation.min_value.film_id': 'ID is less than allowed',
    'error.validation.min_value.film_title': 'Missing title',
    'error.validation.max_value.film_title': 'Title is more than allowed',
    'error.validation.null_value.film_title': 'Title null',
    'error.validation.max_value.film_description': 'Description is more than acceptable',
    'error.validation.null_value.film_description': 'Description null',
    'error.validation.empty_list.film_genres': 'No genre selected',
    'error.validation.null_value.film_genres': 'Genre null',

    'error.validation.min_value.session_id': 'ID is less than allowed',
    'error.validation.min_value.session_hall_number': 'Hall number is less than allowed',
    'error.validation.max_value.session_hall_number': 'There is no hall with this number',
    'error.validation.min_value.session_date': 'Invalid date format',
    'error.validation.min_value.session_price': 'Ticket price cannot be negative',

  }
};

