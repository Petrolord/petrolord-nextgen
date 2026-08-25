# Expulsion is monotone

One line of engine code carried the whole previous lesson: expelled mass is the running maximum of generated-minus-cap. This lesson dwells on that line, because monotone state is a design pattern you will meet in every serious basin model, and because knowing what is and is not monotone tells you instantly which history features can leave permanent records.

## The rule

$$M_{exp}(t) = \max\left( M_{exp}(t-1),\; M_{gen}(t) - C(t) \right)$$

Each step, the engine compares the current generation-over-cap excess with everything already expelled, and keeps the larger. Expulsion advances when the excess makes a new high, and holds otherwise. The physical claim is a one-way valve: hydrocarbons that left the source do not re-enter it when conditions relax, whether the relaxation is a regrown cap, as at the rebound, or stalled generation.

## The model's three memories

Line up the state variables of the whole pipeline by their memory behaviour, because the pattern is the tier in miniature. Temperature: no memory, a pure function of the present column, forgets in megayears, module 3's forgetful thermometer. The kinetic states and Ro: monotone, drain-only, remember the thermal maximum forever, the ratchet. Expelled mass: monotone, remembers the historical maximum of a derived quantity, the excess, which depends on geometry as well as kinetics.

That third one is subtler than the second, and the squeeze showed why. Ro's maximum is a maximum of temperature integrated; expulsion's is a maximum of generation minus cap, and the cap moves with geometry. So expulsion can record events that maturity barely notices, a late cap squeeze over a stalled source being exactly the fixture's case, and maturity can record events expulsion misses, an early thermal pulse before generation, the two monotone memories keeping different diaries of the same history.

## Reading the diaries together

This gives the interpretation habit for real basins with complicated histories: ask, for each monotone state, when its maximum was set. In the fixture: Ro's effective maximum-setting era is the hot decade, 18 to 11 Ma, module 3. Expulsion's was 11 Ma exactly, the last squeezed step. Temperature's "record" is just the present. Three dates, three instruments. A basin study that reports only present-day values has collapsed three diaries into one line and lost the plot, literally: the plot against time is the deliverable.

The engine's output format respects this, carrying full series for every quantity, and the panel draws them; the capstone grades endpoints because endpoints are gradable, but every endpoint in it is the closing entry of a diary you can now read whole.

## What the valve ignores

Honesty about the simplification: real primary migration has richer physics. Expelled fluids fractionate, oil and gas leaving differently; retention depends on kerogen adsorption as well as pore saturation; and severe unroofing can fracture a source and release stored hydrocarbon in ways no saturation cap describes. The one-way valve with a geometric cap is the version-one statement, adequate for the fixture's clean stratigraphy, and the recorded follow-ons live where the engine's specification lists its limitations. The reading habit survives every refinement: whatever the retention physics, expulsion stays monotone, and its diary stays readable.

## Worked example

A basin's expulsion series shows two rises separated by a long flat: a rise to 60 Ma, flat to 15 Ma, a second rise to present. Interpret. Two eras made new highs in generated-minus-cap: the first is ordinary kitchen operation; the flat means the excess never exceeded its old record, generation stalled or cap steady; the second rise means the record broke again late, either renewed generation from fresh burial or, as in the fixture's event, a cap squeeze. Distinguishing which requires the generation and cap series separately, which is why the panel draws all three curves rather than expulsion alone.

## Exercise

Write the monotone rule as a formula. Then answer in one sentence each: why can expulsion record an event that maturity barely registers, and what should you ask of any monotone state variable when reading a basin's history?

As a self check: $M_{exp}(t) = \max(M_{exp}(t-1), M_{gen}(t) - C(t))$. Expulsion can out-record maturity because its recorded quantity includes the geometric cap, so a mechanical squeeze moves it even when the kinetics are stalled, as the fixture's event proved at three-fifths squeeze. The question for every monotone state: when was its maximum set, because that date, not the present value alone, is what the variable actually remembers.
