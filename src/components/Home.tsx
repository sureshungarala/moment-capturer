import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import {
  Image,
  McMoments,
  initMoments,
  getImages,
  McAction,
} from "../redux/actions";
import { McState } from "../redux/reducers";
import ImageComponent from "./Image";

interface MapStateToProps {
  images: McMoments;
  fetchingImages: boolean;
}

interface MapDispatchToProps {
  getImages: (categoryTag: string, actionType: string) => Promise<void>;
}

interface homeProps extends MapStateToProps, MapDispatchToProps {}

const Home: React.FunctionComponent<homeProps> = (props: homeProps) => {
  const biotc = props.images.biotc,
    images = props.images.moments;
  return (
    <div className="category-home">
      {props.fetchingImages && (
        <div className="fetchingImages">
          <div className="spinner"></div>
        </div>
      )}
      {!props.fetchingImages && (
        <React.Fragment>
          {biotc.original.length > 0 && (
            <ImageComponent
              original={biotc.original}
              srcSet={biotc.srcSet}
              description={biotc.description}
              updateTime={biotc.updateTime}
              resolution={biotc.resolution}
              key={biotc.updateTime}
            />
          )}
          <div className="images-container">
            {images.map((image: Image) => {
              return (
                <ImageComponent
                  original={image.original}
                  srcSet={image.srcSet}
                  panorama={image.panorama}
                  portrait={image.portrait}
                  description={image.description}
                  updateTime={image.updateTime}
                  resolution={image.resolution}
                  key={image.updateTime}
                />
              );
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
