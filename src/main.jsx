import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import './index.css';
// Design-system roles; every rule is scoped under [data-pl-theme], so it is
// inert on screens that have not opted in (docs/scope/DesignSystem-Rollout.md).
import './design/theme.css';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppWrapper />,
);