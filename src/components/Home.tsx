import React from "react";
import { connect } from "react-redux";

import ImageComponent from "./Image";

import { initMoments } from "../redux/actions";
import { Image, McMoments, McState } from "../info/types";

interface MapStateToProps {
  images: McMoments;
  fetchingImages: boolean;
}

interface homeProps extends MapStateToProps {}

const Home: React.FunctionComponent<homeProps> = (props: homeProps) => {
  const { biotc, moments: images } = props.images;
  return (
    <div className="category-home">
      {props.fetchingImages && (
        <div className="fetchingImages">
          <div className="spinner"></div>
        </div>
      )}
      {!props.fetchingImages && (
        <React.Fragment>
          {biotc.original.length > 0 && <ImageComponent {...biotc} />}
          <div className="images-container">
            {images.map((image: Image) => {
              return <ImageComponent {...image} key={image.updateTime} />;
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state: McState): MapStateToProps => {
  return {
    images: state.images || initMoments,
    fetchingImages: state.fetchingImages || false,
  };
};

export default connect<MapStateToProps>(mapStateToProps)(Home);
