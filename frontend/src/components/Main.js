import React from "react"
import profileEditPen from "../images/edit-pen.svg"
import Card from "./Card"
import { CurrentUserContext } from "../contexts/CurrentUserContext.js"
import Loader from "./Loader"

// ОСНОВНОЙ КОМПОНЕНТ
function Main(props) {
  const currentUser = React.useContext(CurrentUserContext) // ПОДПИСАЛИСЬ НА КОНТЕКСТ С ПОМОЩЬЮ ХУКА React.useContext

  return (
    <main className="content">
      {props.isLoading && <Loader />}
      <section
        className={`profile ${props.isLoading && "page__profile_hidden"}`}
      >
        <div className="profile__wrapper">
          <img
            className="profile__avatar"
            src={currentUser.avatar}
            alt="Аватар"
          />
          {/* КНОПКА РЕДАКТИРОВАТЬ АВАТАР */}
          <button
            className="profile__edit-button-avatar"
            type="button"
            onClick={() => {
              props.onEditAvatar(true)
            }}
          >
            <img
              className="profile__edit-pen"
              src={profileEditPen}
              alt="Ручка редактирования"
            />
          </button>
        </div>
        <div className="profile__info">
          <div className="profile__title-edit">
            <h1 className="profile__title">{currentUser.name}</h1>
            {/* КНОПКА РЕДАКТИРОВАТЬ ПРОФИЛЬ */}
            <button
              type="button"
              name="edit-button"
              className="profile__edit-button"
              onClick={() => {
                props.onEditProfile(true)
              }}
            />
          </div>
          <p className="profile__text">{currentUser.about}</p>
        </div>
        {/* КНОПКА НОВОЕ МЕСТО */}
        <button
          type="button"
          name="add-button"
          className="profile__add-button"
          onClick={() => {
            props.onAddPlace(true)
          }}
        />
      </section>
      <section className="elements">
        {props.cards.map((card) => (
          <Card
            card={card}
            key={card._id}
            onCardDelete={props.onDeletedCard}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onConfirmationPopup={props.onConfirmationPopup}
          />
        ))}
      </section>
    </main>
  )
}

export default Main
