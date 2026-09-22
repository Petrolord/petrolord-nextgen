import React, { createContext, useContext } from 'react';
import { TYPEWELL } from './typewellLab';

// The well every petrophysics panel runs on. Lesson embeds have no provider
// and run on the bundled typewell; the learning page provides the well the
// learner picked (the typewell, or a LAS file they opened, such as a capstone
// case well, with the zones its brief states).
const WellContext = createContext(TYPEWELL);

export const WellProvider = ({ well, children }) => (
  <WellContext.Provider value={well || TYPEWELL}>{children}</WellContext.Provider>
);

export const useWell = () => useContext(WellContext);
