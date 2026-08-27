# Why material balance

The decline course left the Ekene field holding a number: cumulative production. By 2023-01-01 the field had delivered 261475.039999678 stb of oil. That number is a fact about the past, and decline analysis extrapolates it forward into an EUR. This course asks the other question, the one that cumulative makes possible for the first time: how much oil was in the tank to begin with, and what is pushing it out?

Material balance answers both, and it answers them with bookkeeping rather than geometry.

## The one idea

A reservoir at initial pressure is a closed container full of compressed fluid inside compressed rock. Take a barrel of oil out at the surface and you have vacated some volume down there. Nature does not tolerate a void, so something must move in to fill it. In an undersaturated tank with no aquifer there is only one candidate: everything still in the container expands, because the pressure has dropped.

That is the whole of material balance. Written as an accounting identity:

$$\text{what was withdrawn} = \text{what expanded}$$

Both sides are measured in reservoir barrels, the volume the fluids actually occupy at reservoir conditions, not the shrunken volume they occupy in a stock tank. The left side is called the underground withdrawal, $F$. The right side is the original oil in place, $N$, multiplied by how much each stock tank barrel of that original oil expanded, $E_t$:

$$F = N \, E_t$$

Everything in the Associate tier is an unpacking of that line. Module 2 breaks $F$ and $E_t$ into their pieces. Module 3 turns the identity into a straight line whose slope is $N$. Module 4 asks which piece of the expansion did the pushing. Module 5 checks the answer against the geoscience booking.

## Work the last Ekene survey

The Ekene tank has six pressure surveys after the initial condition. At the last one, 2023-01-01, the engine reports an underground withdrawal of 317926.842484584 rb and a total expansion of 0.0261900809071921 rb per stb of original oil. If the identity holds, then the original oil in place is one division:

$$N = \frac{F}{E_t} = \frac{317926.842484584}{0.0261900809071921} = 12139208.1074968 \text{ stb}$$

Twelve million stock tank barrels, from a pressure gauge and a production report. Nothing in that division knew the area of the field, the thickness of the sand, or the depth of the oil water contact.

Now run it the other way, which is the check you should always be able to do. Multiply the answer back:

$$N \, E_t = 12139208.1074968 \times 0.0261900809071921 = 317926.842484584 \text{ rb}$$

which is $F$ to the last figure. The books close.

## What that recovery actually looks like

Put the two numbers side by side. The tank held 12139208.1074968 stb. Over three years and 1096 days of production it gave up 261475.039999678 stb, which is 2.15397114609312 percent of itself. For that 2 percent the pressure had to fall from 3200 psia to 2096.00826266700 psia, a drawdown of 1103.99173733300 psi.

Read that as physics rather than as a disappointment. Oil and rock and water are nearly incompressible. Expanding a twelve million barrel tank by a third of a percent of its own volume takes an enormous pressure drop, and that is exactly why a small produced volume is a sensitive measurement of a large in-place volume. The stiffer the system, the more the pressure moves per barrel produced, and the sharper the reading you get back.

## Three routes, three different kinds of evidence

It helps to place this method among its neighbours before you learn its mechanics.

Volumetrics builds the number from geometry: a mapped surface, a contact, a net to gross, a porosity, a saturation. It knows nothing about production and can be run on the day of discovery.

Decline analysis, the previous course, builds a forecast from rate history. It knows nothing about pressure and nothing about how much oil was never going to come out.

Material balance sits between them. It needs production, so it cannot run on day one. It needs pressure, so it needs surveys. In exchange it gives a number that neither of the others can give: a measurement of the whole tank, made from the tank's own response to being drained.

## The misconception to kill now

Material balance is not a forecast. It will not tell you next year's rate, it does not know where the wells are, and it cannot tell you which part of the field the oil came from. It is a statement about totals at a moment in time. Learners who arrive from decline analysis often expect a curve to project; what they get is a balance sheet to close. Keep the two jobs separate and both stay honest.

The second misconception is subtler. The identity $F = N E_t$ contains no fitting, no tuning and no correlation. It is arithmetic on measured quantities. When material balance disagrees with volumetrics, the disagreement is real information about the reservoir, not a knob to be adjusted until the numbers match. Module 5 is about reading that disagreement.

## Exercise

Take the fourth Ekene survey, 2022-01-01. Its underground withdrawal is 236802.932166801 rb and its total expansion is 0.0195072800523586 rb/stb. Divide one by the other and write down what you get.

Then compare your answer with the 12139208.1074968 stb the last survey gave. They should agree to the digits you can carry on a calculator, and that agreement is not a coincidence: it is the single most important diagnostic in this whole course. Six surveys, six independent divisions, one answer. Module 3 gives that observation its proper name.
