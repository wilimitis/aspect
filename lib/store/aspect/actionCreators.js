import Actions from './actions';

export const addAspect = (aspect, parentId) => ({type: Actions.ADD_ASPECT, aspect, parentId});
export const deleteAspect = (id, parentId) => ({type: Actions.DELETE_ASPECT, id, parentId});
export const updateAspect = (id, props) => ({type: Actions.UPDATE_ASPECT, id, props});
