import { CurrentUserContext } from "../contexts/CurrentUserContext"
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup"
import AddPlacePopup from "./AddPlacePopup"
import React, { useState, useEffect } from "react"
import PopupConfirm from "./PopupConfirm"
import ImagePopup from "./ImagePopup"
import api from "../utils/Api"
import Header from "./Header"
import Footer from "./Footer"
import Main from "./Main"
import { Route, Switch, Redirect, useHistory } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Register from "./Register"
import Login from "./Login"
import * as auth from "../utils/auth"
import InfoToolTip from "./InfoToolTip"

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [deletedCard, setDeletedCard] = useState({})
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [cards, setCards] = useState([])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const history = useHistory()
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ХУК useEffect
  /* useEffect(() => {
    setIsLoading(true);
    // МЕТОД ЗАГРУЗКИ ИНФОРМАЦИИ О ЮЗЕРЕ С СЕРВЕРА
    api
      .getUserInfo()
      .then((profileInfo) => setCurrentUser(profileInfo))
      .catch((error) => console.log(`Ошибка: ${error}`));
    // ЗАГРУЖАЕМ КАРТОЧКИ С СЕРВЕРА
    api
      .getCards()
      .then((data) => {
        setCards(
          data.map((card) => ({
            _id: card._id,
            name: card.name,
            link: card.link,
            likes: card.likes,
            owner: card.owner,
          }))
        );
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false));
  }, [isLoggedIn]);*/

  // ПРОВЕРКА И ИСПОЛЬЗОВАНИЕ ТОКЕНА
  useEffect(() => {
    const jwt = localStorage.getItem("jwt")

    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true)
          setEmail(res.email)
          history.push("/")
        })
        .catch((err) => {
          if (err.status === 401) {
            console.log("401 — Токен не передан или передан не в том формате")
          }
          console.log("401 — Переданный токен некорректен")
        })
    }
  }, [history])

  useEffect(() => {
    isLoggedIn &&
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([userRes, cards]) => {
          setCurrentUser(userRes)
          setCards(cards.data.reverse())
        })
        .catch((err) => console.log(err))
  }, [isLoggedIn])

  // ФУНКЦИЯ РЕГИСТРАЦИИ ЮЗЕРА
  function handleRegisterSubmit(email, password) {
    auth
      .registrationUser(email, password)
      .then((res) => {
        setInfoToolTipPopupOpen(true)
        setIsSuccess(true)
        history.push("/sign-in")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - некорректно заполнено одно из полей")
        }
        setInfoToolTipPopupOpen(true)
        setIsSuccess(false)
      })
  }

  // ФУНКЦИЯ АВТОРИЗАЦИИ ЮЗЕРА
  function handleLoginSubmit(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token)
        setIsLoggedIn(true)
        setEmail(email)
        history.push("/")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей")
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден")
        }
        setInfoToolTipPopupOpen(true)
        setIsSuccess(false)
      })
  }

  // ФУНКЦИЯ ВЫХОДА ЮЗЕРА ИЗ ААКАУНТА
  function handleSignOut() {
    localStorage.removeItem("jwt")
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
    history.push("/sign-in")
    setIsMobileMenuOpen(false)
  }

  // РЕАЛИЗАЦИЯ МОБИЛЬНОГО МЕНЮ ЕСЛИ ЮЗЕР АВТОРИЗОВАН
  function handleClickOpenMobileMenu() {
    if (isLoggedIn) {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  }

  // ФУНКЦИЯ ЗАКРЫТИЯ ПОПАПОВ ЧЕРЕЗ ОВЕРЛЕЙ
  function closeByOverlay(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups()
    }
  }

  // ФУНКЦИЯ ЗАКРЫТИЯ ВСЕХ ПОПАПОВ
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsConfirmationPopupOpen(false)
    setDeletedCard({})
    setSelectedCard({})
    setInfoToolTipPopupOpen(false)
  }

  const isOpen =
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isConfirmationPopupOpen ||
    selectedCard.link

  // ФУНКЦИЯ ЗАКРЫТИЯ ЧЕРЕЗ ESCAPE
  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape)
      return () => {
        document.removeEventListener("keydown", closeByEscape)
      }
    }
  }, [isOpen])

  // ФУНКЦИЯ ДОБАВЛЕНИЯ НОВОЙ КАРТОЧКИ
  function handleAddPlaceSubmit(data) {
    setIsLoading(true)
    api
      .createCard(data)
      .then((newCard) => {
        setCards([newCard.data, ...cards])

        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  // ФУНКЦИЯ ОБНОВЛЕНИЯ ИНФОРМАЦИИ О ЮЗЕРЕ
  function handleUpdateUser(newUserInfo) {
    setIsLoading(true)
    api
      .editProfileUser(newUserInfo)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  // ФУНКЦИЯ ОБНОВЛЕНИЯ АВАТАРКИ
  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true)
    api
      .editProfileAvatar(newAvatar)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  // ФУНКЦИЯ РЕАЛИЗАЦИИ ЛАЙКА
  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user === currentUser._id)
    ;(isLiked ? api.deleteLike(card._id) : api.putLike(card._id, true))
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === newCard.data._id ? newCard.data : c))
        )
      })
      .catch((err) => console.log(err))
  }

  // ФУНКЦИЯ УДАЛЕНИЯ КАРТОЧКИ
  function handleCardDelete(card) {
    setIsLoading(true)
    api
      .removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id))
        closeAllPopups()
      })

      .catch((error) => console.log(`Ошибка: ${error}`))
      .finally(() => setIsLoading(false))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {/* ИСПОЛЬЗУЕМ ПРОВАЙДЕР CurrentUserContext */}
      <div className="root">
        <div className="page">
          <Header
            email={email}
            onSignOut={handleSignOut}
            isMobileMenuOpen={isMobileMenuOpen}
            handleClickOpenMobileMenu={handleClickOpenMobileMenu}
            isLoggedIn={isLoggedIn}
          />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              isLoggedIn={isLoggedIn}
              onEditAvatar={setIsEditAvatarPopupOpen}
              onEditProfile={setIsEditProfilePopupOpen}
              onConfirmationPopup={setIsConfirmationPopupOpen}
              onAddPlace={setIsAddPlacePopupOpen}
              onCardClick={setSelectedCard}
              onCardLike={handleCardLike}
              onDeletedCard={setDeletedCard}
              cards={cards}
              component={Main}
              isLoading={isLoading}
            />
            <Route path="/sign-in">
              <Login onLogin={handleLoginSubmit} />
            </Route>
            <Route path="/sign-up">
              <Register onRegister={handleRegisterSubmit} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          {isLoggedIn && <Footer />}
          <AddPlacePopup
            onAddPlace={handleAddPlaceSubmit}
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onUpdateUser={handleUpdateUser}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <EditAvatarPopup
            onUpdateAvatar={handleUpdateAvatar}
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onCloseOverlay={closeByOverlay}
          />
          <PopupConfirm
            onClose={closeAllPopups}
            isOpen={isConfirmationPopupOpen}
            onCardDelete={handleCardDelete}
            onLoading={isLoading}
            card={deletedCard}
            onCloseOverlay={closeByOverlay}
          />

          <InfoToolTip
            isOpen={isInfoToolTipPopupOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccess}
          />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            onCloseOverlay={closeByOverlay}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App
