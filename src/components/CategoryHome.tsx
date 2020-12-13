import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { withRouter, RouteComponentProps } from "react-router-dom";

import Loader from "./Loader";
import Banner from "./Banner";
import ImageComponent from "./Image";

import { Image, McAction, McMoments, McState } from "../info/types";
import {
  initMoments,
  getImages,
  checkIfUserSignedIn,
  setCategory,
} from "../redux/actions";
import { getMappedCategory } from "../utils/helpers";

interface MapStateToProps {
  images: McMoments;
  fetchingImages: boolean;
  fetchingFailed: boolean;
  userSignedIn: boolean;
}

interface MapDispatchToProps {
  getImages: (categoryTag: string) => Promise<void>;
  checkIfUserSignedIn: () => Promise<void>;
  setCategory: (category: string, categoryTag: string) => void;
}

interface categoryHomeRouterProps {
  //contains history object and ...
}

interface homeProps
  extends MapStateToProps,
    MapDispatchToProps,
    RouteComponentProps<categoryHomeRouterProps> {}

const Home: React.FunctionComponent<homeProps> = (props: homeProps) => {
  const routeCategoryTag = props.location.pathname.split("/")[1].trim();
  const { name, tag } = getMappedCategory(routeCategoryTag);
  const { biotc, moments: images } = props.images;

  useEffect(() => {
    Promise.all([
      props.getImages(tag),
      props.checkIfUserSignedIn(),
      props.setCategory(name, tag),
    ]);
  }, [tag]);

  let categoryHome = <></>;
  if (props.fetchingImages) {
    categoryHome = <Loader />;
  } else if (props.fetchingFailed) {
    categoryHome = <Banner canRefresh />;
  } else if (!images.length) {
    categoryHome = (
      <Banner
        title={
          "No moments recorded for this category as of yet. Wait for some time and check again."
        }
      />
    );
  } else {
    categoryHome = (
      <React.Fragment>
        {biotc.original.length > 0 && (
          <ImageComponent
            {...biotc}
            userSignedIn={props.userSignedIn}
            categoryTag={tag}
          />
        )}
        <div className="images-container">
          {images.map((image: Image) => {
            return (
              <ImageComponent
                {...image}
                userSignedIn={props.userSignedIn}
                categoryTag={tag}
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
    fetchingFailed: state.fetchingFailed || false,
    userSignedIn: state.userSignedIn || false,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<McState, {}, McAction>
): MapDispatchToProps => {
  return {
    getImages: async (categoryTag: string) => {
      await dispatch(getImages(categoryTag));
    },
    checkIfUserSignedIn: async () => {
      await dispatch(checkIfUserSignedIn());
    },
    setCategory: (category: string, categoryTag: string) => {
      dispatch(setCategory(category, categoryTag));
    },
  };
};

export default withRouter(
  connect<MapStateToProps, MapDispatchToProps>(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
