import React from 'react';
import Categories from './Categories';

interface headerProps {

}

interface headerState {
    category: string
}

export default class extends React.Component<headerProps, headerState> {
    constructor(props: headerProps) {
        super(props);
        this.state = {
            category: 'Abstract'
        }
    }

    render() {
        return (
            <header className="mcHeader">
                <div className="logoSection">
                    <span className="logo"></span>
                    <span className="branding-title">Moment Capturer</span>
                </div>
                <div className="actionSection">
                    <Categories />
                    <div className="profiles">
                        <div className="instagram">In</div>
                        <div className="facebook">Fb</div>
                        <div className="someOther">So</div>
                        <div className="profilePic">Pp</div>
                    </div>
                </div>
            </header>
        );
    }
}