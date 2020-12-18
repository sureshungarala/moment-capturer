import React, { useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { getFirstCategory } from "../utils/helpers";

interface HomeRouterProps {
  //contains history object and ...
}

interface HomeProps extends RouteComponentProps<HomeRouterProps> {}

const Home: React.FunctionComponent<HomeProps> = (props) => {
  const { tag: categoryTag } = getFirstCategory();

  useEffect(() => {
    props.history.push(`/${categoryTag}`);
  });

  return <></>;
};

export default withRouter(Home);
