# The subsonic outflow coefficient

{{panel:cq-release}}

Below the choking pressure the gas in the hole never reaches the speed of sound, and the ambient air outside still influences the flow. The engine handles this with one factor, the subsonic outflow coefficient psi, taken from the Yellow Book. It multiplies the choked form of the mass rate. In a choked flow psi is one. In a subsonic flow it is less than one, and it falls further the closer ambient is to the upstream pressure.

## Where psi comes from

The engine's basis names it directly: "subsonic psi from YB 2.25". Psi is a function of two things only, the pressure ratio Pa over P0 and the heat capacity ratio. It compares the flow the actual pressure ratio allows with the flow the same gas would give if it were choked. That comparison is why psi reaches exactly one at the critical ratio and stays there for every lower ratio.

## Psi on the AMENAM gas line

The subsonic rows, with the first choked row beside them:

| upstream Pa, stated | Pa over P0 | regime | outflow coefficient psi | upstream density kg/m3 | mass rate kg/s |
| --- | --- | --- | --- | --- | --- |
| 120000 | 0.844375 | SUBSONIC | 0.756455 | 0.771667 | 0.046872 |
| 150000 | 0.675500 | SUBSONIC | 0.958958 | 0.964584 | 0.074275 |
| 180000 | 0.562917 | SUBSONIC | 0.999177 | 1.157501 | 0.092868 |
| 250000 | 0.405300 | CHOKED | 1.000000 | 1.607640 | 0.129090 |

The pattern is clear. At a ratio of 0.844375, where ambient is most of the upstream pressure, psi is 0.756455. At 0.562917, just above the critical 0.543927, psi is 0.999177 and the flow is almost choked. Psi climbs toward one as the ratio falls toward the critical value, and it does so smoothly.

Notice how flat psi becomes near the boundary. The rows at 150000 and 180000 Pa differ in their pressure ratio by a good margin, yet psi moves only from 0.958958 to 0.999177. A subsonic flow close to choking behaves almost like a choked one.

## Close to the boundary on a published case

Two of the golden cases sit right against the critical ratio for air. The subsonic one has a ratio of 0.53328947368421054 against a critical ratio of 0.52828178771717416, and its psi is 0.999944960481. That is subsonic by label and within a whisker of one in value. Its mass rate, 0.112711 kg/s, matches the independent nozzle route to a relative difference of 4.93e-16.

The other subsonic cases in that check are further from the boundary: nitrogen-subsonic at 0.016120 kg/s and co2-high-gamma-low at 0.216885 kg/s, both matching route B to the same precision. The subsonic branch is checked by the same maximisation as the choked branch, so a mistake in psi would show up there.

## What changes for a study

In the subsonic band every input that sets the pressure ratio matters, ambient included. A low pressure vent or a tank blanket release sits here, and its rate depends on the barometric pressure the study assumes. The analyst should state the ambient pressure when a case is subsonic, and the engine uses `ATM_PA`, 101325 Pa, when it is left out.

## Exercise

On the outflow view, run the AMENAM gas line at 120000 Pa and read psi and the mass rate. Then divide the mass rate by psi. Write one sentence on what that quotient represents, and a second on why psi, and with it the mass rate, falls further as the upstream pressure approaches ambient.
