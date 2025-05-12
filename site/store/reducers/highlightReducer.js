import HIGHLIGHT_TYPES from '../types/highlightTypes'

const storyReducer = (state, action) => {
    switch (action.type) {

        case HIGHLIGHT_TYPES.HIGHLIGHT_CREATE:
            return {
                ...state,
                highlight: {
                    ...state.highlight,
                
                }
            };
        case HIGHLIGHT_TYPES.HIGHLIGHT_UPDATE:
            return {
                ...state,
                highlight: {
                    ...state.highlight,
                }
            };
        case HIGHLIGHT_TYPES.HIGHLIGHT_DELETE:
            return {
                ...state,
                highlight: {
                    ...state.highlight,
                }
            };
        case HIGHLIGHT_TYPES.PROFILE_HIGHLIGHT_GET:
            let allStories = []
            for (let i=0;i<action.payload.highlights.length; i++){
                let highlight = action.payload.highlights[i];
                for (let j=0;j<highlight.stories.length; j++){
                    allStories.push(highlight.stories[j])
            }
            }
            return {
                ...state,
                highlight: {
                    ...state.highlight,
                    profileHighlights: [
                        ...state.highlight.profileHighlights,
                        { ...action.payload, highlights: action.payload.highlights.map((highlight) => highlight._id) }
                    ],
                    detailedHighlights: {
                        ...state.highlight.detailedHighlights,
                        ...action.payload.highlights.reduce((acc, highlight) => {
                            acc[highlight._id] = 
                            {...highlight, stories:highlight.stories.map((s)=>s._id)};
                            return acc;
                        }, {})
                    }
                },
                story:{
                    ...state.story,
                    detailedStories:{
                        ...state.story.detailedStories,
                        ...allStories.reduce((acc, story) => {
                            acc[story._id] = story
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