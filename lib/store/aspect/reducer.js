import uuidv4 from 'uuid/v4';

import Actions from './actions';

const getInitialState = () => {
  return {
    aspectsById: {
      root: {
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
      let parentId = action.parentId || 'root';
      let parent = {
        ...state.aspectsById[parentId],
        aspects: [...state.aspectsById[parentId].aspects, id],
      };
      return {
        aspectsById: {
          ...state.aspectsById,
          [id]: {id, aspects: [], ...action.aspect},
          [parentId]: parent,
        },
      };
    }
    case Actions.DELETE_ASPECT: {
      let {[action.id]: deleted, ...aspectsById} = state.aspectsById;
      let parent = {
        ...aspectsById[action.parentId],
        aspects: aspectsById[action.parentId].aspects.filter((id) => id !== action.id),
      };
      return {
        aspectsById: {
          ...aspectsById,
          [action.parentId]: parent,
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
