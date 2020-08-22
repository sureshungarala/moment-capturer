import React from "react";

const Profiles: React.FunctionComponent = () => {
  return (
    <div className="profiles-handheld">
      <div className="profilePic"></div>
      <ul>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="">
            <span></span>
            <span>Nat Geo</span>
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="">
            <span></span>
            <span>Canon</span>
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="">
            <span></span>
            <span>Instagram</span>
          </a>
        </li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="">
            <span></span>
            <span>Facebook</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Profiles;
