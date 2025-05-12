import { createStory } from "@/store/actions/storyActions";
import { Context } from "@/store/provider";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { mediaTools } from "@/utils/tools";
import {
  FaceSmileIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useContext } from "react";

class CreateEditStoryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: {},
      loaded: true,
    };
  }

  handleInputMedia = (e) => {
    e.target.value = "";
  };
  handleLoadImage = (e) => {
    if (!this.state.loaded) {
      this.setState({
        ...this.state,
        loaded: true,
        media: {
          ...this.state.media,
          width: e.currentTarget.naturalWidth,
          height: e.currentTarget.naturalHeight,
        },
      });
    }
  };

  handleLoadVideo = (e) => {
    if (!this.state.loaded) {
      this.setState({
        ...this.state,
        loaded: true,
        media: {
          ...this.state.media,
          width: e.target.videoWidth,
          height: e.target.videoHeight,
        },
      });
    }
  };

  handleChangeMedia = async (e) => {
    const file = e.target.files[0];
    if (!file)
      return this.props.dispatch({
        type: GLOBAL_TYPES.ALERT_ERROR,
        payload: "File does not exist.",
      });
    if (file.size > 1024 * 1024 * 50)
      return this.props.dispatch({
        type: GLOBAL_TYPES.ALERT_ERROR,
        payload: "The image/video largest is 50mb.",
      });
    this.setState({
      ...this.state,
      loaded: false,
      media: { ...this.state.media, file },
    });
  };

  handleDeleteMedia = () => {
    this.setState({ ...this.state, media: {}, loaded: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.media.file) {
      createStory(this.props.dispatch, {
        media: this.state.media,
        auth: this.props.state.auth,
      });
    } else {
      this.props.dispatch({
        type: GLOBAL_TYPES.ALERT_ERROR,
        payload: "Please add your content or Media",
      });
    }
    this.setState({
      media: {},
      loaded: true,
    })
  };
  
  render() {
    return (
      <div className="flex bg-background-light  flex-col flex-grow w-full rounded-custom gap-4 p-4 md:p-8 ">
        <div className="flex items-start justify-between ">
          <h3 className="text-xl lg:text-2xl font-semibold ">Create Story</h3>
        </div>
        <form
          onSubmit={this.handleSubmit.bind(this)}
          className="flex flex-row flex-wrap w-full gap-3   md:gap-6"
        >
              <div className="whitespace-nowrap flex flex-grow flex-col">
            <div className="px-3 py-1.5 rounded-2xl hover:text-white text-text-main font-semibold mb-2 mr-4 bg-background-main hover:bg-primary-main flex space-x-2">
              <input
                id="file-icon-button"
                name="file"
                type="file"
                hidden
                accept="image/*,video/*"
                onChange={this.handleChangeMedia}
                onClick={this.handleInputMedia}
              />
              <label htmlFor="file-icon-button" className="w-full">
                <div
                  component="span"
                  className="cursor-pointer flex space-x-2"
                >
                  <LinkIcon className="w-6 h-6" />
                  <span>Attachments</span>
                </div>
              </label>
            </div>
            <div className="flex-grow" />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-2xl flex justify-center font-bold border-2 border-border-outline/20 text-white disabled:text-text-light disabled:hover:bg-background-main cursor-pointer mb-2 mr-4 disabled:bg-background-main bg-primary-main items-center  space-x-2"
              disabled={!this.state.loaded}
            >
              Create Story
            </button>
          </div>
           {this.state.media.file && ( <div className="">
          
              <div className="border-2 border-border-outline w-auto  rounded-2xl relative hover:border-primary-main hover:bg-primary-light/20 cursor-pointer">
                <div
                  className="absolute z-20 right-1 top-1 p-1 border-2 border-border-outline rounded-xl hover:text-white text-text-light cursor-pointer bg-background-main hover:bg-primary-main"
                  onClick={this.handleDeleteMedia.bind(this)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </div>
                <div className="flex-shrink-0 bg-background-light border-2 border-transparent  h-[500px]  rounded-2xl overflow-hidden leading-none ">
                  {/*
                        {mediaTools.isVideo({ src:this.state.media.url })
                          ? mediaTools.videoShow({
                              src:this.state.media.url,
                              width: 250,
                              height: 250,
                            })
                          : mediaTools.imageShow({
                              src:this.state.media.url,
                              width: 250,
                              height: 250,
                            })}
                      </> */}
                    {mediaTools.isVideo(this.state.media.file.type) ? (
                      <video
                        controls={true}
                        src={URL.createObjectURL(this.state.media.file)}
                        alt="video"
                        style={{
                          aspectRatio:
                            9/16,
                          objectFit: "contain",
                          minHeight: "500px",
                          height: "100%",
                        }}
                        onLoadedMetadata={this.handleLoadVideo.bind(this)}
                      />
                    ) : (
                      <div
                        className="relative"
                        style={{
                          aspectRatio:
                            9/16,
                          objectFit: "contain",
                          minHeight: "500px",
                          height: "100%",
                        }}
                      >
                        <Image
                          src={URL.createObjectURL(this.state.media.file)}
                          alt="picture"
                          fill={true}
                          style={{
                            aspectRatio:
                              this.state.media.width / this.state.media.height,
                            objectFit: "contain",
                            minHeight: "140px",
                            height: "100%",
                          }}
                          onLoad={this.handleLoadImage.bind(this)}
                        />
                      </div>
                    )}
                </div>
              </div>
           
          </div> )}
      
        </form>
      </div>
    );
  }
}

const CreateEditStory = () => {
  const { state, dispatch } = useContext(Context);
  return <CreateEditStoryComponent state={state} dispatch={dispatch} />;
};

export default CreateEditStory;
