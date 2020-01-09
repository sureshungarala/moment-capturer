import React from 'react';

interface uploadProps {

}

interface uploadState {
    files: FileList | null
}

export default class extends React.Component<uploadProps, uploadState>{
    fileRef: React.RefObject<HTMLInputElement>;

    constructor(props: uploadProps) {
        super(props);
        this.state = {
            files: null
        };
        this.fileRef = React.createRef();
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
        });
        console.log(event.target.files);
        console.log('value changed');
    }

    handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        console.log('Files submitted.');
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
                        resolution: image.width + ':' + image.height
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
        let fileCount = this.state.files ? this.state.files.length : 0;
        return (
            <form onSubmit={this.handleSubmit} className="upload-form">
                <input type="button" value="Choose files to Upload" onClick={this.openFileDialog} />
                <span>{`${fileCount} file${fileCount === 1 ? 's' : ''}`} selected</span>
                <input type="file" accept="image/*" ref={this.fileRef} onChange={this.handleChange} style={{ visibility: 'hidden' }} />
                <input type="submit" value="Upload" />
            </form>
        );
    }
}