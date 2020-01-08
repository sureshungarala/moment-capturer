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
            let formdata = new window.FormData();
            formdata.append('image', this.state.files[0], this.state.files[0].name);
            try {
                const response = fetch('https://api.momentcapturer.com/csr', {
                    method: 'POST',
                    headers: {
                        'content-type': 'multipart/form-data'
                    },
                    body: formdata
                });
                console.log('CSR succeeded with response ', response);
            } catch (err) {
                console.log('CSR failed with error ', err);
            }
        }
    }

    render() {
        let fileCount = this.state.files ? this.state.files.length : 0;
        return (
            <form onSubmit={this.handleSubmit} className="upload-form">
                <input type="button" value="Choose files to Upload" onClick={this.openFileDialog} />
                <span>{`${fileCount} file${fileCount === 1 ? 's' : ''}`} selected</span>
                <input type="file" accept="image/*" ref={this.fileRef} onChange={this.handleChange} multiple style={{ visibility: 'hidden' }} />
                <input type="submit" value="Upload" />
            </form>
        );
    }
}