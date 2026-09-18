# Thermal and movement, in each direction

{{panel:fc-venting-explorer}}

A fixed-roof tank breathes for two reasons and in two directions. It breathes because the vapour space heats and cools, and it breathes because liquid going in displaces vapour and liquid coming out has to be replaced by air. The two add in each direction, and the engine returns all four terms.

## The four terms on this tank

At a fill rate of 2480.0000 bbl/hr and a draw rate of 640.0000 bbl/hr, the engine returns:

| term | scfh |
| --- | --- |
| thermal inbreathing | 19608.4845 |
| thermal outbreathing, low volatility | 11765.0907 |
| thermal outbreathing, high volatility | 19608.4845 |
| movement outbreathing | 13924.1667 |
| movement inbreathing | 3593.3333 |
| total outbreathing | 25689.2574 |
| total inbreathing | 23201.8178 |

Thermal inbreathing on this tank is 19608.4845 scfh, computed from the nominal capacity at a stated rate of 1.000000 scfh of air per barrel of capacity and a latitude factor of 1.000000. Thermal outbreathing depends on the product: for a low volatility product the engine returns 11765.0907 scfh and for a high volatility one it returns 19608.4845 scfh.

Movement outbreathing is set by the fill rate, because liquid entering pushes vapour out. Movement inbreathing is set by the draw rate, because liquid leaving pulls air in. On this tank they are 13924.1667 scfh and 3593.3333 scfh.

## Two mechanisms with different clocks

It helps to keep the two mechanisms apart in your head, because they are driven by different things and they fail differently. The thermal terms are weather. They follow the day, the season and the colour of the roof, and nothing anybody does in the control room changes them. The movement terms are operations. They follow the pump that is running and the valve that is open, and they can change in a minute.

That is also why the movement terms are the inputs worth sweeping. A fill rate and a draw rate are decisions, and a vent that is adequate at today's rates can be inadequate after a pump upgrade nobody routed past the tank engineer.

## Volatility doubles one of the four

The digest computes the effect of volatility on the movement outbreathing directly:

| RELATION: movement outbreathing at the same fill rate, high volatility against low | value |
| --- | --- |
| high volatility, scfh | 27848.3333 |
| low volatility, scfh | 13924.1667 |
| difference (first less second) | 13924.1667 |
| ratio (first over second) | 2.000000 |

A ratio of 2.000000, quoted from that relation line. The physical reason is in the term itself. On a high volatility product the incoming liquid also evaporates, so the vapour space has to expel the displaced volume and the new vapour together.

## Why you add in each direction before comparing

The useful quantity is never a single term. It is the total in each direction, because a vent has to pass whatever is happening at the same moment. Thermal and movement can both be inward at once on a cold morning while the tank is being drawn down, and it is that sum the vent is sized against.

On this tank the total outbreathing is 25689.2574 scfh and the total inbreathing is 23201.8178 scfh. Which of those governs is a separate question the engine answers in one word, and the next lesson is about how it decides.

## Exercise

Read the venting block in digest SECTION 27 and say which of the four component terms would change if the fill rate rose while everything else stayed as stated. Then say which total that term belongs to.
