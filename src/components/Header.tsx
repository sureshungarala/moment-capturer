import React from 'react';
import { connect } from 'react-redux';
import { setCategory, getImages, McAction, SET_IMAGES } from '../actions';
import { McState } from '../reducers';
import Categories from './Categories';
import Profiles_Handheld from './Profiles';
import { ThunkDispatch } from 'redux-thunk';

interface MapStateToProps {
    category: string
}

interface MapDispatchToProps {
    setCategory: (category: string) => McAction,
    getImages: (category: string, actionType: string) => Promise<void>
}

interface headerProps extends MapStateToProps, MapDispatchToProps {
}

class Header extends React.Component<headerProps> {
    constructor(props: headerProps) {
        super(props);
        this.updateCategory = this.updateCategory.bind(this);
    }

    componentDidMount() {
        this.props.getImages(this.props.category, SET_IMAGES);
    }

    updateCategory(category: string) {
        this.props.setCategory(category);
        this.props.getImages(category, SET_IMAGES);
    }

    render() {
        return (
            <header className="mcHeader">
                <div className="logoSection">
                    <span className="logo"></span>
                    <span className="branding-title">Moment Capturer</span>
                </div>
                <div className="actionSection">
                    <Categories onSelectCategory={this.updateCategory} />
                    <div className="profiles">
                        <div className="instagram">In</div>
                        <div className="facebook">Fb</div>
                        <div className="someOther">So</div>
                        <div className="profilePic">Pp</div>
                    </div>
                    <Profiles_Handheld />
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state: McState): MapStateToProps => {
    return {
        category: state.category || ''
    }
}

//If mapDispatchToProps is object, dispatchProps will be merged to component's props.
const mapDispatchToProps = (dispatch: ThunkDispatch<McState, {}, McAction>): MapDispatchToProps => {
    return {
        getImages: async (category: string, actionType: string) => {
            await dispatch(getImages(category, actionType));
        },
        setCategory
    }
}

export default connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)(Header);