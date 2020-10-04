import React from "react";
import { connect } from "react-redux";

import SignInForm from "./SignInForm";
import UploadForm from "./UploadForm";
import { McState } from "../info/types";

interface MapStateToProps {
  userSignedIn: boolean;
}

interface uploadProps extends MapStateToProps {}

const Upload: React.FunctionComponent<uploadProps> = (props: uploadProps) => {
  const renderTemplate = () => {
    if (props.userSignedIn) {
      return <UploadForm />;
    }
    return <SignInForm />;
  };

  return renderTemplate();
};

const mapStateToProps = (state: McState) => ({
  userSignedIn: state.userSignedIn || false,
});

export default connect<MapStateToProps>(mapStateToProps)(Upload);
