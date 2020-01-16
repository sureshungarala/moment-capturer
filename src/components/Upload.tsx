import React from 'react';
import categories from '../info/categories.json';
import Categories from './Categories';

interface uploadProps {

}

interface uploadState {
    files: FileList | null,
    description: string,
    categorySelected: string
}

export default class extends React.Component<uploadProps, uploadState>{
    fileRef: React.RefObject<HTMLInputElement>;
    descriptionRef: React.RefObject<HTMLTextAreaElement>;

    constructor(props: uploadProps) {
        super(props);
        this.state = {
            files: null,
            description: '',
            categorySelected: categories[0].name
        };
        this.fileRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.openFileDialog = this.openFileDialog.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    openFileDialog() {
        this.fileRef.current && this.fileRef.current.click();
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            files: event.target.files
        }, () => {
            this.state.files &&
                this.state.files.length &&
                this.descriptionRef.current &&
                this.descriptionRef.current.focus();
        });
        console.log(event.target.files);
        console.log('value changed');
    }

    handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log('File submitted.', this.state);
        if (this.state.files && this.state.files.length !== 0) {
            const file = this.state.files[0],
                start = window.performance.now();
            let reader = new FileReader(),
                image = new Image(),
                imageName = this.state.files[0].name;

            reader.addEventListener('load', () => {
                image.addEventListener('load', () => {
                    console.log(window.performance.now() - start);
                    let body = JSON.stringify({
                        image: reader.result,
                        imageName: imageName,
                        resolution: image.width + ':' + image.height,
                        category: this.state.categorySelected.toLowerCase(),
                        description: this.state.description
                    });

                    try {
                        const response = fetch('https://api.momentcapturer.com/csr', {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'content-type': 'application/json',
                                'accept': 'application/json'
                            },
                            body: body
                        });
                        console.log('CSR succeeded with response ', response);
                    } catch (err) {
                        console.log('CSR failed with error ', err);
                    }
                });
                image.src = window.URL.createObjectURL(file);
            });
            reader.readAsDataURL(file);
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="upload-form">
                <input type="button" value="Choose files to Upload" onClick={this.openFileDialog} />
                {
                    <span>{this.state.files && this.state.files.length ? `${this.state.files[0].name} is` : 'No file'} selected</span>
                }
                <input type="file" accept="image/*" ref={this.fileRef} onChange={this.handleChange} style={{ visibility: 'hidden' }} />
                <textarea placeholder="Give some description" ref={this.descriptionRef}
                    value={this.state.description} onChange={(event) => {
                        this.setState({
                            description: event.target.value.trim()
                        })
                    }}
                    className={this.state.files && this.state.files.length && !this.state.description.length ? 'error' : ''}>
                </textarea>
                <Categories onSelectCategory={(category) => {
                    console.log('in upload ', category);
                    this.setState({
                        categorySelected: category
                    })
                }} />
                <input type="submit" value="Upload" />
            </form>
        );
    }
}