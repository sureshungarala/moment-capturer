import React from 'react';
import { connect } from 'react-redux';
import { Image } from '../actions';
import { McState } from '../reducers';
import ImageComponent from './Image'


interface MapStateToProps {
    images: Image[]
}

interface homeProps extends MapStateToProps {
}

class Home extends React.Component<homeProps> {

    constructor(props: homeProps) {
        super(props);
    }

    render() {
        return (
            <div className="category-home">
                <div>Suresh Ungarala</div>
                {
                    <div className="images-container">
                        {
                            this.props.images.map((image: Image) => {
                                return <ImageComponent original={image.original}
                                    srcSet={image.srcSet}
                                    description={image.description}
                                    updateTime={image.updateTime}
                                    key={image.updateTime} />
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: McState): MapStateToProps => {
    return {
        images: state.images || []
    }
}

export default connect<MapStateToProps>(mapStateToProps)(Home);
