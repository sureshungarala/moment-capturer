import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { setCategory, getImages, checkIfUserSignedIn } from "../redux/actions";

import Categories from "./Categories";
import { McAction, McState } from "../info/types";

import Profiles from "./Profiles";

interface MapDispatchToProps {
  setCategory: (category: string, categoryTag: string) => void;
  getImages: (categoryTag: string) => Promise<void>;
  checkIfUserSignedIn: () => Promise<void>;
}

interface HeaderRouterProps {
  //contains history object and ...
}

interface headerProps
  extends MapDispatchToProps,
    RouteComponentProps<HeaderRouterProps> {}

class Header extends React.Component<headerProps> {
  categoryTag: string;

  constructor(props: headerProps) {
    super(props);
    this.categoryTag = "";
  }

  // updating the url in browser's url bar if url is changed manually or page is refreshed
  // `this.props.location` gives browser url
  updateCategory = (category: string, categoryTag: string) => {
    this.categoryTag = categoryTag;
    this.props.setCategory(category, categoryTag);
    // if ("/upload" !== this.props.location.pathname.trim()) {
    // dont'fetch images from /upload screen
    this.props.history.push("/" + categoryTag);
    Promise.all([
      this.props.getImages(categoryTag),
      this.props.checkIfUserSignedIn(),
    ]);
    // }
  };

  redirectToHome = () => {
    this.props.history.push("/" + this.categoryTag);
    Promise.all([
      this.props.getImages(this.categoryTag),
      this.props.checkIfUserSignedIn(),
    ]);
  };

  render() {
    const routeCategoryTag = this.props.location.pathname.split("/")[1].trim();
    return (
      <header className="mcHeader">
        <div className="logoSection" onClick={this.redirectToHome}>
          <span className="logo"></span>
          <span className="branding-title">Moment Capturer</span>
        </div>
        <div className="actionSection">
          <Categories
            onSelectCategory={this.updateCategory}
            routeCategoryTag={routeCategoryTag}
          />
          <Profiles />
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state: McState) => ({});

//If mapDispatchToProps is object, dispatchProps will be merged to component's props.
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
  connect<{}, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)(Header)
);
