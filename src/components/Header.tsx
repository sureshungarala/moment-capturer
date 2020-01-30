import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { NavLink } from 'react-router-dom';
import { setCategory, getImages, McAction, SET_IMAGES } from '../actions';
import { McState } from '../reducers';
import Categories from './Categories';
import Profiles_Handheld from './Profiles';

interface MapStateToProps {
    category: string,
    categoryTag: string
}

interface MapDispatchToProps {
    setCategory: (category: string, categoryTag: string) => McAction,
    getImages: (categoryTag: string, actionType: string) => Promise<void>
}

interface headerProps extends MapStateToProps, MapDispatchToProps {
}

class Header extends React.Component<headerProps> {
    constructor(props: headerProps) {
        super(props);
        this.updateCategory = this.updateCategory.bind(this);
    }

    updateCategory(category: string, categoryTag: string) {
        this.props.setCategory(category, categoryTag);
        this.props.getImages(categoryTag, SET_IMAGES);
    }

    render() {
        return (
            <header className="mcHeader">
                <NavLink to="/">
                    <div className="logoSection">
                        <span className="logo"></span>
                        <span className="branding-title">Moment Capturer</span>
                    </div>
                </NavLink>
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
        category: state.category || '',
        categoryTag: state.categoryTag || ''
    }
}

//If mapDispatchToProps is object, dispatchProps will be merged to component's props.
const mapDispatchToProps = (dispatch: ThunkDispatch<McState, {}, McAction>): MapDispatchToProps => {
    return {
        getImages: async (categoryTag: string, actionType: string) => {
            await dispatch(getImages(categoryTag, actionType));
        },
        setCategory
    }
}

export default connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps)(Header);