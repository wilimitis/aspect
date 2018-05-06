export const getAspects = (state, id = 'root') => {
  return state.aspectsById[id].aspects.map((aspectId) => state.aspectsById[aspectId]);
};
