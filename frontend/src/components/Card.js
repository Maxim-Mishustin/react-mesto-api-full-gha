import { useContext } from "react"
import { CurrentUserContext } from "../contexts/CurrentUserContext"

function Card(props) {
  const currentUser = useContext(CurrentUserContext)
  const isLiked = props.card.likes.some((user) => user === currentUser._id)
  const likeButtonClassName = `element__like ${
    isLiked ? "element__like_active" : ""
  }`
  //const isOwner = props.card.owner._id === currentUser._id
  const isOwner =
  (props.card.owner?._id || props.card.owner) === currentUser._id
  function handleLikeClick() {
    console.log("лайк карточки")
    props.onCardLike(props.card)
  }

  function handleDeleteClick() {
    console.log("удаление карточки")
    props.onCardDelete(props.card)
    props.onConfirmationPopup(true)
  }

  function handleCardClick() {
    console.log("большая картинка попап")
    props.onCardClick(props.card)
  }

  return (
    <div className="element">
      {/* ДАЛЕЕ В РАЗМЕТКЕ ИСПОЛЬЗУЕМ ПЕРЕМЕННУЮ ДЛЯ УСЛОВНОГО РЕНДЕРИНГА */}

      {isOwner && (
        <button
          className="element__delete"
          onClick={handleDeleteClick}
          type="button"
        ></button>
      )}
      <img
        className="element__image"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleCardClick}
      />
      <div className="element__description">
        <h2 className="element__title">{props.card.name}</h2>
        <div className="element__container-like">
          <button
            className={likeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <p className="element__count-like">{props.card.likes.length}</p>
        </div>
      </div>
    </div>
  )
}

export default Card
