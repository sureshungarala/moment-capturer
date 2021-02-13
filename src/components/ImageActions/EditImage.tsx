import React, { useState, memo } from "react";
import { Auth } from "@aws-amplify/auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";

import Categories from "../Utils/Categories";
import { Image } from "../../info/types";

import { editImage, deleteImage } from "../../utils/apis";

interface editImageProps extends Image {
  categoryTag: string;
  userSignedIn: boolean;
  enlargeImage: () => void;
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
  };

  const onDeleteBtnClick = () => {
    setComponentState({
      ...componentState,
      deleteImage: true,
    });
  };

  const cancelAction = () => {
    setComponentState(initState);
  };

  const startEditAction = () => {
    setComponentState({
      ...componentState,
      requestStarted: true,
      editingImage: true,
      editingImageFailed: false,
    });
  };

  const editActionSucceded = () => {
    setComponentState({
      ...componentState,
      editingImage: false,
      editingImageFailed: false,
      requestStarted: true,
      requestStatusMsg: "Capture Updated.",
    });
  };

  const editActionFailed = () => {
    setComponentState({
      ...componentState,
      editingImage: false,
      editingImageFailed: true,
      requestStarted: true,
      requestStatusMsg: "Failed to update.",
    });
  };

  const startDeleteAction = () => {
    setComponentState({
      ...componentState,
      requestStarted: true,
      deletingImage: true,
      deletingImageFailed: false,
    });
  };

  const deleteActionSucceded = () => {
    setComponentState({
      ...componentState,
      deletingImage: false,
      deletingImageFailed: false,
      requestStarted: true,
      requestStatusMsg: "Capture deleted.",
    });
  };

  const deleteActionFailed = () => {
    setComponentState({
      ...componentState,
      deletingImage: false,
      deletingImageFailed: true,
      requestStarted: true,
      requestStatusMsg: "Failed to delete.",
    });
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
  };

  /* --------------------- state updates end ------------------------- */

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
          onSelectCategory={(categoryTag) => {
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
          onClick={props.enlargeImage}
          onKeyUp={({ keyCode }) => {
            if (keyCode === 13) {
              props.enlargeImage();
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
