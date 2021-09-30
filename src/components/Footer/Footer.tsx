import React from "react";

const Footer: React.FunctionComponent = () => (
  <footer className="mcFooter">
    <div className="column">
      <span>
        Copyright &copy; {new Date().getFullYear()}. All rights reserved.
      </span>
    </div>
    <div className="column">
      <span>Created by: </span>&nbsp;&nbsp;
      <div className="row">
        <a
          href="https://www.linkedin.com/in/suresh-ungarala/"
          title="LinkedIn"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="linkedin"></span>
        </a>
        <a
          href="https://github.com/sureshUngarala/moment-capturer"
          title="GitHub"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="github"></span>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
