import React, { useState, useEffect } from "react";
import Categories from "./Categories";
import { Image } from "../info/types";

interface editImageProps extends Image {
  categoryTag: string;
}
const EditImage: React.FunctionComponent<editImageProps> = (
  props: editImageProps
) => {
  const initState = {
    editImage: false,
    editingImage: false,
    editingImageFailed: false,
    deleteImage: false,
    deletingImage: false,
    deletingImageFailed: false,
  };

  const initValueState = {
    categoryTag: props.categoryTag,
    description: props.description,
  };
  const [state, setState] = useState(initState);
  const [editState, setEditState] = useState(initValueState);

  /* --------------------- state updates start ------------------------- */
  const onEditBtnClick = () => {
    setState({
      ...state,
      editImage: true,
    });
  };

  const onDeleteBtnClick = () => {
    setState({
      ...state,
      deleteImage: true,
    });
  };

  const cancelAction = () => {
    setState(initState);
  };
  /* --------------------- state updates end ------------------------- */
  const renderEditForm = () => (
    <section className="imageActionFormContainer">
      <form className="editForm" onSubmit={cancelAction}>
        <Categories
          onSelectCategory={(category, categoryTag) => {
            setEditState({
              ...editState,
              categoryTag: categoryTag,
            });
          }}
          routeCategoryTag={props.categoryTag}
        />
        <textarea
          placeholder="Give some new description"
          value={editState.description}
          onChange={(event) =>
            setEditState({ ...editState, description: event.target.value })
          }
        />
        <div className="editActions">
          <input
            type="button"
            onClick={cancelAction}
            value="Cancel"
            className="cancel"
          />
          <input
            type="submit"
            value="Update"
            className="yesEdit"
            disabled={
              editState.categoryTag === props.categoryTag &&
              editState.description === props.description
            }
          />
        </div>
      </form>
    </section>
  );

  const renderDeleteConfirmation = () => (
    <section className="imageActionFormContainer">
      <form className="deleteConfirmation" onSubmit={cancelAction}>
        <div className="confirmationTxt">Are you sure, you want to delete?</div>
        <div className="deleteActions">
          <input
            type="button"
            onClick={cancelAction}
            value="Cancel"
            className="cancel"
          />
          <input type="submit" value="Yes" className="yesDelete" />
        </div>
      </form>
    </section>
  );

  return (
    <div
      className={`editImage ${
        state.editImage || state.deleteImage ? "actionFormContainer" : ""
      }`}
    >
      <div className="actions">
        <div
          className="edit"
          onClick={(event) => {
            event.stopPropagation();
            onEditBtnClick();
          }}
        ></div>
        <div
          className="delete"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteBtnClick();
          }}
        ></div>
      </div>
      {state.editImage && renderEditForm()}
      {state.deleteImage && renderDeleteConfirmation()}
    </div>
  );
};

export default EditImage;
