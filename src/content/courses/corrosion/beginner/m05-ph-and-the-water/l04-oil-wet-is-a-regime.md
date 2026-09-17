# Oil wet is a regime

{{panel:fc-rate-explorer}}

Steel does not corrode where it is oil wet. This engine treats that as a regime rather than as a multiplier it applies everywhere, and the dropdown carries three values: water wet, intermittent and oil wet. The shipped case runs water wet with a wetting factor of 1.000000, so the full rate is credited to the wetted wall.

Choose oil wet on that same case and the rate becomes 0.000000 mm/yr. Everything else is unchanged. The temperature, the composition, the velocity and the corrosion inhibitor programme are all exactly where they were, and one dropdown has taken the answer to zero.

## What the engine does with that zero

The engine does not print a category beside it and does not print a remaining life. Both are withheld, and the binding constraint on the summary reads that the model does not apply. The reason is stated rather than implied: the rate is zero because oil wetting was assumed, and not because a rate was calculated. An unbounded life arriving off a dropdown would be the strongest reassurance on the screen resting on the weakest input in it.

The corrosion inhibitor figure behaves the same way. It comes back as null rather than as zero, because a reported zero percent effectiveness on a line that has a corrosion inhibitor programme would be a statement, and it would be a false one. There is nothing for the programme to be effective against when the rate is zero by assumption.

## How to use the regime honestly

Treat the dropdown as an assertion you are making rather than as a setting you are choosing. Oil wet is a claim about the whole line at all times, including start up, shutdown, low rate operation and any low point where water can collect. If you cannot defend that claim, the intermittent regime exists, and it reads the water cut fraction that the other two regimes ignore.

The regime name is matched without regard to case or punctuation, so oil wet, oilWet and OILWET all resolve to the same regime. An unrecognised string is refused and the message lists the three the engine accepts, which means a typed regime never falls through to the least limiting choice. That is the same design decision as the blank velocity refusal two modules back, applied to a word instead of a number, and it is worth recognising the pattern when you meet it in a third place.

## Exercise

Run the shipped case water wet and write down the rate of 0.754524 mm/yr, the category of high and the remaining life of 4.207953 yr. Switch the dropdown to oil wet and record all three fields again, together with what the summary now says about whether the model applies. Then write two sentences a reviewer could challenge you on: one stating what you are asserting about the line by choosing oil wet, and one naming the evidence you would need to support it.
