# PVT in a deck

The PROPS section tells the simulator how the fluids behave. That is five keywords carrying five different kinds of statement, and it helps to see them as a set before reading any one of them.

## The five

| keyword | what it describes |
|---|---|
| DENSITY | the three phases' densities at surface conditions |
| PVTO | live oil: how much gas is dissolved, and how the oil swells |
| PVDG | dry gas: how much space it takes at each pressure |
| PVTW | water: nearly incompressible, one line |
| ROCK | how the pore volume itself compresses |

Every one of them is a table or a line of constants. None of them is a correlation. A deck hands the simulator NUMBERS, and the choice of correlation that produced those numbers stays with whoever wrote the deck.

{{panel:sim-deck-explorer}}

Open PROPS and find the five. Notice how much shorter PVTW and ROCK are than the two hydrocarbon tables.

## The Ekene densities

    oil    54.02790214067278 lb/ft3
    water  64.30084          lb/ft3
    gas     0.0572715        lb/ft3

Those follow from three gravities: oil at 32 API, brine at a specific gravity of 1.03, and gas at 0.75 relative to air. They are SURFACE densities, and the simulator combines them with the formation volume factors to get reservoir densities, which is what drives the gravity segregation and the contacts.

## Water and rock

    PVTW: reference pressure 3200 psia, Bw 1.02, cw 3e-6 /psi, viscosity 0.5 cp
    ROCK: reference pressure 3200 psia, cr 4e-6 /psi

Water gets one line because it barely changes: a formation volume factor near one, a small compressibility, a viscosity that is treated as constant. The rock compressibility is the pore volume's own response to pressure, and at 4e-6 per psi it is small and it is not negligible, which the Material Balance course made a whole module of.

Both are quoted at a reference pressure of 3200 psia, which is Ekene's initial pressure. A compressibility without a reference pressure is meaningless, because it describes a change FROM somewhere.

## Why oil needs a table and water does not

Because oil carries dissolved gas and water effectively does not. Below the bubble point, gas comes out of solution as pressure falls, the oil shrinks, its viscosity rises, and both effects are strong and nonlinear. No single compressibility describes that, so the oil gets a table with a row per pressure.

Above the bubble point no more gas can come out, the oil behaves like a slightly compressible liquid, and a straight line is enough. That is why PVTO has two parts, which the next lesson takes up.

## The units to watch

Gas volumes in this deck are in thousands of standard cubic feet. So a solution gas ratio appears as 0.4 rather than 400, and a gas formation volume factor is in reservoir barrels per Mscf.

That single factor of a thousand is the most common PVT error in a deck. It does not produce a parse failure and it does not produce an absurd-looking table. It produces a reservoir that behaves as though its oil carried a thousandth of the gas it actually carries.

## The misconception to avoid

"The PVT section describes the fluid." It describes the fluid AS SAMPLED AND AS CORRELATED, which is a chain with several links: a sample was taken somewhere at some time, it was analysed, and somebody fitted or correlated it into a table. Two decks on the same field can carry different PVT and both be defensible. The Professional tier makes that concrete.

## Exercise

First, the deck's solution gas at the bubble point is written as 0.4. State what that is in scf/stb and explain which unit convention makes the two the same statement.

Second, both PVTW and ROCK quote a reference pressure of 3200 psia. Explain in one sentence why a compressibility needs one.
