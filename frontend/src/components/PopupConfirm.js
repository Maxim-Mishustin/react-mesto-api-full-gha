import React from "react";
import PopupWithForm from "./PopupWithForm";

function PopupConfirm({
  onLoading,
  onClose,
  isOpen,
  onCardDelete,
  card,
  onCloseOverlay,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onCardDelete(card);
  }

  return (
    <PopupWithForm
      // ПОПАП: ВЫ УВЕРЕНЫ?
      name="popupTypeDelete"
      title="Вы уверены?"
      buttonText={onLoading ? `Удаление...` : `Да`}
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onCloseOverlay={onCloseOverlay}
    />
  );
}

export default PopupConfirm;
