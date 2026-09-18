# Marching the outlet pressure down

{{panel:fc-choking-explorer}}

A single sizing call tells you what a valve does at one operating point. A march tells you where the valve changes behaviour, and a valve that changes behaviour inside its own operating range is the one that gets specified wrong. This lesson reads the BELEMA march row by row and names what moves.

## The nine rows

The march runs at outlet pressures of 200.000000, 171.300000, 140.000000, 110.000000, 80.000000, 60.000000, 40.000000, 28.740000 and 20.000000 psia. Four of the quantities returned on each row are the subject of this lesson: the coefficient, the cavitation index, the regime word and the choked flag.

The coefficient reads 37.431838 at 200.000000 psia, 29.482661 at 171.300000 psia, 24.793550 at 140.000000 psia, 21.909166 at 110.000000 psia and 19.842638 at 80.000000 psia. Then it stops. On the rows at 60.000000, 40.000000, 28.740000 and 20.000000 psia it reads 19.148480 four times over.

The cavitation index does the same thing in the same place. It reads 4.651599, then 2.885714, 2.040786, 1.593572 and 1.307130, and then it reads 1.217275 on each of the last four rows.

## The regime word and the flag are separate answers

The regime word walks its own ladder while the coefficient is still moving: `stable` on the first row, `incipient cavitation` on the next two, `cavitating` on the two after that, then `choked, cavitating` on two rows and `flashing` on the last two. The choked flag is what the count is taken over. The engine reports choked flow on 4 rows of this march, counted over the 9 outlet pressures asked of the liquid valve, with a row counting when the engine returns choked true.

Notice that the regime word and the choked flag are answering different questions. A row can read `cavitating` with the flag still false, which means the valve is being damaged while the sizing equation is still working normally. The last two rows read `flashing` while the flag stays true and the coefficient stays at 19.148480, which means the sizing has been capped and the failure mechanism has changed underneath it.

A march also settles an argument that a single call cannot. Asked at one operating point, a valve either chokes or it does not, and a reviewer has no way of telling whether the answer was close. Asked at nine, the valve shows where it turns over and how much room is left either side of the turn, which is the information a turndown case actually needs.

## The crossing itself

Between the row at 80.000000 psia and the row at 60.000000 psia the engine's choked flag turns over. Bisecting that flag puts the crossing at an outlet pressure of 67.679968 psia, with an allowable drop there of 179.220032 psi and a coefficient there of 19.148480. That figure is worth carrying, because it is the number that tells a designer whether a proposed turndown case sits on the safe side of the valve's own limit.

## Exercise

Take the row at 110.000000 psia and the row at 40.000000 psia. For each, write down the coefficient, the cavitation index and the regime word. Then say which of the two rows the engine returns choked true on, and give the outlet pressure of the crossing that decides it.
