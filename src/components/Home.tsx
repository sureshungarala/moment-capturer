import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Image, McMoments, initMoments, getImages, McAction, SET_IMAGES } from '../actions';
import { McState } from '../reducers';
import ImageComponent from './Image'


interface MapStateToProps {
    categoryTag: string,
    images: McMoments
}

interface MapDispatchToProps {
    getImages: (categoryTag: string, actionType: string) => Promise<void>
}

interface homeProps extends MapStateToProps, MapDispatchToProps {
}

class Home extends React.Component<homeProps> {

    constructor(props: homeProps) {
        super(props);
    }

    componentDidMount() {
        this.props.getImages(this.props.categoryTag, SET_IMAGES);
    }

    render() {
        const biotc = this.props.images.biotc,
            images = this.props.images.moments;
        return (
            <div className="category-home">
                {
                    biotc.original.length &&
                    <ImageComponent original={biotc.original}
                        srcSet={biotc.srcSet}
                        description={biotc.description}
                        updateTime={biotc.updateTime}
                        key={biotc.updateTime} />
                }
                <div className="images-container">
                    {
                        images.map((image: Image) => {
                            return <ImageComponent original={image.original}
                                srcSet={image.srcSet}
                                description={image.description}
                                updateTime={image.updateTime}
                                key={image.updateTime} />
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: McState): MapStateToProps => {
    return {
        categoryTag: state.categoryTag || '',
        images: state.images || initMoments
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<McState, {}, McAction>): MapDispatchToProps => {
    return {
        getImages: async (categoryTag: string, actionType: string) => {
            await dispatch(getImages(categoryTag, actionType));
        }
    }
}

export default connect<MapStateToProps>(mapStateToProps)(Home);
