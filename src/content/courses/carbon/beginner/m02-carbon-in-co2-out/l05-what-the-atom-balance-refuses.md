# What the atom balance refuses

{{panel:carbon-inventory-explorer}}

## Five calls the engine will not compute

combustionCo2FromCarbon computes only when its inputs make sense as a count of carbon. Each row below is one call to the engine, made on the flare, and each one is refused:

| the call | the engine says |
| --- | --- |
| flare, destruction efficiency 0 | REFUSED: The destruction efficiency must lie in (0, 1]. |
| flare, destruction efficiency 98 (a percentage typed) | REFUSED: The destruction efficiency must lie in (0, 1]. |
| flare, fuel blank | REFUSED: A fuel quantity and the carbon per kilomole of fuel are required. |
| flare, carbon per kmol left out | REFUSED: A fuel quantity and the carbon per kilomole of fuel are required. |
| flare, fuel -1 kmol | REFUSED: A fuel quantity and a carbon content cannot be negative. |

## A fraction between 0 and 1

The first two rows share a refusal. The destruction efficiency must lie in (0, 1]. The round bracket leaves 0 out and the square bracket lets 1 in. A destruction efficiency of 1 is complete combustion, and it is allowed. A destruction efficiency of 0 is refused.

The second row is the one to remember. A destruction efficiency typed as 98, a percentage, is refused with the same sentence. The engine reads the efficiency as a fraction, and it will not quietly divide a percentage by one hundred for you. The flare the course studies has a stated efficiency of 0.98, and it has to be typed as 0.98.

## Two quantities, both required

The next two rows refuse a missing quantity. A blank fuel is refused, and a carbon per kilomole left out of the call is refused, with the same sentence: "A fuel quantity and the carbon per kilomole of fuel are required." Unlike the destruction efficiency, neither of these has a default.

## Nothing negative

The last row types a fuel of -1 kmol, and the engine refuses it: "A fuel quantity and a carbon content cannot be negative." The sentence names both inputs the call needs, the fuel quantity and the carbon content.

## What the atom balance does not attempt

A refusal is the engine saying no to an input. There is also a gas the atom balance never computes, however complete its inputs are. Its result carries these keys and no other gas: co2Tonnes, ch4Tonnes. Nitrous oxide from combustion is not computed by the atom balance, and the course says what it needs: an emission factor line. The course holds this as a stated limit of the engine and grades nothing on it.

In practice, a combustion inventory often carries a nitrous oxide term, and here it would enter as its own factor line with its own source.

Try the refusals in the panel. Type 98 for the flare's destruction efficiency, then 0, then clear the fuel, and read what the engine says each time.

## Exercise

Read the rows for a destruction efficiency of 0 and of 98. Say what the relationship between those two refusals and the flare's stated efficiency of 0.98 shows about the form the engine needs the efficiency in.

Self check: 0 and 98 are both refused with the sentence "The destruction efficiency must lie in (0, 1]." A value of 0 falls outside the interval, and 98 is a percentage typed where a fraction belongs. The flare's stated efficiency must go in as the fraction 0.98, inside the interval.
