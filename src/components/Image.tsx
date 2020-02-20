import React from 'react';

interface imageProps {
    srcSet: {
        [resolution: string]: string
    },
    original: string,
    panorama?: boolean,
    portrait?: boolean,
    description: string,
    updateTime?: number
}

interface imageState {
    children: React.ReactFragment
}

export default class Image extends React.Component<imageProps, imageState> {

    containerRef: React.RefObject<HTMLDivElement>;
    constructor(props: imageProps) {
        super(props);
        this.state = {
            children: <picture />
        }
        this.containerRef = React.createRef();
        this.handleImgError = this.handleImgError.bind(this);
    }

    handleImgError() {
        console.log(`${this.props.original} failed to load!`);
    }

    componentDidMount() {
        //For later: if no support for IntersectionObserver, renders image
        const observer = new window.IntersectionObserver((entries: Array<IntersectionObserverEntry>) => {
            const entry = entries[0],
                { isIntersecting } = entry;
            console.log('isIntersecting ', isIntersecting);
            if (isIntersecting) {
                let sources = [];
                for (let key in this.props.srcSet) {
                    sources.push(
                        <source media={`(max-width: ${key})`} srcSet={this.props.srcSet[key]} title={this.props.description} type="image/jpeg" key={key} />
                    );
                }
                this.setState({
                    children: <picture>
                        {
                            sources
                        }
                        <img alt={this.props.description} src={this.props.original} title={this.props.description} />
                    </picture>
                }, () => observer.disconnect());
            }
        },
            {
                root: null,
                rootMargin: "0px 0px 200px 0px"
            }
        );
        observer.observe(this.containerRef.current as Element);
    }

    render() {
        return (
            <div className={`imageContainer ${this.props.panorama ? 'panorama' : this.props.portrait ? 'portrait' : ''}`} ref={this.containerRef}>
                {this.state.children}
            </div>
        );
    }
}
