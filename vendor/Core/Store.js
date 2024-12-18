const AmDifferedState = (state = 0, action) => action;

const AmDiffered = createStore(AmDifferedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({trace:true}));

export default AmDiffered;