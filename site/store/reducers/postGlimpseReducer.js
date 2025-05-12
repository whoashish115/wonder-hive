import { dataTools } from '@/utils/tools';
import POST_GLIMPSE_TYPES from '../types/postGlimpseTypes'

const postReducer = (state, action) => {
    switch (action.type) {
        case POST_GLIMPSE_TYPES.POST_GLIMPSE_CREATE:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    feedPostsGlimpses: {
                        ...state.postGlimpse.feedPostsGlimpses,
                        data: [action.payload._id, ...state.postGlimpse.feedPostsGlimpses.data,]
                    },
                    profilePosts: {
                        ...state.postGlimpse.profilePosts,
                        [action.payload.user._id]: [!Boolean(action.payload.glimpse) && action.payload._id, Boolean(state.postGlimpse.profilePosts[action.payload.user._id]) && [...state.postGlimpse.profilePosts[action.payload.user._id]] ]
                    },
                    profileGlimpses: {
                        ...state.postGlimpse.profileGlimpses,
                        [action.payload.user._id]: [Boolean(action.payload.glimpse) && action.payload._id, Boolean(state.postGlimpse.profilePosts[action.payload.user._id]) && [...state.postGlimpse.profilePosts[action.payload.user._id]] ]
                    },
                    detailedPostsGlimpses: { ...state.postGlimpse.detailedPostsGlimpses, [action.payload._id]: action.payload }
                }
            };
        case POST_GLIMPSE_TYPES.POST_GLIMPSE_UPDATE:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    savePostsGlimpses: {
                        ...state.postGlimpse.savePostsGlimpses,
                        data: action.payload.saves.includes(state.auth.user._id) ? [ action.payload._id,...state.postGlimpse.savePostsGlimpses.data] : state.postGlimpse.savePostsGlimpses.data.filter(id => id !== action.payload._id),
                        result: action.payload.saves.includes(state.auth.user._id) ? state.postGlimpse.savePostsGlimpses + 1 : state.postGlimpse.savePostsGlimpses - 1,
                    },
                    detailedPostsGlimpses: { ...state.postGlimpse.detailedPostsGlimpses, [action.payload._id]: action.payload },
                }
            }
        case POST_GLIMPSE_TYPES.POST_GLIMPSE_DELETE:
            const { [action.payload._id]: deletedPost, ...remainingdetailedPostsGlimpses } = state.postGlimpse.detailedPostsGlimpses;
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    feedPostsGlimpses: {
                        ...state.postGlimpse.feedPostsGlimpses,
                        data: state.postGlimpse.feedPostsGlimpses.data.filter(id => id !== action.payload._id)
                    },
                    explorePosts: {
                        ...state.postGlimpse.explorePosts,
                        data: state.postGlimpse.explorePosts.data.filter(id => id !== action.payload._id)
                    },
                    savePostsGlimpses: {
                        ...state.postGlimpse.savePostsGlimpses,
                        data: state.postGlimpse.savePostsGlimpses.data.filter(id => id == action.payload._id)
                    },
                    detailedPostsGlimpses: remainingdetailedPostsGlimpses
                }
            };

        case POST_GLIMPSE_TYPES.FEED_POST_GLIMPSE_LOADING:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    feedPostsGlimpses: {
                        ...state.postGlimpse.feedPostsGlimpses,
                        loading: action.payload
                    }
                }
            };
        case POST_GLIMPSE_TYPES.FEED_POST_GLIMPSE_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    feedPostsGlimpses: {
                        ...state.postGlimpse.feedPostsGlimpses,
                        data: action.payload.postsGlimpses.map((post) => post._id),
                        result: action.payload.result,
                        page: action.payload.page,
                        firstLoad: true
                    },
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        ...action.payload.postsGlimpses.reduce((acc, post) => {
                            acc[post._id] = post;
                            return acc;
                        }, {})
                    }
                }
            };

        case POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_LOADING:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    savePostsGlimpses: {
                        ...state.postGlimpse.savePostsGlimpses,
                        loading: action.payload
                    }
                }
            };
        case POST_GLIMPSE_TYPES.SAVE_POST_GLIMPSE_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    savePostsGlimpses: {
                        ...state.postGlimpse.savePostsGlimpses,
                        data: action.payload.savePostsGlimpses.map((post) => post._id),
                        result: action.payload.result,
                        page: action.payload.page,
                        firstLoad: true
                    },
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        ...action.payload.savePostsGlimpses.reduce((acc, post) => {
                            acc[post._id] = post;
                            return acc;
                        }, {})
                    }
                }
            };

        case POST_GLIMPSE_TYPES.EXPLORE_POST_LOADING:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    explorePosts: {
                        ...state.postGlimpse.explorePosts,
                        loading: action.payload
                    }
                }
            };
        case POST_GLIMPSE_TYPES.EXPLORE_POST_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    explorePosts: {
                        ...state.postGlimpse.explorePosts,
                        data: action.payload.posts.map((post) => post._id),
                        result: action.payload.result,
                        page: action.payload.page,
                        firstLoad: true

                    },
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        ...action.payload.posts.reduce((acc, post) => {
                            acc[post._id] = post;
                            return acc;
                        }, {})
                    }
                }
            };
        case POST_GLIMPSE_TYPES.EXPLORE_GLIMPSE_LOADING:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    exploreGlimpses: {
                        ...state.postGlimpse.exploreGlimpses,
                        loading: action.payload
                    }
                }
            };
        case POST_GLIMPSE_TYPES.EXPLORE_GLIMPSE_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    exploreGlimpses: {
                        ...state.postGlimpse.exploreGlimpses,
                        data: action.payload.glimpses.map((glimpse) => glimpse._id),
                        result: action.payload.result,
                        page: action.payload.page,
                        firstLoad: true

                    },
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        ...action.payload.glimpses.reduce((acc, glimpse) => {
                            acc[glimpse._id] = glimpse;
                            return acc;
                        }, {})
                    }
                }
            };

        case POST_GLIMPSE_TYPES.PROFILE_POST_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    profilePosts: [
                        ...state.postGlimpse.profilePosts,
                        { ...action.payload, posts: action.payload.posts.map((post) => post._id), result:action.payload.result }
                    ],
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        ...action.payload.posts?.reduce((acc, post) => {
                            acc[post._id] = post;
                            return acc;
                        }, {})
                    }
                }
            };
        case POST_GLIMPSE_TYPES.PROFILE_GLIMPSE_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    profileGlimpses: [
                        ...state.postGlimpse.profileGlimpses,
                        { ...action.payload, glimpses: action.payload.glimpses.map((glimpse) => glimpse._id), result:action.payload.result }
                    ],
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        ...action.payload.glimpses?.reduce((acc, glimpse) => {
                            acc[glimpse._id] = glimpse;
                            return acc;
                        }, {})
                    }
                }
            };
        // case POST_GLIMPSE_TYPES.PROFILE_POST_GLIMPSE_UPDATE:
        //     return {
        //         ...state,
        //         postGlimpse: {
        //             ...state.postGlimpse,
        //             profilePosts: [
        //                 ...state.postGlimpse.profilePosts.filter(profilePost=> profilePost._id == action.payload._id),
        //                 action.payload
        //             ]
        //         }
        //     };

        case POST_GLIMPSE_TYPES.DETAILED_POST_GLIMPSE_GET:
            return {
                ...state,
                postGlimpse: {
                    ...state.postGlimpse,
                    detailedPostsGlimpses: {
                        ...state.postGlimpse.detailedPostsGlimpses,
                        [action.payload._id]: action.payload
                    }
                }
            };

        default:
            return state;
    }
}

export default postReducer