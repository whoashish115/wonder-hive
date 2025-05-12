import { createPostGlimpse, getDetailedPostGlimpse, updatePostGlimpse } from "@/store/actions/postGlimpseActions";
import { Context } from "@/store/provider";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { mediaTools } from "@/utils/tools";
import {
  FaceSmileIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper } from 'swiper/react'
import { Navigation, Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import useStore from "@/hooks/useStore";
import { useRouter } from "next/router";
import Preloader from "../customs/Preloader";

class CreateEditPostComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      medias: this.props.post ? this.props.post.medias : [] ,
      content: this.props.post ? this.props.post.content :'',
      videoRef: "",
      refCanvas: "",
      tracks: "",
      stream:'',
    };
  }

  handleInputImageClick = (e) => {
    e.target.value = "";
  };
  handleLoadImage = (e) => {
    let newMedias = this.state.medias;
    let index = e.currentTarget.attributes.index.value;
    let newMedia = newMedias[index];
    if (newMedia.width == 0 && newMedia.height == 0) {
      newMedia = {
        ...newMedia,
        width: e.currentTarget.naturalWidth,
        height: e.currentTarget.naturalHeight,
      };
      newMedias[index] = newMedia;
      this.setState({ ...this.state, medias: newMedias });
    }
  };

  handleLoadVideo = (e) => {
    let newMedias = this.state.medias;
    let index = e.currentTarget.attributes.index.value;
    let newMedia = newMedias[index];
    if (newMedia.width == 0 && newMedia.height == 0) {
      newMedia = {
        ...newMedia,
        width: e.target.videoWidth,
        height: e.target.videoHeight,
      };
      newMedias[index] = newMedia;
      this.setState({ ...this.state, medias: newMedias });
    }
  };

  handleChangeMedias = async (e) => {
    const files = [...e.target.files];
    let error = "";
    let newMedias = [];

    files.forEach(async (file) => {
      if (!file) return (error = "File does not exist.");

      if (file.size > 1024 * 1024 * 50) {
        return (error = "The image/video largest is 50mb.");
      }
      return newMedias.push({ file, width: 0, height: 0 });
    });

    if (error) dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload:  error });
    this.setState({
      ...this.state,
      medias: [...this.state.medias, ...newMedias],
    });
  };

  handleDeleteMedias = (index) => {
    const newArr = this.state.medias;
    newArr.splice(index, 1);
    this.setState({...this.state, medias:newArr});
  };

  handleStream = () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((mediaStream) => {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();

            const track = mediaStream.getTracks();
            setTracks(track[0]);
          })
          .catch((error) => {
      this.setState({...this.state, stream:false});
            this.props.dispatch({
              type: GLOBAL_TYPES.ALERT_ERROR,
              payload:"Something went wrong while accessing your webcam or camera",
            });
          });
      }
      this.setState({...this.state, stream:true});
    } catch (error) {
      this.props.dispatch({
        type: GLOBAL_TYPES.ALERT_ERROR,
        payload:"Stream unsuccessful",
      });
    }
  };

  handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);

    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    this.setState({...this.state, medias:[...medias, {camera:URL}]});

  };

  handleStopStream = () => {
    if (tracks.stop) {
      tracks.stop();
      this.setState({...this.state, stream:false});
    }
    this.setState({...this.state, stream:false});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.post) {
      updatePostGlimpse(this.props.dispatch, { content:this.state.content, medias:this.state.medias, auth:this.props.state.auth , socket:this.props.state.socket});
    } else {
    if (this.state.medias.length !== 0 || this.state.content) {
      createPostGlimpse(this.props.dispatch, { content:this.state.content, medias:this.state.medias, auth:this.props.state.auth , socket:this.props.state.socket});
    } else {
      this.props.dispatch({
        type: GLOBAL_TYPES.ALERT_ERROR,
        payload:"Please add your content or Media",
      });
    }
    }
    this.setState({
      medias: this.props.post ? this.props.post.medias : [] ,
      content: this.props.post ? this.props.post.content :'',
      videoRef: "",
      refCanvas: "",
      tracks: "",
      steam:''
    })

  };

  render() {
    return (
      <div className="flex bg-background-light  flex-col flex-grow w-full rounded-custom gap-4 p-4 md:p-8 ">
        <div className="flex items-start justify-between ">
          <h3 className="text-xl lg:text-2xl font-semibold ">Create Post</h3>
        </div>
        <form
          onSubmit={this.handleSubmit.bind(this)}
          className="pt-0 space-y-4 flex flex-col flex-grow-0 w-full "
        >
            {!this.state.stream && (
            <textarea
              name="content"
              id="content"
              rows="10"
              value={this.state.content}
              onChange={(e) => this.setState({...this.state, content:e.target.value})}
              placeholder="Write here"
              className="p-4 w-full placeholder:text-text-light bg-transparent !border !border-border-outline inset-8  !outline-none !ring-0 rounded-xl resize-none"
            />
          )}
          {this.state.stream && (
            <div>
              <div onClick={this.handleStopStream.bind(this)}>
                <XMarkIcon className="w-5 h-5" />
              </div>
              <video
                muted
                autoPlay
                ref={this.state.videoRef}
                width="100%"
                height="90%"
                style={{ margin: "auto" }}
                className="rounded-xl overflow-hidden"
              />
              <canvas ref={this.state.refCanvas} style={{ display: "none" }} />
            </div>
          )}
     <div className='w-full  flex-grow-0'>
            {this.state.medias.length !== 0 && (
               <Swiper
               modules={[Navigation, Pagination]}
               className=" object-cover justify-stretch"
               style={{ width: "100%", height: "100%" }}
               scrollbar={{ draggable: true }}
               slidesPerView={'auto'}
             >
               {this.state.medias.map((media, index) => (
                 <SwiperSlide
                   style={{width:'auto' }}
                   className="h-full pr-2 self-stretch justify-stretch object-fill  w-full"
                   key={index}
                 >
                  <div className="border-2 border-border-outline w-auto  rounded-2xl relative hover:border-primary-main hover:bg-primary-light/20 cursor-pointer">
                    <div
                    className="absolute z-20 right-1 top-1 p-1 border-2 border-border-outline rounded-xl hover:text-white text-text-light cursor-pointer bg-background-main hover:bg-primary-main"
                    onClick={() => this.handleDeleteMedias(index)}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </div>
                    <div className="w-full flex-shrink-0 bg-background-light border-2 border-transparent  h-[250px]  rounded-2xl overflow-hidden leading-none ">
                      {media.camera ? (
                       <div className="relative" style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}>
                       <Image
                         src={media.camera}
                         alt="picture"
                         index={index}
                         fill={true}
                         style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}
                         onLoad={this.handleLoadImage.bind(this)}
                         />
                         </div>
                    ) : media.url ? (
                      <>
                        {mediaTools.isVideo(media.url)
                          ?   <video
                          controls={true}
                          index={index}
                          src={media.url}
                          alt="video"
                          style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}
                          onLoadedMetadata={this.handleLoadVideo.bind(this)}
                        />
                          :   <div className="relative" style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}>
                          <Image
                          src={media.url}
                            alt="picture"
                            index={index}
                            fill={true}
                            style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}
                            onLoad={this.handleLoadImage.bind(this)}
                            />
                            </div>}
                      </>
                    ) : (
                      <>
                        {mediaTools.isVideo(media.file.type) ? (
                          <video
                            controls={true}
                            index={index}
                            src={URL.createObjectURL(media.file)}
                            alt="video"
                            style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}
                            onLoadedMetadata={this.handleLoadVideo.bind(this)}
                          />
                        ) : (
                          <div className="relative" style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}>
                          <Image
                            src={URL.createObjectURL(media.file)}
                            alt="picture"
                            index={index}
                            fill={true}
                            style={{aspectRatio:media.width/media.height, objectFit:'contain', minHeight:'140px', height:'100%'}}
                            onLoad={this.handleLoadImage.bind(this)}
                            />
                            </div>
                        )}
                      </>
                      )}
                    </div>
                  </div>
            </SwiperSlide>
            ))}
          </Swiper>
            )}
          </div>
          <div className="flex justify-center flex-wrap items-center gap-2">

            <div className="px-6 py-1.5 rounded-2xl hover:text-white text-text-main font-semibold bg-background-main hover:bg-primary-main flex">
              <input
                id="file-icon-button"
                name="file"
                type="file"
                hidden
                multiple
                accept="image/*,video/*"
                onChange={this.handleChangeMedias.bind(this)}
                onClick={this.handleInputImageClick.bind(this)}
              />
              <label htmlFor="file-icon-button" className="w-full">
                <div
                  component="span"
                  className="cursor-pointer  flex space-x-2"
                >
                  <LinkIcon className="w-6 h-6" />
                  <span>Attachments</span>
                </div>
              </label>
            </div>
            <div className="px-3 py-1.5 rounded-2xl hover:text-white text-text-main font-semibold cursor-pointer bg-background-main hover:bg-primary-main flex">
              <FaceSmileIcon className="w-6 h-6" />
              <span>Emotions</span>
            </div>
            <div onClick={this.handleStream.bind(this)} className="px-3 py-1.5 rounded-2xl hover:text-white text-text-main font-semibold cursor-pointer bg-background-main hover:bg-primary-main flex">
              <FaceSmileIcon className="w-6 h-6" />
              <span>Camera</span>
            </div>
          </div>

            <button
              type="submit"
              className="px-3 py-1.5 rounded-2xl flex justify-center font-bold border-2 border-border-outline/20 text-white disabled:text-text-light cursor-pointer mb-2 mr-4 disabled:bg-background-main bg-primary-main items-center  space-x-2"
              disabled={
                !(this.state.medias.length > 0)
              }
            >
              Create Post
            </button>

        </form>
      </div>
    );
  }
}

const CreateEditPost = () => {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState()

  const {state, dispatch} = useStore()
  const router = useRouter()
  const { id } = router.query
  const {auth} = state
  useEffect(() => {
    if(id){
      getDetailedPostGlimpse(dispatch,{detailedPostsGlimpses: state.postGlimpse.detailedPostsGlimpses, id, auth });
      if (state.postGlimpse.detailedPostsGlimpses) {
        setPost(state.postGlimpse.detailedPostsGlimpses[id]);
      }
    }
  }, [state.postGlimpse.detailedPostsGlimpses, dispatch, id, auth]);
  useEffect(() => {
    if(post){
      setLoading(false)
    }
  }, [post])
  return id ? (loading ? <Preloader/> : <CreateEditPostComponent state={state} post={post} dispatch={dispatch} />) :<CreateEditPostComponent state={state} dispatch={dispatch} />
};

export default CreateEditPost;
