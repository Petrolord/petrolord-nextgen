# Theoretical rate and uptime

A test rate says what the well does while it is running. An uptime says how much of the day it ran. `computeAllocation` multiplies them, and the second factor is the one it is willing to invent.

{{panel:pd-exception-explorer}}

## The theoretical is a rate scaled by a fraction

The test in force supplies oil, water and gas rates in stb/d, stb/d and Mscf/d. The uptime fraction comes from the well's ledger row for that date, hours on stream over 24. The product is the theoretical volume in stb or Mscf over that date. `useUptime` defaults to true and turning it off leaves the test rate standing as a whole day.

The published golden prices the switch on the same 24 days. With uptime, theoretical oil is 38046.666666667 stb and the grand factor is 1.043350271596, with `factor_out_of_band` raised 6 times. Without it, theoretical oil is 41300.000000000 stb and the grand factor is 0.961162227603, with `factor_out_of_band` raised once. Measured oil is 39696.000000000 stb in both, and so is allocated oil.

## What the fraction does on a real day

On the teaching field OGUTA, which this wave invented and which is neither real nor published, OGUTA-6 on 2024-11-20 records 12.300000000 h on stream, an uptime of 0.512500000. Its test g-o6-1 dated 2024-08-25 reads 509.000000 stb/d oil, so its theoretical oil for that date is 260.862500000 stb. The calendar volume the well actually filed that day is 262.400000000 stb, and its producing-day oil rate is 512.000000000 stb/d, a rate and not a volume.

## The uptime it invents

`computeAllocation` looks up a ledger row per well per date to find the hours. When there is no row at all the lookup returns null, `Number.isFinite(null?.hours_on)` is false, and `defaultHours` of 24 is substituted. A well that filed nothing is credited with a full day on stream.

A derived two-well demonstration separates the two silences. Told that SHARE-B was shut in, with an `hours_on` of 0, the oil factor is 1.000000000000 and SHARE-A is allocated 1000.000000 stb, every barrel it made. Told nothing about SHARE-B, the oil factor is 0.500000000000 and SHARE-A is allocated 500.000000 stb while SHARE-B, which produced nothing, is allocated 500.000000 stb.

## The mistake

Reading a low theoretical as a weak well. It can equally be a short day. Reading a full uptime as a well that ran all day is worse, because 24 h is also what the module writes when it has no information at all.

## What it refuses

Nothing. A row of zeroes with an `hours_on` of 24 and a row with a null `hours_on` both give the same 0.500000000000 factor as the missing row. The only diagnostics raised are three `factor_out_of_band`, which name the symptom and never the cause.

## Exercise

Take OGUTA-6 on 2024-11-20 and write its theoretical oil with the uptime applied and with `useUptime` off.

Then say which of the two a well that files no rows always gets.
