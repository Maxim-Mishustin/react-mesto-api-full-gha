import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({
  onClose,
  onAddPlace,
  onLoading,
  isOpen,
  onCloseOverlay,
}) {
  const [placeName, setPlaceName] = useState("");
  const [placeLink, setPlaceLink] = useState("");

  useEffect(() => {
    setPlaceName("");
    setPlaceLink("");
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: placeName,
      link: placeLink,
    });
  }

  function handleChangePlaceName(e) {
    setPlaceName(e.target.value);
  }

  function handleChangePlaceLink(e) {
    setPlaceLink(e.target.value);
  }

  return (
    <PopupWithForm
      // ПОПАП ДОБАВЛЕНИЯ КАРТОЧКИ NEW PLACE
      name="popupTypeAdd"
      title="Новое место"
      buttonText={onLoading ? `Сохранение` : `Создать`}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={isOpen}
      onCloseOverlay={onCloseOverlay}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_new-place"
          id="name"
          type="text"
          name="name"
          placeholder="Название"
          required
          minLength="2"
          maxLength="30"
          value={placeName}
          onChange={handleChangePlaceName}
        />
        <span className="name-error error" />
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_url"
          id="link"
          type="url"
          name="link"
          placeholder="Ссылка на картинку"
          required
          value={placeLink}
          onChange={handleChangePlaceLink}
        />
        <span className="link-error error" />
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
