# An input that changes nothing

Put a box on a screen and a user will turn it. If the answer beside it never moves, they conclude the quantity does not matter. Sometimes they are right. Sometimes the box is a defect. Telling the two apart is a short piece of arithmetic.

{{panel:fc-fire-drum-explorer}}

## The first kind, which is correct

Type a balanced-bellows back-pressure factor into the gas route while the flow through the valve is subcritical, and walk it. Three different values return 2.658695041098, 2.658695041098 and 2.658695041098 in2, one figure to twelve decimals.

That is correct. The standard uses F2 in the subcritical branch and the bellows factor has no place in it. An input that cannot move an answer because the method it belongs to is not the method being used is behaving exactly as it should.

What makes it teachable rather than confusing is that the engine says so. The call succeeds and attaches a warning, and these are the engine's own words: `subcritical flow uses F2, not Kb; the typed Kb was ignored`.

Silence would have left a user turning a dial and inventing an explanation. A warning turns the same behaviour into information.

## The second kind, for contrast

The steam superheat factor always divides. A factor of 1.000000 gives 0.949984 in2 and 0.830000 gives 1.144559 in2, a ratio of 1.204819277108 against a factor ratio of 1.204819277108.

Those two ratios are the same to twelve decimals, so the factor passes straight into the area.

Now put the two side by side. One never moves the answer and is right to. One always moves it, exactly. They are read completely differently, and the first question to ask of any input is which kind it is.

## The arithmetic test

Take the input. Walk it across its whole declared range with everything else fixed. Print the spread of the answer. Compare that spread with the precision the answer prints at.

Three outcomes. A spread much larger than the precision means the input drives the answer. A spread of exactly zero with a stated reason, like the bellows factor, means the input belongs to a branch that is not running. A spread smaller than the precision with no reason offered is the one to investigate, because an input that has been validated, labelled and given a box, and then moves the answer by less than its own last digit, asserts that it matters while doing nothing.

## The test on an input that works

The knockout drum's liquid holdup is the worked example, and the Professional tier walks it across its whole range. The required length moves by tens of feet and the column is not even monotonic, because two effects inside the drum move against each other. That is what the test looks like on an input that earns its box.

Run it on anything you are suspicious of. It costs one sweep.

## Exercise

Record the three subcritical areas at three different bellows factors and quote the warning the engine attaches, naming it as the engine's own wording. Record the two steam areas, the ratio between them and the factor ratio it is read against. Then write out the arithmetic test in four steps and its three outcomes, and say which outcome is the one to investigate.
