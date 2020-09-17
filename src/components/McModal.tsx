import React from "react";

import { Image } from "../info/types";

interface McModalProps extends Image {
  closeModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

interface McModalState {}

export default class McModal extends React.Component<
  McModalProps,
  McModalState
> {
  render() {
    const resolution = this.props.resolution.split(":").map(Number);
    return (
      <div className="mcModal">
        <div
          className="mcModalContent"
          style={{
            width:
              window.innerWidth > resolution[0]
                ? resolution[0] + "px"
                : window.innerWidth - 20 + "px",
            height:
              window.innerHeight > resolution[1]
                ? resolution[1] + "px"
                : window.innerHeight - 20 + "px",
          }}
        >
          <div className="mcModalBody">
            <img src={this.props.original} alt={this.props.description} />
            <div className="description">descriptionn</div>
          </div>
        </div>
        <div
          className="close"
          onClick={(event) => this.props.closeModal(event)}
          title="close"
        ></div>
      </div>
    );
  }
}
