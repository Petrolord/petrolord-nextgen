# Voyage days and vessel-days

{{panel:marine-voyage-calculator}}

Voyages are a count. A fleet is sized in time, so the next step turns the count into the days a vessel spends sailing it. The measure is the vessel-day, and this course gives it one meaning: the voyages a set needs times the days one of its voyages takes, added over the sets. It is a demand on the fleet's time, measured before anyone asks how many vessels will supply it.

## Voyage days come from the voyage plan

A voyage's days are its hours over 24, and its hours are the Associate tier's voyage plan: sailing at the stated speed, port time once a voyage, field time at every stop served, each with the weather factor on the activities the call names. Fleet sizing runs that same arithmetic for every voyage set. The Ekene milk run takes 62.072727 hours with the rainy-season factor of 1.2 on sailing and field time, which is 2.586364 days.

## Vessel-days multiply by the voyages

The Ekene week on the PSV milk run needs 4 voyages after rounding up, so it needs 4 times 2.586364 days, 10.345455 vessel-days (engine). On a milk run there is one voyage set; on a dedicated route each installation is a set and the fleet adds them, which the next lesson works.

| case | voyages | voyage days | vessel-days |
| --- | --- | --- | --- |
| Ekene week, rainy season | 4 | 2.586364 | 10.345455 |
| Ekene week, calm | 4 | 2.238636 | 8.954545 |
| Ekene week, voyages not rounded | 3.100000 | 2.586364 | 8.017727 |

The calm week sails the same four voyages; each takes fewer days, so the week needs fewer vessel-days. Weather reaches the fleet through time alone, exactly as it reached one voyage.

## The word to hold on to

In conversation, "vessel-days" could mean vessels times days on hire. Here it is always voyages times voyage days. The fleet's supply of time is a different figure, the vessels times the days each is available, and module three sets the two side by side. Mixing them up turns a need into a supply, and a comfortable week into a short one.

## What moves the vessel-days

Three things move them: the voyage count, through demand, capacities, minimum visits and the rounding rule; the voyage days, through speed, distances, port and field hours and the weather; and the route, which changes both at once. A figure quoted with none of these beside it cannot be checked.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV milk run".

1. Read the voyage set table: voyages, voyage days and vessel-days. Multiply the first two yourself and confirm 10.345455.
2. Set the control "Weather factor (stated)" to 1. Before you read the result, predict the voyages and the vessel-days from the table above, then confirm them.
3. Restore the factor to 1.2 and change "Weather applies to (stated)" so that it names port time as well. The Associate tier found that one voyage then takes 2.686364 days. Predict the week's vessel-days by hand, then read the panel.
4. Restore the activities and change "Port hours a voyage (stated)" from 12 to 24. Predict whether the voyages move, and work out the new vessel-days before you read them.
