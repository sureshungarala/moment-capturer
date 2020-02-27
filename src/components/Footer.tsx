import React from 'react';

const Footer: React.FunctionComponent = () => {
    return (
        <div className="mcFooter">
            <span>Created by: </span>&nbsp;&nbsp;
            <div className="row">
                <a href="mailto:iamuvvsuresh@gmail.com" title="iamuvvsuresh@gmail.com">
                    <span className="gmail" ></span>
                </a>
                <a href="https://github.com/sureshUngarala/moment-capturer" rel="noopener noreferrer" target="_blank">
                    <div className="github"></div>
                </a>
            </div>
        </div>
    )
}

export default Footer;