# Depth units

Every number in a well log hangs off the depth column, and the depth column arrives in whichever unit the acquisition contractor used. Metres dominate most of the world and most modern logging; feet dominate North American practice and older vintages everywhere. A data manager never gets to choose what arrives. What you do choose, once and for the whole platform, is the internal standard, and here that standard is metres. Everything downstream of import, from petrophysics to mapping to well ties, assumes depth in metres and never asks again.

## Where the unit is declared

A LAS file states the depth unit in two places, and they should agree. The ~Curve section declares a unit for every curve, the depth curve included: in the teaching set you will see `DEPT.M` in the metric files and `DEPT.F` in the feet file. The ~Well section repeats the unit on the STRT, STOP and STEP entries, so a header reader can know the depth range without touching the data section. In basic_20 the header reads STRT 1500 M, STOP 1650 M, STEP 0.5 M; in feet_20 it reads STRT 4900 F, STOP 5200 F, STEP 2 F.

The importer keys its behaviour off the depth curve's unit. It recognises the common spellings, M, METRE, METRES, METER, METERS for metres and F, FT, FEET for feet, and refuses to import a file whose depth unit it does not recognise. Refusal is deliberate: a guessed depth unit that guesses wrong shifts every measurement in the well by a factor of about three, and no downstream QC will catch it once the data is in the registry wearing a metres label.

## The conversion constant

The conversion is exact, not approximate. The international foot is defined as

$$1\ \text{ft} = 0.3048\ \text{m}$$

by definition, so converting feet to metres means multiplying by exactly 0.3048. There is no rounding decision to make and no lookup table to maintain. A depth of 5000 ft is 5000 x 0.3048 = 1524 m, exactly.

## Units belong to curves, not just to depth

It is tempting to think of unit conversion as a depth problem, fix the depth column and move on. It is not. Every curve carries its own unit, and some measurement units are themselves depth-referenced. The clearest case in the teaching set is the sonic log. The metric files carry DT in US/M, microseconds per metre. feet_20 carries DT in US/F, microseconds per foot, because a tool logging in feet reports slowness per foot.

Slowness is a per-length quantity, so its conversion runs the other way: to turn microseconds per foot into microseconds per metre you divide by 0.3048, because one metre contains 1/0.3048 = 3.2808 feet of travel. A slowness of 100 US/F is 100 / 0.3048 = 328.1 US/M. Multiplying by 0.3048 here, the natural reflex from converting depths, would be wrong by a factor of about ten near typical rock values, and the error would sail through any casual inspection because the numbers still look like plausible slownesses in some unit or other.

This is why the import pipeline converts feet_20 twice over: the depth column (F to M) and the sonic curve (US/F to US/M). Two curves converted, and the QC panel says so. The gamma ray, density and neutron curves in the same file need no conversion, because GAPI, G/C3 and V/V do not reference length.

## Conversions are never silent

The last principle of this lesson is a platform rule you will meet again in the professional tier: a conversion either happens visibly or does not happen at all. When the importer converts a curve it records the source unit and the factor alongside the data, so anyone auditing the well later can see that this DT started life in US/F. When it meets a unit it does not recognise, it passes the curve through unchanged and marks it unconverted, so the import screen can ask a human instead of guessing. Silent unit handling is how a feet well ends up booked as a metres well, and that class of error is far cheaper to prevent at import than to hunt down after it has contaminated an interpretation.

## Exercise

Convert the following by hand and check yourself. First, a depth of 4950 ft to metres: 4950 x 0.3048 = 1508.76 m. Second, a logging step of 0.5 ft to metres: 0.5 x 0.3048 = 0.1524 m. Third, a sonic reading of 120 US/F to US/M: 120 / 0.3048 = 393.7 US/M. Finally, state in one sentence why the sonic conversion divides by 0.3048 while the depth conversion multiplies by it.
