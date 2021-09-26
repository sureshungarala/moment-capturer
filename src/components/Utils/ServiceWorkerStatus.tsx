import React, { useEffect, useState } from "react";

import "../../styles/templates/swStatus.scss";

import { swEventName } from "../../utils/constants";

const ServiceWorkerStatus: React.FunctionComponent = () => {
  const [showUpdate, setUpdateStatus] = useState(false);
  const [showSuccess, setSuccessStatus] = useState(false);

  useEffect(() => {
    document.addEventListener(swEventName, ((event: CustomEvent) => {
      const { detail } = event;
      if (detail === "update") {
        showUpdateStatus();
      } else if (detail === "success") {
        showSuccessStatus();
        window.setTimeout(() => {
          hideStatuses();
        }, 5000);
      }
    }) as EventListener);
  });

  const showUpdateStatus = () => {
    setUpdateStatus(true);
    setSuccessStatus(false);
  };

  const showSuccessStatus = () => {
    setUpdateStatus(false);
    setSuccessStatus(true);
  };

  const hideStatuses = () => {
    setUpdateStatus(false);
    setSuccessStatus(false);
  };

  return (
    <div className="swStatus">
      {showUpdate && (
        <div className="updateAvailable">
          <span>A new version is available.</span>
          <button
            onClick={() =>
              document.dispatchEvent(
                new CustomEvent(swEventName, { detail: "proceed-update" })
              )
            }
          >
            Update
          </button>
          <div
            className="close"
            title="close"
            tabIndex={0}
            onClick={hideStatuses}
          ></div>
        </div>
      )}
      {showSuccess && (
        <div className="updateDone">
          <span>Content is cached for offline use.</span>
          <div
            className="close"
            title="close"
            tabIndex={0}
            onClick={hideStatuses}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ServiceWorkerStatus;
