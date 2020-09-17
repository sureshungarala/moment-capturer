import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";

import ImageComponent from "./Image";

import { initMoments, getImages } from "../redux/actions";
import { Image, McMoments, McAction, McState } from "../info/types";

interface MapStateToProps {
  images: McMoments;
  fetchingImages: boolean;
}

interface MapDispatchToProps {
  getImages: (categoryTag: string, actionType: string) => Promise<void>;
}

interface homeProps extends MapStateToProps, MapDispatchToProps {}

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

const mapDispatchToProps = (
  dispatch: ThunkDispatch<McState, {}, McAction>
): MapDispatchToProps => {
  return {
    getImages: async (categoryTag: string, actionType: string) => {
      await dispatch(getImages(categoryTag, actionType));
    },
  };
};

export default connect<MapStateToProps, MapDispatchToProps>(
  mapStateToProps,
  mapDispatchToProps
)(Home);
