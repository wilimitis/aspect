import Actions from './actions';

export const addAspect = (aspect) => ({type: Actions.ADD_ASPECT, aspect});
export const deleteAspect = (id) => ({type: Actions.DELETE_ASPECT, id});
export const updateAspect = (id, props) => ({type: Actions.UPDATE_ASPECT, id, props});
