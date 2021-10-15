import React from "react";

import EditImage from "../ImageActions/EditImage";

import { Image as imageType } from "../../info/types";

interface imageState {
  children: React.ReactFragment;
  imageLoaded: boolean;
}

interface imageProps extends imageType {
  userSignedIn: boolean;
  categoryTag: string;
}

class Image extends React.Component<imageProps, imageState> {
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: imageProps) {
    super(props);
    this.state = {
      children: <picture />,
      imageLoaded: false,
    };
    this.containerRef = React.createRef();
  }

  handleImgError = () => {
    console.error(`${this.props.original} failed to load!`);
  };

  componentDidMount() {
    //For later: if no support for IntersectionObserver, render image
    const observer = new window.IntersectionObserver(
      (entries: Array<IntersectionObserverEntry>) => {
        const entry = entries[0],
          { isIntersecting } = entry;
        const { description: title, srcSet, original } = this.props;
        if (isIntersecting) {
          let sources = [];
          for (let key in srcSet) {
            sources.push(
              <source
                media={`(max-width: ${key})`}
                srcSet={srcSet[key]}
                type="image/jpeg"
                key={key}
              />
            );
          }
          this.setState(
            {
              children: (
                <picture>
                  {sources}
                  <img
                    alt=""
                    src={original}
                    title={title}
                    onLoad={() => this.setState({ imageLoaded: true })}
                    tabIndex={0}
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
  }

  render() {
    const { panorama, portrait, description } = this.props;
    return (
      <div
        className={`imageContainer ${
          panorama ? "panorama" : portrait ? "portrait" : "landscape"
        }`}
        ref={this.containerRef}
      >
        {this.state.children}

        {this.state.imageLoaded && (
          <div className="descriptionContainer">{description}</div>
        )}
        <EditImage {...this.props} />
      </div>
    );
  }
}

export default Image;
