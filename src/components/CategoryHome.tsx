import React from "react";
import { connect } from "react-redux";

import Loader from "./Loader";
import ImageComponent from "./Image";

import { initMoments } from "../redux/actions";
import { Image, McMoments, McState } from "../info/types";
import { getFirstCategory } from "../utils/helpers";

interface MapStateToProps {
  images: McMoments;
  fetchingImages: boolean;
  userSignedIn: boolean;
  categoryTag: string;
}

interface homeProps extends MapStateToProps {}

const Home: React.FunctionComponent<homeProps> = (props: homeProps) => {
  const { biotc, moments: images } = props.images;

  let categoryHome = <></>;
  if (props.fetchingImages) {
    categoryHome = <Loader />;
  } else {
    categoryHome = (
      <React.Fragment>
        {biotc.original.length > 0 && (
          <ImageComponent
            {...biotc}
            userSignedIn={props.userSignedIn}
            categoryTag={props.categoryTag}
          />
        )}
        <div className="images-container">
          {images.map((image: Image) => {
            return (
              <ImageComponent
                {...image}
                userSignedIn={props.userSignedIn}
                categoryTag={props.categoryTag}
                key={image.updateTime}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
  return <div className="category-home">{categoryHome}</div>;
};

const mapStateToProps = (state: McState): MapStateToProps => {
  return {
    images: state.images || initMoments,
    fetchingImages: state.fetchingImages || false,
    userSignedIn: state.userSignedIn || false,
    categoryTag: state.categoryTag || getFirstCategory().tag,
  };
};

export default connect<MapStateToProps>(mapStateToProps)(Home);
