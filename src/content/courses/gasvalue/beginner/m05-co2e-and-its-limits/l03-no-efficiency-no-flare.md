# No efficiency, no flare

A blank GWP leaves the CO2e missing and the rest of the flare in place. A blank destruction efficiency does not. This lesson reads what abatement refuses, each in its own words.

{{panel:gasvalue-flare-explorer}}

## What abatement refuses

Each probe below runs on EGBEMA's gas with the rest of EGBEMA's parcel:

| probe | engine |
| --- | --- |
| destruction efficiency left blank ('') | REFUSED: A flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed. |
| destruction efficiency 1.2 | REFUSED: A flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed. |
| combustion efficiency 0.98 above a destruction efficiency of 0.97 | REFUSED: A flare combustion efficiency must lie in (0, 1] and cannot exceed the destruction efficiency. |
| no volume | REFUSED: A gas volume is required. |
| on-stream days left blank ('') | REFUSED: On-stream days are required, more than 0 and no more than 366. |
| on-stream days 367 | REFUSED: On-stream days are required, more than 0 and no more than 366. |
| a gas the analysis refused | REFUSED: A characterised gas is required. |

## The destruction efficiency

A blank destruction efficiency and a destruction efficiency of 1.2 get the same refusal. The range is stated in it: (0, 1]. The engine gives its reason in the same sentence: for a flare it is most of the answer and it is contested, so it is not assumed.

The efficiencies have no default. A blank is not read as a perfect flare. The engine refuses, and no CO2, methane or CO2e is returned.

## The combustion efficiency

A combustion efficiency of 0.98 above a destruction efficiency of 0.97 is refused: a flare combustion efficiency must lie in (0, 1] and cannot exceed the destruction efficiency.

A combustion efficiency left out is a different case. Module four read it: left out, the destruction efficiency stands in for it, and the engine says so in a note. Typed blank (''), it behaves the same way: 0.97 is used, the CO2 reads 184877.310 tonnes a year and the note is the same.

## Volume, days and gas

A call with no volume is refused: a gas volume is required. A gas the analysis refused is refused again here: a characterised gas is required.

On-stream days left blank are refused, and so are 367 days. The refusal states the range: more than 0 and no more than 366.

## Omitted and blank are different

On-stream days can also be left out of the call entirely. Omitted is not the same as blank. On-stream days omitted from the call, never typed at all, take the stated default, and the engine reports scfPerYear 2625000000. The default itself: routeEconomics, asked with the days omitted, reports onstreamDays 350, and 7.5 MMscfd times a million times 350 is that scfPerYear. Typed blank, they are refused.

Set that beside EGBEMA's flare as typed, 7.5 MMscfd on 355 days, where scfPerYear is 2662500000. The omitted call reports 2625000000 and the typed call 2662500000, and neither is refused. The blank call is refused.

## Reading the refusals in the explorer

The flare explorer starts with every flare input blank, and the engine's refusal shows until each is typed. Load EGBEMA's gas and read the refusal. Type 0.97 as the destruction efficiency and read what changes. Then try a destruction efficiency of 1.2, and a combustion efficiency of 0.98.

## Exercise

Read the refusal table rows for the destruction efficiency left blank and at 1.2, and the note on on-stream days: omitted, scfPerYear 2625000000; typed blank, refused. Say what the two destruction efficiency probes return, what reason the refusal gives, and how an omitted value and a blank value of on-stream days differ.

Self check: both destruction efficiency probes return the same refusal: a flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed. On-stream days omitted from the call take the stated default and give scfPerYear 2625000000. Typed blank, they are refused.
