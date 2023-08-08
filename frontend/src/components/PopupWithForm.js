import React from "react";

// КОМПОНЕНТ ПОПАПА СОДЕРЖАЩИЙ ОБЩУЮ РАЗМЕТКУ И МЕТОДЫ ДРУГИХ ПОПАПОВ
function PopupWithForm({ title, name, isOpen, onClose, buttonText, children, onSubmit, onCloseOverlay }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""}`} onClick={onCloseOverlay}>
      <div className="popup__container">
        <button
          onClick={onClose}
          aria-label="close"
          className="popup__button-close"
          type="button"
        />
        <form className="popup__form" name={name} onSubmit={onSubmit}>
          <h2 className="popup__title">{title}</h2>
          {children}
          <button
            className="popup__button popup__button-submit"
            type="submit"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
