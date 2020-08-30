import React from "react";
import categoryArray from "../info/categories.json";
import Categories from "./Categories";

interface uploadProps {}

interface uploadState {
  files: FileList | null;
  fileStatusSuccess: boolean;
  fileStatusMsg: string;
  description: string;
  categorySelected: string;
  isBiotc: boolean;
  isPanorama: boolean;
  isPortrait: boolean;
  requestStarted: boolean;
  requestProcessing: boolean;
  requestStatusSuccess: boolean;
  requestStatusMsg: string;
}

export default class extends React.Component<uploadProps, uploadState> {
  fileRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  maxFileSizeInKB: number;

  constructor(props: uploadProps) {
    super(props);
    this.maxFileSizeInKB = 350;
    this.state = {
      files: null,
      fileStatusSuccess: true,
      fileStatusMsg: "No file selected",
      description: "",
      categorySelected: categoryArray[0].tag.length
        ? categoryArray[0].tag
        : categoryArray[0].submenu[0].tag,
      isBiotc: false,
      isPanorama: false,
      isPortrait: false,
      requestStarted: false,
      requestProcessing: false,
      requestStatusSuccess: false,
      requestStatusMsg: "",
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
    const files = event.target.files;
    if (files && files.length) {
      if (files[0].size <= this.maxFileSizeInKB * 1024) {
        this.setState(
          {
            files,
            fileStatusSuccess: true,
            fileStatusMsg: `${files[0].name} is selected`,
          },
          () => {
            this.descriptionRef.current && this.descriptionRef.current.focus();
          }
        );
      } else {
        this.setState({
          files: files,
          fileStatusSuccess: false,
          fileStatusMsg: `Max file size: ${this.maxFileSizeInKB}KB`,
        });
      }
    } else {
      this.setState({
        files,
        fileStatusSuccess: true,
        fileStatusMsg: "No file selected",
      });
    }

    console.log(event.target.files);
    console.log("value changed");
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log(this.state);
    if (
      this.state.files &&
      this.state.files.length !== 0 &&
      this.state.description.length
    ) {
      this.setState({
        requestStarted: true,
        requestProcessing: true,
      });
      const file = this.state.files[0],
        start = window.performance.now();
      let reader = new FileReader(),
        image = new Image(),
        imageName = this.state.files[0].name;

      reader.addEventListener("load", () => {
        image.addEventListener("load", () => {
          console.log(window.performance.now() - start);
          let body = JSON.stringify({
            image: reader.result,
            imageName: imageName,
            resolution: image.width + ":" + image.height,
            category: this.state.categorySelected.toLowerCase(),
            biotc: this.state.isBiotc,
            panorama: this.state.isPanorama,
            portrait: this.state.isPortrait,
            description: this.state.description,
          });

          try {
            const response = fetch("https://api.momentcapturer.com/csr", {
              method: "POST",
              mode: "cors",
              headers: {
                "content-type": "application/json",
                accept: "application/json",
              },
              body,
            }).then(() => {
              this.setState({
                requestProcessing: false,
                requestStatusSuccess: true,
                requestStatusMsg: `${imageName} processed successfully.`,
              });
              console.log("CSR succeeded with response ", response);
            });
          } catch (err) {
            this.setState({
              requestProcessing: false,
              requestStatusSuccess: false,
              requestStatusMsg: `Failed to process ${imageName}. Try again!`,
            });
            console.log("CSR failed with error ", err);
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
        <input
          type="button"
          value="Choose file to Upload"
          onClick={this.openFileDialog}
        />
        <span style={{ color: this.state.fileStatusSuccess ? "black" : "red" }}>
          {this.state.fileStatusMsg}
        </span>
        <input
          type="file"
          accept="image/*"
          ref={this.fileRef}
          onChange={this.handleChange}
          style={{ visibility: "hidden" }}
        />
        <textarea
          placeholder="Give some description"
          ref={this.descriptionRef}
          onBlur={(event) => {
            this.setState(
              {
                description: event.target.value.trim(),
              },
              () => {
                !this.state.description.length
                  ? this.descriptionRef.current &&
                    this.descriptionRef.current.classList.add("error")
                  : this.descriptionRef.current &&
                    this.descriptionRef.current.classList.remove("error");
              }
            );
          }}
          value={this.state.description}
          onChange={(event) => {
            this.setState(
              {
                description: event.target.value,
              },
              () => {
                !this.state.description.length
                  ? this.descriptionRef.current &&
                    this.descriptionRef.current.classList.add("error")
                  : this.descriptionRef.current &&
                    this.descriptionRef.current.classList.remove("error");
              }
            );
          }}
        ></textarea>
        <Categories
          onSelectCategory={(category, categoryTag) => {
            console.log("in upload ", category);
            this.setState({
              categorySelected: categoryTag,
            });
          }}
        />
        <div className="resolutionCbToggles">
          <label htmlFor="biotcCb" className="mcCheckboxContainer">
            <input
              type="checkbox"
              id="biotcCb"
              checked={this.state.isBiotc}
              onChange={(event) =>
                this.setState({
                  isBiotc: event.target.checked,
                })
              }
            />
            <div className="mcCheckboxHidden"></div>
            <span
              className="mcCheckboxLabel"
              title="Best Image of the Category"
            >
              Biotc
            </span>
          </label>
          <label htmlFor="portraitCb" className="mcCheckboxContainer">
            <input
              type="checkbox"
              id="portraitCb"
              checked={this.state.isPortrait}
              onChange={(event) =>
                this.setState({
                  isPortrait: event.target.checked,
                })
              }
            />
            <div className="mcCheckboxHidden"></div>
            <span className="mcCheckboxLabel" title="Portrait">
              Portrait
            </span>
          </label>
          <label htmlFor="panaromaCb" className="mcCheckboxContainer">
            <input
              type="checkbox"
              id="panaromaCb"
              checked={this.state.isPanorama}
              onChange={(event) =>
                this.setState({
                  isPanorama: event.target.checked,
                })
              }
            />
            <div className="mcCheckboxHidden"></div>
            <span className="mcCheckboxLabel" title="Panorama">
              Panorama
            </span>
          </label>
        </div>
        <input
          type="submit"
          value="Upload"
          className={
            this.state.files &&
            this.state.files.length &&
            this.state.description.length
              ? ""
              : "disabled"
          }
        />
        {this.state.requestStarted && (
          <div className="requestStatus">
            {this.state.requestProcessing && (
              <div>
                <span className="processing"></span>
                &nbsp;&nbsp;
                <span> Processing...</span>
              </div>
            )}
            {!this.state.requestProcessing && (
              <div
                className={`${
                  this.state.requestStatusSuccess ? "success" : "error"
                }`}
              >
                {this.state.requestStatusMsg}
              </div>
            )}
          </div>
        )}
      </form>
    );
  }
}
