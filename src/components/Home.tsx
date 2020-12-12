import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { getImages, checkIfUserSignedIn } from "../redux/actions";
import { getFirstCategory } from "../utils/helpers";

import { McAction, McState } from "../info/types";

interface MapDispatchToProps {
  getImages: (categoryTag: string) => Promise<void>;
  checkIfUserSignedIn: () => Promise<void>;
}

interface HomeRouterProps {
  //contains history object and ...
}

interface HomeProps
  extends MapDispatchToProps,
    RouteComponentProps<HomeRouterProps> {}

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const firstCategory = getFirstCategory();
  const { tag: categoryTag } = firstCategory;

  useEffect(() => {
    props.history.push(`/${firstCategory.tag}`);
    Promise.all([props.getImages(categoryTag), props.checkIfUserSignedIn()]);
  });

  return <></>;
};

const mapStateToProps = (state: McState) => ({});

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
  };
};

export default withRouter(
  connect<{}, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)(Home)
);
