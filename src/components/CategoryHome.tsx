import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import Loader from "./Utils/Loader";
import Banner from "./Utils/Banner";
import ImageComponent from "./Utils/Image";

import { fetchImages, checkIfUserSignedIn } from "../utils/apis";
import { Image, McMoments } from "../info/types";
import { getMappedCategory } from "../utils/helpers";
import { initMoments } from "../utils/constants";

interface categoryHomeRouterProps {
  //contains history object and ...
}

interface homeProps extends RouteComponentProps<categoryHomeRouterProps> {}

const Home: React.FunctionComponent<homeProps> = (props: homeProps) => {
  const routeCategoryTag = props.location.pathname.split("/")[1].trim();
  const { tag } = getMappedCategory(routeCategoryTag);

  const [categoryHomeState, setCategoryHomeState] = useState({
    images: initMoments,
    fetchingImages: true,
    fetchingFailed: false,
    userSignedIn: false,
  });

  /* --------------------- data fetch start---------------------- */
  useEffect(() => {
    setCategoryHomeState({
      ...categoryHomeState,
      fetchingImages: true,
    });

    Promise.all([fetchImages(tag), checkIfUserSignedIn()]).then(
      ([data, isUserSignedIn]) => {
        const images: McMoments = JSON.parse(JSON.stringify(initMoments));
        (data.images as Image[]).forEach((image: Image) => {
          if (image.biotc) {
            images.biotc = image;
          } else {
            images.moments.push(image);
          }
        });
        setCategoryHomeState({
          images,
          fetchingImages: false,
          fetchingFailed: false,
          userSignedIn: isUserSignedIn,
        });
      },
      () => {
        setCategoryHomeState({
          ...categoryHomeState,
          fetchingImages: false,
          fetchingFailed: true,
        });
      }
    );
  }, [tag]);
  /* --------------------- data fetch end---------------------- */

  const {
    images: { biotc, moments: images },
    fetchingImages,
    fetchingFailed,
    userSignedIn,
  } = categoryHomeState;

  let categoryHome = <></>;
  if (fetchingImages) {
    categoryHome = <Loader />;
  } else if (fetchingFailed) {
    categoryHome = <Banner canRefresh />;
  } else if (!(images.length || biotc.original.length)) {
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
            userSignedIn={userSignedIn}
            categoryTag={tag}
          />
        )}
        <div className="images-container">
          {images.map((image: Image) => {
            return (
              <ImageComponent
                {...image}
                userSignedIn={userSignedIn}
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

export default withRouter(Home);
