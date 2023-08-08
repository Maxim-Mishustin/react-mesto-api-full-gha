import React from "react";

// ПОПАП ДЛЯ БОЛЬШОЙ КАРТОЧКИ Big Card
function ImagePopup({ card, onClose, onCloseOverlay }) {
  return (
    <div
      className={`popup popup_type_big-card ${card.link ? "popup_opened" : ""}`}
      onClick={onCloseOverlay}
    >
      <figure className="popup__container-big-card">
        <img className="popup__card-image" src={card.link} alt={card.name} />
        <figcaption className="popup__card-title">{card.name}</figcaption>
        <button
          className="popup__button-close popup__button-close-big-card"
          type="button"
          onClick={onClose}
        ></button>
      </figure>
    </div>
  );
}

export default ImagePopup;
