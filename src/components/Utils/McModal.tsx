import React from "react";

import { getModalDimensions } from "../../utils/helpers";
import { Image } from "../../info/types";

interface McModalProps extends Image {
  closeModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

interface McModalState {}

export default class McModal extends React.Component<
  McModalProps,
  McModalState
> {
  render() {
    const { width, height } = getModalDimensions(this.props);
    return (
      <div className="mcModal">
        <div
          className="mcModalContent"
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          <div className="mcModalBody">
            <img
              src={this.props.original}
              alt={this.props.description}
              tabIndex={0}
            />
          </div>
        </div>
        <div
          className="close"
          onClick={(event) => this.props.closeModal(event)}
          title="close"
          tabIndex={0}
        ></div>
      </div>
    );
  }
}
