import React from "react";

const Footer: React.FunctionComponent = () => {
  return (
    <div className="mcFooter">
      <div className="column">
        <span>
          CopyRight &copy; {new Date().getFullYear()}. All rights reserved.
        </span>
      </div>
      <div className="column">
        <span>Created by: </span>&nbsp;&nbsp;
        <div className="row">
          <a
            href="mailto:iamuvvsuresh@gmail.com"
            title="iamuvvsuresh@gmail.com"
          >
            <span className="gmail"></span>
          </a>
          <a
            href="https://github.com/sureshUngarala/moment-capturer"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="github"></div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
