import React from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";

import Categories from "../Utils/Categories";
import { GAEvent } from "../Utils/GA-Tracker";

import Profiles from "./Profiles";

interface HeaderRouterProps {
  //contains history object and ...
}

interface headerProps extends RouteComponentProps<HeaderRouterProps> {}

class Header extends React.Component<headerProps> {
  // updating the url in browser's url bar if url is changed manually or page is refreshed
  // `this.props.location` gives browser url
  updateCategory = (categoryTag: string) => {
    this.props.history.push(`/${categoryTag}`);
    GAEvent("Header", "Navigate_to", `/${categoryTag}`);
  };

  redirectToHome = () => {
    this.props.history.push(`/`);
    GAEvent("Header", "Navigate_to", "Home");
  };

  render() {
    const routeCategoryTag = this.props.location.pathname.split("/")[1].trim();

    return (
      <header className="mcHeader">
        <NavLink to="/" className="logoSection" aria-label="link to home page">
          <span className="logo" role="img"></span>
          <h3 className="branding-title" id="brand-name">
            Moment Capturer
          </h3>
        </NavLink>
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

export default withRouter(Header);
