import React, { useState, memo } from "react";
import { Auth } from "@aws-amplify/auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";

import Categories from "../Utils/Categories";
import { Image } from "../../info/types";
import { GAEvent } from "../Utils/GA-Tracker";
import "../../styles/templates/edit_image.scss";

import { editImage, deleteImage } from "../../utils/apis";
import { toggleModalEventName } from "../../utils/constants";

interface editImageProps extends Image {
  categoryTag: string;
  userSignedIn: boolean;
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
    requestStarted: false,
    requestStatusMsg: "",
  };

  const initValueState = {
    categoryTag: props.categoryTag,
    description: props.description,
  };

  const [componentState, setComponentState] = useState(initState);
  const [editState, setEditState] = useState(initValueState);

  /* --------------------- state updates start ------------------------- */
  const onEditBtnClick = () => {
    setComponentState({
      ...componentState,
      editImage: true,
    });
    GAEvent("Image", "Edit-image clicked", props.categoryTag);
  };

  const onDeleteBtnClick = () => {
    setComponentState({
      ...componentState,
      deleteImage: true,
    });
    GAEvent("Image", "Delete-image clicked", props.categoryTag);
  };

  const cancelAction = () => {
    setComponentState(initState);
    GAEvent("Image", "Edit/Delete action canceled", props.categoryTag);
  };

  const startEditAction = () => {
    setComponentState({
      ...componentState,
      requestStarted: true,
      editingImage: true,
      editingImageFailed: false,
    });
    GAEvent("Image", "Edit-image started", props.categoryTag);
  };

  const editActionSucceded = () => {
    setComponentState({
      ...componentState,
      editingImage: false,
      editingImageFailed: false,
      requestStarted: true,
      requestStatusMsg: "Capture Updated.",
    });
    GAEvent("Image", "Edit-image successful", props.categoryTag);
  };

  const editActionFailed = () => {
    setComponentState({
      ...componentState,
      editingImage: false,
      editingImageFailed: true,
      requestStarted: true,
      requestStatusMsg: "Failed to update.",
    });
    GAEvent("Image", "Edit-image failed", props.categoryTag);
  };

  const startDeleteAction = () => {
    setComponentState({
      ...componentState,
      requestStarted: true,
      deletingImage: true,
      deletingImageFailed: false,
    });
    GAEvent("Image", "Delete-image started", props.categoryTag);
  };

  const deleteActionSucceded = () => {
    setComponentState({
      ...componentState,
      deletingImage: false,
      deletingImageFailed: false,
      requestStarted: true,
      requestStatusMsg: "Capture deleted.",
    });
    GAEvent("Image", "Delete-image successful", props.categoryTag);
  };

  const deleteActionFailed = () => {
    setComponentState({
      ...componentState,
      deletingImage: false,
      deletingImageFailed: true,
      requestStarted: true,
      requestStatusMsg: "Failed to delete.",
    });
    GAEvent("Image", "Delete-image failed", props.categoryTag);
  };

  const authFailed = () => {
    setComponentState({
      ...componentState,
      editingImage: false,
      editingImageFailed: true,
      deletingImage: false,
      deletingImageFailed: true,
      requestStarted: true,
      requestStatusMsg: "Log in and try again.",
    });
    GAEvent("Image", "Auth failed for Edit/Delete action", props.categoryTag);
  };

  const onCategoryChange = (categoryTag: string) => {
    setEditState({
      ...editState,
      categoryTag,
    });
    GAEvent("Image", "Edit-image_category-changed", props.categoryTag);
  };

  const onDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditState({ ...editState, description: event.target.value });
    GAEvent("Image", "Edit-image_description-changed", props.categoryTag);
  };

  /* --------------------- state updates end ------------------------- */

  const enlargeImage = () => {
    const { categoryTag, userSignedIn, ...image } = props;
    document.dispatchEvent(
      new CustomEvent(toggleModalEventName, { detail: image })
    );
    GAEvent("Image", "Enlarge", props.categoryTag);
  };

  const updateImageMetadata = async (event: React.FormEvent) => {
    event.preventDefault();
    startEditAction();
    try {
      const session: CognitoUserSession = await Auth.currentSession();
      const body = {
        currentCategory: props.categoryTag,
        newCategory: editState.categoryTag,
        description: editState.description,
        updateTime: props.updateTime,
      };
      editImage(session.getIdToken().getJwtToken(), JSON.stringify(body)).then(
        (response: Response) => {
          if (response.ok) {
            editActionSucceded();
          } else {
            editActionFailed();
          }
        },
        () => {
          editActionFailed();
        }
      );
    } catch (error) {
      console.error("Authorization failed: ", error);
      authFailed();
    }
  };

  const deleteCapture = async (event: React.FormEvent) => {
    event.preventDefault();
    startDeleteAction();
    try {
      const session: CognitoUserSession = await Auth.currentSession();
      const body = {
        category: props.categoryTag,
        updateTime: props.updateTime,
      };
      deleteImage(
        session.getIdToken().getJwtToken(),
        JSON.stringify(body)
      ).then(
        (response: Response) => {
          if (response.ok) {
            deleteActionSucceded();
          } else {
            deleteActionFailed();
          }
        },
        () => {
          deleteActionFailed();
        }
      );
    } catch (error) {
      console.error("Authorization failed: ", error);
      authFailed();
    }
  };

  /* --------------------- modular renders start ------------------------- */

  const renderActionStatus = () => {
    let actionTemplate = <div></div>;
    if (componentState.requestStarted) {
      if (componentState.editingImage || componentState.deletingImage) {
        actionTemplate = (
          <>
            <span className="processing"></span>
            &nbsp;&nbsp;
            <span>
              {componentState.editingImage ? "updating" : "deleting"}...
            </span>
          </>
        );
      } else {
        actionTemplate = (
          <div
            className={
              componentState.editingImageFailed ||
              componentState.deletingImageFailed
                ? "error"
                : "success"
            }
          >
            {componentState.requestStatusMsg}
          </div>
        );
      }
      return <div className="requestStatus">{actionTemplate}</div>;
    }
    return actionTemplate;
  };

  const renderEditActionsButons = () => {
    let actionButtons = <></>;
    if (
      componentState.requestStarted &&
      !componentState.editingImage &&
      !componentState.editingImageFailed
    ) {
      actionButtons = (
        <input
          type="button"
          onClick={cancelAction}
          value="Close"
          className="cancel"
        />
      );
    } else {
      actionButtons = (
        <>
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
        </>
      );
    }
    return <div className="editActions">{actionButtons}</div>;
  };

  const renderDeleteActionsButons = () => {
    let actionButtons = <></>;
    if (
      componentState.requestStarted &&
      !componentState.deletingImage &&
      !componentState.deletingImageFailed
    ) {
      actionButtons = (
        <input
          type="button"
          onClick={cancelAction}
          value="Close"
          className="cancel"
        />
      );
    } else {
      actionButtons = (
        <>
          <input
            type="button"
            onClick={cancelAction}
            value="Cancel"
            className="cancel"
          />
          <input type="submit" value="Yes" className="yesDelete" />
        </>
      );
    }
    return <div className="deleteActions">{actionButtons}</div>;
  };

  const renderEditForm = () => (
    <section className="imageActionFormContainer">
      <form className="editForm" onSubmit={updateImageMetadata}>
        <Categories
          onSelectCategory={onCategoryChange}
          routeCategoryTag={props.categoryTag}
        />
        <textarea
          placeholder="Give some new description"
          value={editState.description}
          onChange={onDescriptionChange}
        />
        <div className="actionAndStatus">
          {renderActionStatus()}
          {renderEditActionsButons()}
        </div>
      </form>
    </section>
  );

  const renderDeleteConfirmation = () => (
    <section className="imageActionFormContainer">
      <form className="deleteConfirmation" onSubmit={deleteCapture}>
        <div className="confirmationTxt">Are you sure, you want to delete?</div>
        <div className="actionAndStatus">
          {renderActionStatus()}
          {renderDeleteActionsButons()}
        </div>
      </form>
    </section>
  );
  /* --------------------- modular renders end ------------------------- */

  return (
    <div
      className={`editImage ${
        componentState.editImage || componentState.deleteImage
          ? "actionFormContainer"
          : ""
      }`}
    >
      <div className="actions">
        {props.userSignedIn && (
          <>
            <div
              className="delete"
              title="Delete image"
              onClick={onDeleteBtnClick}
              onKeyUp={({ keyCode }) => {
                if (keyCode === 13) {
                  onDeleteBtnClick();
                }
              }}
              role="img"
              aria-haspopup="true"
              tabIndex={0}
            ></div>
            <div
              className="edit"
              title="Edit image"
              onClick={() => {
                onEditBtnClick();
              }}
              onKeyUp={({ keyCode }) => {
                if (keyCode === 13) {
                  onEditBtnClick();
                }
              }}
              role="img"
              aria-haspopup="true"
              tabIndex={0}
            ></div>
          </>
        )}
        <div
          className="enlarge"
          title="Click to view full resolution image"
          onClick={enlargeImage}
          onKeyUp={({ keyCode }) => {
            if (keyCode === 13) {
              enlargeImage();
            }
          }}
          role="img"
          aria-haspopup="true"
          tabIndex={0}
        ></div>
      </div>
      {componentState.editImage && renderEditForm()}
      {componentState.deleteImage && renderDeleteConfirmation()}
    </div>
  );
};

// to avoid TypeError: Converting circular structure to JSON (liekly coz of srcSet)
const circularReplacer = (key: string, value: any) => {
  if (typeof value === "object") return undefined;
  return value;
};

export default memo(EditImage, (prevProps, nextProps) => {
  if (
    JSON.stringify(prevProps, circularReplacer) ===
    JSON.stringify(nextProps, circularReplacer)
  )
    return true;
  return false;
});
