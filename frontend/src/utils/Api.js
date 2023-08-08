// КЛАСС Api ДЛЯ ОБРАЩЕНИЯ К Api
class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl
  }

  // ФОРМИРОВАНИЕ ЗААПРОСА НА СЕРВЕР
  _handleTransferReq(res) {
    if (res.ok) {
      return Promise.resolve(res.json())
    }

    // ЕСЛИ ВЕРНУЛИ ОШИБКУ - ОТКЛОНЯЕМ ПРОМИС
    return Promise.reject(`Ошибка: ${res.status}`)
  }

  // МЕТОД ЗАГРУЗКИ ИНОФРМАЦИИ О ЮЗЕРЕ С СЕРВЕРА
  async getUserInfo() {
    const response = await fetch(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    return this._handleTransferReq(response)
  }

  // ЗАГРУЖАЕМ КАРТОЧКИ С СЕРВЕРА С ПОМОЩЬЮ МЕТОДА async
  async getCards() {
    const response = await fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    return this._handleTransferReq(response)
  }

  // МЕТОД РЕДАКТИРОВАНИЯ ПРОФИЛЯ
  async editProfileUser(data) {
    const response = await fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    })
    return this._handleTransferReq(response)
  }

  // МЕТОД ДОБАВЛЕННИЯ НОВОЙ КАРТОЧКИ С СЕРВЕРА
  async createCard(data) {
    const response = await fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(data),
    })
    return this._handleTransferReq(response)
  }

  // МЕТОД РАЛИЗАЦИИ ЛАЙКА КАРТОЧКИ
  async putLike(cardId) {
    const response = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    return this._handleTransferReq(response)
  }

  // МЕТОД Delete ДЛЯ КАРТОЧКИ
  async removeCard(cardId) {
    const response = await fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    return this._handleTransferReq(response)
  }

  // МЕТОД ЛАЙКА И ДИЗЛАЙКА КАРТОЧКИ
  async deleteLike(cardId) {
    const response = await fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    return this._handleTransferReq(response)
  }

  // МЕТОД РЕДАКТИРОВАНИЯ АВАТАРКИ ЮЗЕРА
  async editProfileAvatar(data) {
    const response = await fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    })
    return this._handleTransferReq(response)
  }
}

// ЭКЗЕМПЛЯР КЛАССА Api
const api = new Api({
  baseUrl: "http://localhost:3000",
})

export default api
