import React from "react";

import EditImage from "./EditImage";
import McModal from "./McModal";

import { Image as imageType } from "../info/types";

interface imageState {
  children: React.ReactFragment;
  showModal: boolean;
}

interface imageProps extends imageType {
  userSignedIn: boolean;
  categoryTag: string;
}

export default class Image extends React.Component<imageProps, imageState> {
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: imageProps) {
    super(props);
    this.state = {
      children: <picture />,
      showModal: false,
    };
    this.containerRef = React.createRef();
  }

  handleImgError = () => {
    console.error(`${this.props.original} failed to load!`);
  };

  openModal = () => {
    this.setState({
      showModal: true,
    });
  };

  closeModal = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    this.setState({
      showModal: false,
    });
  };

  escapeModal = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.state.showModal &&
        this.setState({
          showModal: false,
        });
    }
  };

  componentDidMount() {
    //For later: if no support for IntersectionObserver, render image
    const observer = new window.IntersectionObserver(
      (entries: Array<IntersectionObserverEntry>) => {
        const entry = entries[0],
          { isIntersecting } = entry;
        console.info("isIntersecting ", isIntersecting);
        if (isIntersecting) {
          let sources = [];
          for (let key in this.props.srcSet) {
            sources.push(
              <source
                media={`(max-width: ${key})`}
                srcSet={this.props.srcSet[key]}
                title={this.props.description}
                type="image/jpeg"
                key={key}
              />
            );
          }
          this.setState(
            {
              children: (
                <picture onClick={this.openModal}>
                  {sources}
                  <img
                    alt={this.props.description}
                    src={this.props.original}
                    title={this.props.description}
                  />
                </picture>
              ),
            },
            () => observer.disconnect()
          );
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 200px 0px",
      }
    );
    observer.observe(this.containerRef.current as Element);

    document.addEventListener("keyup", this.escapeModal);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.escapeModal);
  }

  render() {
    return (
      <div
        className={`imageContainer ${
          this.props.panorama
            ? "panorama"
            : this.props.portrait
            ? "portrait"
            : "landscape"
        }`}
        ref={this.containerRef}
      >
        {this.state.children}
        {this.state.showModal && (
          <McModal {...this.props} closeModal={this.closeModal} />
        )}
        <EditImage {...this.props} />
      </div>
    );
  }
}
