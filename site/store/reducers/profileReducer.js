import { dataTools } from '@/utils/tools';
import PROFILE_TYPES from '../types/profileTypes';

const profileReducer = (state, action) => {
    switch (action.type) {
        case PROFILE_TYPES.PROFILE_LOADING:
            return {
                ...state,
                profiles: {
                    ...state.profiles,
                    loading: action.payload
                }
            };
        case PROFILE_TYPES.PROFILE_GET:
            return {
                ...state,
                profiles: {
                    ...state.profiles,
                    users:  [...state.profiles.users, action.payload.user]
                }
            };
        case PROFILE_TYPES.PROFILE_UPDATE:
            return {
                ...state,
                profiles: {
                    ...state.profiles,
                    users:  dataTools.editData(state.profiles.users, action.payload._id, action.payload)
                }
            };
        default:
            return state;
    }
}

export default profileReducer