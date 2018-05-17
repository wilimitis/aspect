import uuidv4 from 'uuid/v4';

import Actions from './actions';
import {ROOT_ID} from './constants';

const getInitialState = () => {
  return {
    aspectsById: {
      [ROOT_ID]: {
        id: ROOT_ID,
        aspects: [],
      },
    },
  };
};

export default function(state = getInitialState(), action) {
  console.log(action)
  switch (action.type) {
    case Actions.ADD_ASPECT: {
      let id = uuidv4();
      let {parentId, ...aspect} = action.aspect;
      let parent = {
        ...state.aspectsById[parentId],
        aspects: [...state.aspectsById[parentId].aspects, id],
      };
      return {
        aspectsById: {
          ...state.aspectsById,
          [id]: {id, parentId, aspects: [], ...aspect},
          [parentId]: parent,
        },
      };
    }
    case Actions.DELETE_ASPECT: {
      let {[action.id]: deleted, ...aspectsById} = state.aspectsById;
      let parent = aspectsById[deleted.parentId];
      return {
        aspectsById: {
          ...aspectsById,
          [parent.id]: {
            ...parent,
            aspects: parent.aspects.filter((id) => id !== action.id),
          },
        },
      };
    }
    case Actions.UPDATE_ASPECT: {
      let updatedAspect = {...state.aspectsById[action.id], ...action.props};
      return {
        aspectsById: {
          ...state.aspectsById,
          [action.id]: updatedAspect,
        },
      };
    }
    default:
      return state;
  }
}
