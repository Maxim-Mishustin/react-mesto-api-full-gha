// ФУНКЦИИ СВЯЗАННЫЕ С АУТЕНТИФИКАЦИЕЙ И АВТОРИЗАЦИЕЙ, ОБРАЩАЮЩИЕСЯ К API НА БАЗЕ BASE_URL.
const BASE_URL = "http://localhost:3000"

// ФУНКЦИЯ ПРОВЕРЯЮЩАЯ ОТВЕТ ОТ СЕРВЕРА. ВЕРНЕТСЯ СТАТУС ЛИБО 200Й, ЛИБО ОШИБКА
function checkRes(res) {
  if (res.ok) {
    return res.json()
  }
  return Promise.reject(`${res.status}`)
}

// ФУНКЦИЯ ВЫПОЛНЯЮЩАЯ ЗАПРОС К API ДЛЯ РЕГИСТРАЦИИ НОВОГО ЮЗЕРА
export const registrationUser = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then(checkRes)
}

// ФУНКЦИЯ ВЫПОЛНЯЮЩАЯ ЗАПРОС К API ДЛЯ АУТЕНТИФИКАЦИИ НОВОГО ЮЗЕРА
export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then(checkRes)
    .then((data) => {
      if (data.token) {
        localStorage.setItem("jwt", data.token)
        return data
      }
    })
}

// ФУНКЦИЯ ВЫПОЛНЯЮЩАЯ ЗАПРОС К API ДЛЯ АУТЕНТИФИКАЦИИ НОВОГО ЮЗЕРА
export const checkToken = (jwt) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  }).then(checkRes)
}
