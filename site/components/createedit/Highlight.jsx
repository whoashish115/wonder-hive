import { getArchiveStories } from "@/store/actions/storyActions";
import { Context } from "@/store/provider";
import { mediaTools } from "@/utils/tools";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { createHighlight } from "@/store/actions/highlightActions";
import { LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import GLOBAL_TYPES from "@/store/types/globalTypes";
import { HiCheck } from "react-icons/hi";
import { BiImageAdd } from "react-icons/bi";

export const StoryCard = (story) => {
  const { _id, media, comments, selected } = story;
  const width = media.width
  const height = media.height
  return (
    <div className=" flex-col gap-2 group overflow-hidden grid grid-cols-4">
      <div className={`h-full max-h-[300px]  relative self-stretch justify-stretch object-fill  `}
        style={{ aspectRatio: 9 / 16, objectFit: 'contain', minHeight: '140px', }}>
          {selected && <div className="absolute top-0 left-0 z-20 bg-primary-main/10  w-full h-full flex justify-center items-center rounded-custom border-2 border-primary-main" ><HiCheck className="text-6xl text-white"/></div>}

        {(mediaTools.isVideo(media.url) ? (
          <video
            style={{ aspectRatio: 9 / 16, objectFit: 'cover', objectPosition: 'center', minHeight: '140px', height: '100%', width: '100%' }}
            src={media.url}
            className="rounded-custom"
            alt="video"
          />
        ) : (
          <Image
            src={media.url}
            alt="picture"
            height={height}
            width={width}
            style={{ aspectRatio: 9 / 16, minHeight: '140px' }}
            className="rounded-custom object-cover object-center w-full h-full"
          />
        ))}
      </div>
    </div>
  );
};

class CreateEditHighlightComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'dsfdsf',
      picture: {},
      stories: [],
    };
  }
  handleDeletePicture = () => {
    this.setState({ ...this.state, picture: {}, loaded: false });
  };
  handleChangePicture = async (e) => {
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
      picture: { ...this.state.picture, file },
    });
  };

  handleDeletePicture = () => {
    this.setState({ ...this.state, picture: {}, loaded: false });
  };
  handleInputPicture = (e) => {
    e.target.value = "";
  };
  handleLoadImage = (e) => {
    if (!this.state.loaded) {
      this.setState({
        ...this.state,
        picture: {
          ...this.state.picture,
          width: e.currentTarget.naturalWidth,
          height: e.currentTarget.naturalHeight,
        },
        loaded:true
      });
    }
  };

  handleSelectStory = (id) => {
    if (this.state.stories.includes(id)) {
      this.setState({ stories: this.state.stories.filter((storyId) => storyId !== id) })
    }
    else {
      this.setState({ stories: [...this.state.stories, id] })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    // if (.onEdit) {
    //   dispatch(updateHighlight({ content, images, auth, status }));
    // } else {
    if (!this.state.picture.file) return this.props.dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: 'picture is required' })
    if (this.state.stories.length == 0) return this.props.dispatch({ type: GLOBAL_TYPES.ALERT_ERROR, payload: 'atleast one stories should be selected' })
    createHighlight(this.props.dispatch, {
      stories: this.state.stories,
      picture: this.state.picture,
      title: this.state.title,
      auth: this.props.state.auth,
    });
    // }
  };


  // useEffect(() => {
  //     if (status.onEdit) {
  //         setContent(status.content);
  //         setmedia(status.images);
  //     }
  // }, [status]);
  render() {
    return (
      <div className="flex bg-background-light  flex-col flex-grow w-full rounded-custom gap-4 p-4 md:p-8 ">
        <div className="flex items-start justify-between ">
          <h3 className="text-xl lg:text-2xl font-semibold ">Create Highlight</h3>
        </div>
        <form
          onSubmit={this.handleSubmit.bind(this)}
          className="flex flex-col w-full gap-4   md:gap-6"
        >
          <div className="flex gap-6 md:flex-row flex-col-reverse items-start  ">
            <div className="flex w-full  flex-col flex-grow gap-2 justify-between">
            <div className="  w-full ">Title</div>
            <div className="w-full">
            <input
              id="title"
              name="title"
              value={this.state.title}
              rows={8}
              onChange={(e)=>this.setState({...this.state, title:e.target.value.slice(0,25)})}
              className="outline-none px-4 py-2 resize-none  !ring-0 mx-1  bg-background-extralight rounded-custom placeholder:text-text-light border-2 border-transparent hover:border-border-outline focus:border-border-outline w-full"
              />
            <div className={`${this.state.title.length >25 ? 'text-error-main ' :'text-text-light'}  text-sm flex justify-end w-full `}>{this.state.title.length}/25</div>
              </div>
            </div>
          <div className="flex gap-2 flex-col items-center justify-center md:justify-start w-full md:w-auto">
             <div className=" flex-shrink-0 relative group rounded-full overflow-hidden w-[200px] h-[200px] ">
                {this.state.picture.file &&<Image
                  src={URL.createObjectURL(this.state.picture.file)}
                  alt="Picture"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] rounded-full object-cover"
                />}
                <div>
                  <input
                    type="file"
                    name="file"
                    hidden
                    id="profile-image-file-input"
                    accept="image/*"
                    onChange={this.handleChangePicture.bind(this)}
                    onClick={this.handleInputPicture.bind(this)}
                  />
                  <label
                    htmlFor="profile-image-file-input"
                    className={`bg-black/60 border border-border-outline rounded-full transition-all cursor-pointer absolute top-0 z-20 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center group-hover:opacity-100 ${this.state.picture.file ? 'opacity-0' : 'opacity-60'}`}
                  >
                    <span>
                      <BiImageAdd className="text-4xl" />
                    </span>
                  </label>
                </div>
              </div>
          <h3 className="text-base ">Display Picture</h3>

          </div>
          </div>

          <div className='w-full grid flex-grow-0 gap-2'>
          <h3 className="text-base ">Select Stories</h3>
            {this.props.state.story.archiveStories.data.length !== 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                className=" object-cover justify-stretch"
                style={{ width: "100%", height: "100%" }}
                scrollbar={{ draggable: true }}
                slidesPerView={'auto'}
              >
                {this.props.state.story.archiveStories.data.map((id) => (
                  <SwiperSlide
                    style={{ width: 'auto' }}
                    className="h-full pr-2 self-stretch justify-stretch object-fill  w-full"
                    key={id}
                    onClick={() => this.handleSelectStory(id)}
                  >
                    <StoryCard {...this.props.state.story.detailedStories[id]} selected={this.state.stories.includes(id)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <div className="whitespace-nowrap flex flex-grow flex-col">
            <div className="flex-grow" />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-2xl flex justify-center font-bold border-2 border-border-outline/20 text-white disabled:text-text-light disabled:hover:bg-background-main cursor-pointer mb-2 disabled:bg-background-main bg-primary-main items-center  space-x-2"
            >
              Create Highlight
            </button>
          </div>

        </form>
      </div>
    );
  }
}

const CreateEditHighlight = () => {
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    if (!state.story.archiveStories.firstLoad)
      getArchiveStories(dispatch, state.auth)
  }, [])

  return <CreateEditHighlightComponent state={state} dispatch={dispatch} />;
};

export default CreateEditHighlight;
