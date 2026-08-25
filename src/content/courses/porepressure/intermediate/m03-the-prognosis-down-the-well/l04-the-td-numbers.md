# The TD numbers

Four of the capstone's six graded values live at total depth: the trend transit time, the pore pressure, the overpressure, and the fracture pressure. This lesson assembles all four and files them against the frame, because at total depth every curve this course has drawn comes to a point and the numbers have to agree with each other.

## The trend at TD

$$\Delta t_n(4000) = 220 + 436\, e^{-0.0006 \times 4000} = 220 + 436\, e^{-2.4}$$

$e^{-2.4} = 0.09071795328941251$, so $\Delta t_n = 220 + 39.55302763418385 = 259.5530276341839$ us/m, graded with a tolerance of 0.5.

Two remarks. First, this is the number the Associate tier's onward lesson quoted when it said the two trends diverge to 13.4 us/m at TD: the fitted trend reads 246.14832692884366 there, and the gap between the trends has grown from 6 us/m at the mudline. Second, the graded value is the trend, not the log. The log at TD reads 270.92263512383806 us/m. Quoting one for the other is a classic exam slip, and the difference between them, 11.37 us/m, is precisely the evidence the whole prognosis stands on.

## The pore pressure at TD

From the chain: ratio $259.5530276341839 / 270.92263512383806 = 0.9580337483265022$, cubed $0.8793108342707514$, budget $49.714487325732826$ MPa, handover $6.000000$ MPa, so

$$PP(TD) = 41.408579625 + 6 = 47.408579625 \ \mathrm{MPa}$$

graded at 0.01. Notice the graded value is hydrostatic plus overpressure with both parts exact: the capstone's pp_td and op_td fields are not independent numbers, they differ by exactly the hydrostatic the Associate tier computed. Internal consistency like this is your friend in the exam: any two of hydrostatic, pore pressure and overpressure at TD determine the third, so compute two and check the third.

## The overpressure at TD

Exactly 6 MPa, graded at 0.01, and by now you can say precisely why: 4 kPa per metre over the 1500 m of ramp. As a gradient statement, the pore pressure at TD is 47.408579625 MPa over an effective column of 4100 m, and the Expert tier will turn exactly that division into the equivalent mud weight the driller wants. Resist doing it early; this tier's language is megapascals.

## The fracture pressure at TD

Module 5 derives the formula; the capstone needs its value:

$$FP = K(S - PP) + PP = \tfrac{2}{3}(91.12306695073282 - 47.408579625) + 47.408579625 = 76.55157117548856 \ \mathrm{MPa}$$

graded at 0.01, with $K = \nu / (1 - \nu) = 2/3$ at the specified Poisson's ratio of 0.4.

## The ledger at TD

Every pressure this course knows at 4000 m, on one line, smallest to largest:

Hydrostatic 41.408579625. Pore pressure 47.408579625. Fracture pressure 76.55157117548856. Overburden 91.12306695073282 MPa.

Check the orderings, because they are physics, not conventions. Pore pressure above hydrostatic: overpressured well. Fracture pressure above pore pressure: the well can be drilled, there is a window. Fracture pressure below overburden: the coefficient form keeps a horizontal-stress margin below the vertical load. Any prognosis, on any well, that violates one of these orderings is broken somewhere upstream, and checking the four numbers takes ten seconds.

The gaps carry meaning too. Pore to fracture is 29.14299155048856 MPa, the pressure-unit width of what will become the mud window. Fracture to overburden is 14.571495775244259, exactly half the pore-to-fracture gap, and module 5 shows why that factor of two is $K = 2/3$ in disguise.

## Worked example

Verify the halving claim from the coefficient form without numbers. The fracture pressure splits the gap between pore pressure and overburden in the ratio $K$ to $1 - K$: $FP - PP = K(S - PP)$ and $S - FP = (1-K)(S - PP)$. With $K = 2/3$, the fracture sits two thirds of the way up, so the space above it is half the space below it. With the TD numbers: $S - PP = 43.714487325732826$; two thirds of it is 29.142991550488546 above the pore pressure, one third, 14.571495775244273, below the overburden, agreeing with the direct subtractions in every digit but the fifteenth, which is floating point being floating point.

## Exercise

Using only internal consistency, catch the error: a candidate reports hydrostatic 41.409, pore pressure 47.409, overpressure 6.000, fracture pressure 77.409 MPa at TD. Which number is wrong, and what did the candidate probably do?

Self check: the first three cohere, 41.409 plus 6.000 is 47.409. The fracture pressure fails the split check: with $K = 2/3$ it should sit at $47.409 + \tfrac{2}{3}(91.123 - 47.409) = 76.552$, not 77.409. The reported 77.409 is pore pressure plus 30, a suspiciously round gap; the likely slip is adding two thirds of the wrong bracket, or simply an arithmetic error carried with confidence. The split check catches it with no engine in the room.
