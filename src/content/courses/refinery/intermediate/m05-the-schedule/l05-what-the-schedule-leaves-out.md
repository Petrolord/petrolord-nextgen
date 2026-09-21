# What the schedule leaves out

A schedule built by spreading a plan evenly across a month is useful and limited, and the engine says so in its own words. This lesson reads the engine's note on ABUA's schedule, cascaded from period start 2027-03-01, and what it means for the way a schedule is used.

{{panel:refinery-plan-explorer}}

## The engine's note

Every schedule the engine cascades carries a note. For ABUA it reads:

"Crude arrives in evenly spaced cargoes and units and lifts are spread evenly across the period. Tank capacity, jetty windows and turnarounds are not modelled: this is the shape of the month to read actuals against. Berth-level scheduling needs those constraints and a scheduling tool."

Those are the engine's words, quoted as the engine's words. Read them phrase by phrase.

## What is not modelled

**Tank capacity.** The schedule does not check whether the crude that arrives has somewhere to go. On 2027-03-01 it receives Bonny Light, Forcados and Brass River together, rcpt-1, rcpt-2 and rcpt-5, and no event in the schedule asks whether ABUA's crude tanks can hold them.

**Jetty windows.** The schedule does not ask whether a jetty is free. Three crude cargoes dated 2027-03-01 would need to be berthed, and the lifts dated 2027-03-07 need a jetty too. Nothing in the schedule reads a berth.

**Turnarounds.** The schedule spreads each unit's month evenly across its five weekly runs. A turnaround is entered in the plan instead, as Module 1 taught: a unit typed as shut, capacity 0, runs nothing, and the plan and its schedule are built around it.

## What it is for

The clause after the note's colon says what the schedule is: the shape of the month to read actuals against. The shape is the plan's volumes and values spread over the dates they would fall on if the month ran evenly. When the month is over, what actually arrived, ran and lifted is set beside that shape, and every gap can be read for what it did to margin. That reading is the Expert tier's.

The note's last sentence names what a berth-level schedule needs: those constraints and a scheduling tool. It is a different product. It belongs to the terminal and the shipping desk, and it answers questions about tanks, jetties and ships that this engine does not ask. The `supply` course takes up terminals and depots.

## No plan, no shape

When the plan has no answer, there is nothing to spread. An infeasible plan cascades to 0 events, with the note "No optimal plan to cascade." A schedule of 0 events is the engine's way of saying there is no month to read actuals against until the plan is fixed.

## Exercise

Read the three receipts dated 2027-03-01, rcpt-1, rcpt-2 and rcpt-5, for Bonny Light, Forcados and Brass River. Then read the engine's note. Say which of the things the note names as not modelled would have to be checked before those three cargoes could really arrive together, and what the schedule is still good for if nobody checks them.
