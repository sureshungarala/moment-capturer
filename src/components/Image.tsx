import React from 'react';

interface imageProps {
    srcSet: {
        [resolution: string]: string
    },
    original: string,
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
            children: <React.Fragment />
        }
        this.containerRef = React.createRef();
        this.handleImgError = this.handleImgError.bind(this);
    }

    handleImgError() {
        console.log(`${this.props.original} failed to load!`);
    }

    componentDidMount() {
        const observer = new window.IntersectionObserver((entries) => {
            const entry = entries[0],
                { isIntersecting } = entry;
            if (isIntersecting) {
                let sources = [];
                for (let key in this.props.srcSet) {
                    sources.push(
                        <source media={`(max-width:${key})`} srcSet={this.props.srcSet[key]} type="image/jpeg" key={key} />
                    );
                }
                this.setState({
                    children: <React.Fragment>
                        {
                            sources
                        }
                        <img alt={this.props.description} src={this.props.original} onError={this.handleImgError} />
                    </React.Fragment>
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
            <div className="imageContainer" ref={this.containerRef}>
                <picture onLoad={() => { }}>
                    {this.state.children}
                </picture>
            </div>
        );
    }
}
