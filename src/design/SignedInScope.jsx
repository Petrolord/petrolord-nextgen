// The one design-system scope for NextGen's signed-in screens
// (docs/scope/DesignSystem-Rollout.md section 5).
//
// Layout (src/components/Layout.jsx) renders this around the header and the
// page column, so every signed-in screen is themed by one provider and the
// theme holds while the learner moves between pages. Pages never wrap
// themselves in <ThemedApp>. During the rollout Layout opens the scope only
// on the routes listed in src/design/rollout/ (isThemedPath); every other
// route renders exactly what it rendered before. At the end state the gate
// goes and the scope is unconditional.
//
// The sidebar rail stays outside it: it keeps its dark frame in both themes
// (the Suite's lead decision 1; see the plan, section 3).
import React from 'react';
import { ThemedApp } from './ThemeProvider.jsx';

export const SIGNED_IN_SCOPE_TEST_ID = 'signed-in-theme-scope';

export function SignedInScope({ className = 'min-h-full', children, ...rest }) {
  return (
    <ThemedApp className={className} data-testid={SIGNED_IN_SCOPE_TEST_ID} {...rest}>
      {children}
    </ThemedApp>
  );
}

export default SignedInScope;
