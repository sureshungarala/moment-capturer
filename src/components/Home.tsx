import React from 'react';
import Image from './Image'

interface homeProps {

}

interface homeState {
    images: []
}

interface image {
    original: string,
    updateTime: number,
    srcSet: {
        [key: string]: string
    },
    description: string
}

export default class Home extends React.Component<homeProps, homeState> {

    constructor(props: homeProps) {
        super(props);
        this.state = {
            images: []
        };
    }

    componentDidMount() {
        fetch(`https://api.momentcapturer.com/getData?category=travel`, {
            headers: {
                'accept': 'application/json'
            }
        }).then((response) => {
            response.json().then((data) => {
                console.log('fetched data ', data);
                this.setState({
                    images: data.images.map((image: image) => {
                        return <Image original={image.original} srcSet={image.srcSet} description={image.description} updateTime={image.updateTime} key={image.updateTime} />
                    })
                });
            });
        }, (err) => {
            console.log(`Couldn't fetch data`, err);
        });
    }

    render() {
        return (
            <div className="category-home">
                <div>Suresh Ungarala</div>
                <div className="images-container">
                    {this.state.images}
                </div>
            </div>
        )
    }
}