import STORY_TYPES from '../types/storyTypes'

const storyReducer = (state, action) => {
    switch (action.type) {

        case STORY_TYPES.STORY_CREATE:
            return {
                ...state,
                story: {
                    ...state.story,
                    feedStories: {
                        ...state.story.feedStories,
                        data: [action.payload._id, ...state.story.feedStories.data]
                    },
                    // profileStories: {
                    //     ...state.story.profileStories,
                    //     [action.payload.user._id]: [action.payload._id, ...state.story.profileStories[action.payload.user._id]]
                    // },
                    detailedStories: { ...state.story.detailedStories, [action.payload._id]: action.payload }
                }
            };
        case STORY_TYPES.STORY_UPDATE:
            return {
                ...state,
                story: {
                    ...state.story,
                    detailedStories: {
                        ...state.story.detailedStories,
                        [action.payload._id]: action.payload

                    },
                }
            };
        case STORY_TYPES.STORY_DELETE:
            const { [action.payload._id]: deletedStory, ...remainingDetailedStories } = state.story.detailedStories;
            return {
                ...state,
                story: {
                    ...state.story,
                    feedStories: {
                        ...state.story.feedStories,
                        data: state.story.feedStories.data.filter(id => id !== action.payload._id)
                    },
                    archiveStories: {
                        ...state.story.archiveStories,
                        data: state.story.archiveStories.data.filter(id => id !== action.payload._id)
                    },
                    // profileStories: [
                    //     ...state.story.profileStories.reduce((acc, storyObject) => {
                    //         if (storyObject._id ==action.payload.user._id){
                    //             acc[post._id] = post;
                    //         }
                    //         return acc;
                    //     }, {})
                    //     [action.payload.user._id]: [action.payload._id, ...state.post.profileStories[action.payload.user._id]]

                    // ],
                    // highlightsStories: [

                    //     ...state.story.highlightsStories,
                    //     data: state.story.highlightsStories.data.filter(id => id == action.payload._id)
                    // ],
                    detailedStories: remainingDetailedStories
                }
            };
        case STORY_TYPES.HOME_STORY_LOADING:
            return {
                ...state,
                story: {
                    ...state.story,
                    feedStories: {
                        ...state.story.feedStories,
                        loading: action.payload
                    },
                }
            };
        case STORY_TYPES.HOME_STORY_GET:
            return {
                ...state,
                story: {
                    ...state.story,
                    feedStories: {
                        ...state.story.feedStories,
                        firstLoad: true,
                        result: action.payload.result,
                        page: action.payload.page,
                        data: action.payload.stories.map((story) => story._id)
                    },
                    detailedStories: {
                        ...state.story.detailedStories,
                        ...action.payload.stories.reduce((acc, story) => {
                            acc[story._id] = story;
                            return acc;
                        }, {})
                    }
                }
            };

        case STORY_TYPES.ARCHIVE_STORY_LOADING:
            return {
                ...state,
                story: {
                    ...state.story,
                    archiveStories: {
                        ...state.story.archiveStories,
                        loading: action.payload
                    },
                }
            };
        case STORY_TYPES.ARCHIVE_STORY_GET:
            return {
                ...state,
                story: {
                    ...state.story,
                    archiveStories: {
                        ...state.story.archiveStories,
                        firstLoad: true,
                        result: action.payload.result,
                        page: action.payload.page,
                        data: action.payload.stories.map((story) => story._id)
                    },
                    detailedStories: {
                        ...state.story.detailedStories,
                        ...action.payload.stories.reduce((acc, story) => {
                            acc[story._id] = story;
                            return acc;
                        }, {})
                    }
                }
            };

        case STORY_TYPES.PROFILE_STORY_GET:
            return {
                ...state,
                story: {
                    ...state.story,
                    profileStories:  [
                        ...state.story.profileStories,
                        { ...action.payload, stories: action.payload.stories.map((story) => story._id)}
                    ],
                    detailedStories: {
                        ...state.story.detailedStories,
                        ...action.payload.stories?.reduce((acc, story) => {
                            acc[story._id] = story;
                            return acc;
                        }, {})
                    }
                }
            };

        default:
            return state;
    }
}

export default storyReducer