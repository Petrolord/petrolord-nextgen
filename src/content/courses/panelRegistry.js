import React from 'react';

// Registry of interactive teaching panels that lesson markdown can embed
// with a {{panel:<id>}} marker line. Components are lazy so a panel's
// engine code loads only when a lesson that uses it is opened.
//
// Register panels per course as they are extracted from the legacy
// learning pages, e.g.:
//   'petro-vsh-explorer': React.lazy(() => import('@/components/course/panels/petrophysics/VshExplorer')),
export const PANELS = {};

export function resolvePanel(id) {
  return PANELS[id] || null;
}

export function panelIds() {
  return Object.keys(PANELS);
}
