# The Abua schedule end to end

Lesson 1 read ABUA's plan. This lesson reads the schedule the plan cascades into, from period start 2027-03-01, as a planner would check it before handing it to anyone: how many events, which kinds, when the crude comes, whether the totals agree, and whether the dates can be trusted.

{{panel:refinery-plan-explorer}}

## The count

SECTION 17 carries three schedule readings: schedule events 41, crude receipts 6, first receipt date 2027-03-01. SECTION 15 breaks the count down: crude receipts 6, unit runs 15, product lifts 20, weeks in the period 5.

Every count has a reason you can name. The receipts are the crude cargoes: one for Bonny Light, three for Forcados and two for Brass River at a cargo size of 400000.00 bbl. The runs are five weekly runs for each of the three units. The lifts are five weekly lifts for each of the four products that sell. Naphtha export and Gasoil export sell 0.00 bbl in the plan and have no lifts.

A count that does not match those reasons is the first sign of a schedule built from some other plan or cargo size.

## The crude

Every crude's first cargo arrives on 2027-03-01, the first receipt date SECTION 17 prints. Forcados follows on 2027-03-11 and 2027-03-21, and Brass River on 2027-03-16. Each receipt carries its share of the crude's volume and cost: Forcados 366666.67 bbl and 28453333.33 a cargo, Brass River 300000.00 bbl and 24120000.00, Bonny Light its whole 329032.26 bbl and 26750322.58.

## The units and the lifts

Units run in equal weekly events dated 2027-03-01, 2027-03-08, 2027-03-15, 2027-03-22 and 2027-03-29. Products lift in equal weekly events dated 2027-03-07, 2027-03-14, 2027-03-21, 2027-03-28 and 2027-03-31. The cdu runs 405806.45 bbl a week, the reformer 81535.48 and the dht 130000.00.

## The totals

The digest sets the schedule's totals beside the plan's for all ten materials, and every row agrees in quantity and in value. The cdu totals 2029032.26 bbl and 2536290.32 in both. Diesel totals 630500.00 bbl and 66076400.00 in both. The schedule is the plan in dated pieces, adding and losing nothing.

## The dates

The schedule was built with the period start passed as the string "2027-03-01". SECTION 16 shows that string producing the same 41 dates in all seven zones it tried, first date 2027-03-01 and last date 2027-03-31 in every one. The same period start passed as a Date at local midnight moves the whole schedule to 2027-02-28 in Africa/Lagos and Pacific/Kiritimati. So confirm the period start was passed as a string, and that the first date is the period start.

## What the schedule is

The engine's own note says it: "this is the shape of the month to read actuals against, not a berth-level schedule." Tanks, jetties and turnarounds are not in it. What is in it is the plan, spread across March 2027 in the dates each piece would fall on if the month ran evenly.

That is the object the next tier works on. When the month has run, its actual receipts, runs and lifts are set beside this shape.

## Exercise

Read schedule events 41, crude receipts 6, unit runs 15 and product lifts 20, with weeks in the period 5 and the cargo size of 400000.00 bbl. Explain each count from the plan: which crudes, units and products it comes from, and why two of ABUA's six products contribute no lifts. Then say what the first receipt date, 2027-03-01, confirms about how the schedule was built.
