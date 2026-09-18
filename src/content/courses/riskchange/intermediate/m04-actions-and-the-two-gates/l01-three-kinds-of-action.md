# Three kinds of action

A change is more than its approvals. It carries a list of actions: the work that must be done around putting it onto the facility. This module reads those actions and the two gates they block.

## Three types

The engine knows three action types:

- "Pre-implementation": work done before the change goes in.
- "Implementation": work done as part of putting it in.
- "Post-implementation": work done after it is in, such as the checks that it is working as intended.

The type decides which gate an unfinished action blocks. Pre-implementation actions block the gate into "Implementation". Implementation and Post-implementation actions block the gate into the Closed stage. Lessons two and three read each gate.

## Why the type matters

The three types line up with the life of a change. Before it goes in, the pre-implementation work proves the plant is ready: the procedure is written, the people are briefed, the parts are on site. While it goes in, the implementation work is the change itself. After it is in, the post-implementation work confirms it and tidies up. The engine does not read the words on an action; it reads the type, and the type is what places the action at one gate or the other. An action filed under the wrong type is checked at the wrong door, so the type deserves the same care as the due date.

## Four statuses, two of them finished

An action has one of four statuses: "Open", "In progress", "Complete" and "Cancelled". The engine splits them in two:

| status | finished |
| --- | --- |
| "Open" | no |
| "In progress" | no |
| "Complete" | yes |
| "Cancelled" | yes |

"Cancelled" counts as finished. An action that was decided to be unnecessary is no longer work anyone owes, so it blocks nothing. "In progress" counts as unfinished. Work that has started has not ended, and the gates treat it exactly as they treat "Open".

## Actions in a real register

The ESANMI register carries nine actions. Four of them show the types and statuses side by side:

| action | change | type | status | due |
| --- | --- | --- | --- | --- |
| AC-01 | ES-01 | "Pre-implementation" | "Open" | 2026-09-28 |
| AC-03 | ES-02 | "Post-implementation" | "In progress" | 2026-10-10 |
| AC-04 | ES-04 | "Implementation" | "Complete" | 2026-09-26 |
| AC-08 | ES-03 | "Post-implementation" | "Cancelled" | 2026-09-20 |

AC-01 is unfinished and of the type that blocks the gate into "Implementation". AC-03 is unfinished and of a type that blocks the gate into the Closed stage. AC-04 and AC-08 are finished and block nothing.

Every action also carries a due date. That date feeds a separate question, whether an action is overdue, which is read on the as-of date, 2026-10-01, and which lesson five of this module reads.

{{panel:rc-change-explorer}}

## Exercise

For AC-01, AC-03, AC-04 and AC-08, record each action's type and status, whether the engine counts it as finished, and which gate, if any, it blocks. Say which rule from this lesson produced each answer.
