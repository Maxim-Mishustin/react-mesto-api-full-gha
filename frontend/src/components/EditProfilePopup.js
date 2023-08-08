import React, { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup({
  isOpen,
  onUpdateUser,
  onLoading,
  onClose,
  onCloseOverlay,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: name,
      about: about,
    });
  }

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value);
  }

  return (
    <PopupWithForm
      // ПОПАП РЕДАКТИРОВАНИЯ ПРОФИЛЯ: EDIT
      name="popupTypeEdit"
      title="Редактировать профиль"
      buttonText={onLoading ? `Сохранение...` : `Сохранить`}
      onSubmit={handleSubmit}
      onClose={onClose}
      isOpen={isOpen}
      onCloseOverlay={onCloseOverlay}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_name"
          id="inputName"
          type="text"
          name="name"
          placeholder="Имя"
          required
          minLength="2"
          maxLength="40"
          value={name || ""}
          onChange={handleChangeName}
        />
        <span className="inputName-error error" />
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_job"
          id="inputJob"
          type="text"
          name="about"
          placeholder="Профессия"
          required
          minLength="2"
          maxLength="200"
          value={about || ""}
          onChange={handleChangeAbout}
        />
        <span className="inputJob-error error" />
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
