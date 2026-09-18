# The capstone worked

The graded exercise for this tier is a change register with its actions, read on one as-of date and marked on the figures you produce. This lesson does not work its records, which you meet only in the exercise. It works the habits that carry it, each one a rule this tier has taught. The traps it is built on are both windows counted on calendar dates, and actions on a finished change.

## Write the as-of date down first

Every expiry state, ratification state and overdue flag in a change register is true on one date. Write that date at the top of your working and quote every count with it. The engines default to the machine clock when no date is handed in, so the stated date is what makes your answer checkable.

## Place each change in its lists

For each change, write its type and its stage, then mark whether the stage is active, in effect or terminal. Most later answers follow from that mark:

- a change not in effect cannot expire, whatever its date says;
- a change in effect cannot read overdue against its target date;
- a finished change's actions are not open work.

## Count the expiry lead inclusively

For a change in effect with a readable expiry, count whole calendar days from the as-of date to the expiry. Below zero is "Expired"; zero up to and including EXPIRY_LEAD_DAYS, 14 days, is "Expiring soon"; beyond it is "Within expiry". Then check the states the date does not move: "Permanent change", "Closed out" and "No expiry".

## Count ratification from the actual implementation date

For an Emergency change, add EMERGENCY_RATIFY_DAYS, 7 days, to the date it actually went in. That is the due date. A due date on or after the as-of date is "Awaiting ratification"; before it, "Ratification overdue". Every level signed is "Ratified". No implementation date recorded is "Ratification overdue" with no due date, because the window cannot be shown open. Any other type reads "Not required".

{{panel:rc-change-explorer}}

## Read actions with their changes

Before you count open actions, put the action log beside the change register. Skip actions that are "Complete" or "Cancelled". Skip actions whose change is finished and locked, in the Closed stage or "Cancelled". Keep actions whose change is not in the register at all; an unknown parent is no reason to hide the work. Then, for overdue actions, compare each remaining action's due date with the as-of date.

## Read the gates as refusals

If a question asks whether a change can move, answer with the engine's sentence and name the condition that fails. Name the person rules too: the originator never approves, and only the assignee decides.

## Quote the words exactly, and never supply a missing figure

Quote every state as the engine spells it. Where the engine answers null or refuses, that is the answer, and writing a plausible figure into the gap turns a correct reading into a wrong one.

## Exercise

Before you open the graded register, write out in your own words the checks above in the order you will apply them. For each, name the constant or the list it depends on, and the one row of the ESANMI register that shows it at work on 2026-10-01.
