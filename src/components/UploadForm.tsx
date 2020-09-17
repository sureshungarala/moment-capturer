import React from "react";
import { Auth } from "@aws-amplify/auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";

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
    this.maxFileSizeInKB = 5 * 1024;
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
  }

  openFileDialog = () => {
    this.fileRef.current && this.fileRef.current.click();
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  /**
   * Checks user authorization and uploads
   * @param event
   */
  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
          console.info(window.performance.now() - start);
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
          Auth.currentSession().then(
            (session: CognitoUserSession) => {
              const idToken = session.getIdToken().getJwtToken();
              fetch("https://api.momentcapturer.com/csr", {
                method: "POST",
                mode: "cors",
                headers: {
                  "content-type": "application/json",
                  accept: "application/json",
                  Authorization: idToken,
                },
                body,
              }).then(
                () => {
                  this.setState({
                    requestProcessing: false,
                    requestStatusSuccess: true,
                    requestStatusMsg: `${imageName} processed successfully.`,
                  });
                },
                (error) => {
                  this.setState({
                    requestProcessing: false,
                    requestStatusSuccess: false,
                    requestStatusMsg: `Failed to process ${imageName}. Try again!`,
                  });
                  console.error("CSR failed with error: ", error);
                }
              );
            },
            (error) => {
              console.error("Authorization failed: ", error);
              window.location.reload();
            }
          );
        });
        image.src = window.URL.createObjectURL(file);
      });
      reader.readAsDataURL(file);
    }
  };

  textArea = () => (
    <textarea
      placeholder="Give some description"
      ref={this.descriptionRef}
      onBlur={(event) => {
        this.setState(
          {
            description: event.target.value.trim(),
          },
          () => {
            if (this.descriptionRef.current) {
              if (!this.state.description.length) {
                this.descriptionRef.current.classList.add("error");
              } else {
                this.descriptionRef.current.classList.remove("error");
              }
            }
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
            if (this.descriptionRef.current) {
              if (!this.state.description.length) {
                this.descriptionRef.current.classList.add("error");
              } else {
                this.descriptionRef.current.classList.remove("error");
              }
            }
          }
        );
      }}
    ></textarea>
  );

  checkBoxToggles = () => (
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
        <span className="mcCheckboxLabel" title="Best Image of the Category">
          Biotc
        </span>
      </label>
      <label htmlFor="portraitCb" className="mcCheckboxContainer">
        <input
          type="checkbox"
          id="portraitCb"
          checked={this.state.isPortrait}
          onChange={(event) => {
            const isChecked = event.target.checked;
            this.setState((state: uploadState) => ({
              // should negate each other
              isPortrait: isChecked,
              isPanorama: isChecked ? false : state.isPanorama,
            }));
          }}
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
          onChange={(event) => {
            const isChecked = event.target.checked;
            this.setState((state: uploadState) => ({
              isPanorama: isChecked,
              isPortrait: isChecked ? false : state.isPortrait,
            }));
          }}
        />
        <div className="mcCheckboxHidden"></div>
        <span className="mcCheckboxLabel" title="Panorama">
          Panorama
        </span>
      </label>
    </div>
  );

  render() {
    return (
      <section className="upload-form">
        <form onSubmit={this.handleSubmit}>
          <input
            type="button"
            value="Choose file to Upload"
            onClick={this.openFileDialog}
          />
          <span
            style={{ color: this.state.fileStatusSuccess ? "black" : "red" }}
          >
            {this.state.fileStatusMsg}
          </span>
          <input
            type="file"
            accept="image/*"
            ref={this.fileRef}
            onChange={this.handleChange}
            style={{ visibility: "hidden" }}
          />
          {this.textArea()}
          <Categories
            onSelectCategory={(category, categoryTag) => {
              this.setState({
                categorySelected: categoryTag,
              });
            }}
          />
          {this.checkBoxToggles()}
          <input
            type="submit"
            value="Upload"
            className={
              this.state.files?.length && this.state.description.length
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
      </section>
    );
  }
}
