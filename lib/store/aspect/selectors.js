export const getAspects = (state, id) => {
  return state.aspectsById[id].aspects.map((aspectId) => state.aspectsById[aspectId]);
};
