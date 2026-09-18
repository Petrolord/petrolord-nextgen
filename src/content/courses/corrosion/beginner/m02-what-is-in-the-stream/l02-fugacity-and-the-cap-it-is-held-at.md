# Fugacity, and the cap it is held at

{{panel:fc-chemistry-explorer}}

A partial pressure describes how much carbon dioxide is present. The rate correlation asks for a fugacity instead, which is the partial pressure multiplied by a coefficient that falls below one as the total pressure rises. The Fluid Properties course owns the thermodynamics of that distinction. What matters here is which quantity the engine feeds to which calculation.

On the shipped case the carbon dioxide partial pressure is 1.530013 bar, the coefficient is 0.878581 and the fugacity the rate is computed from is 1.344240 bar. Read those three figures together once and the distinction stops being abstract.

## The coefficient falls with pressure

The engine's own sweep at a fixed composition shows the shape. At a total pressure of 1.000000 bar the coefficient is 0.997465 and the fugacity is 0.029924 bar against a partial pressure of 0.030000 bar. At 10.000000 bar the coefficient is 0.974938. At 50.000000 bar it is 0.880814, at 100.000000 bar 0.775834 and at 200.000000 bar 0.601919. The gap between a partial pressure and a fugacity is negligible near atmospheric pressure and is not negligible on a high pressure line. The constants behind that curve are held for literature like the rest, so the coefficient is a number this engine uses rather than a number it can defend.

## The cap is a reported limit

Above a total pressure of 250.000000000000 bar the engine holds the coefficient flat at its value there. At 249.000000 bar the coefficient is 0.531526 and the cap flag is false. At 250.000000 bar it is 0.530179. At 251.000000 bar and at 400.000000 bar it is still 0.530179, the cap flag turns true, and the engine says what it is doing in its own words:

> the fugacity coefficient is held at its 250 bar value: 399.99999999999994 bar is above the cap and what the correlation does above it is not established here

That sentence is the whole lesson of this page. Holding a value flat is a stated convention and it is never a prediction. Both the cap and the behaviour above it are held for literature, so a screening run above the cap is reporting a convention back to you. No graded field in this course sits above the cap for that reason.

## What a refusal looks like at this door

The fugacity door refuses rather than guessing when it cannot answer. A blank temperature gives back that a finite temperature is required. A temperature at or below absolute zero is refused and the message names the value that was typed. A total pressure of zero is refused because a positive total pressure is required. The bare coefficient door returns a not a number result below absolute zero, because a finite figure there would be read as an answer by anything that checks only for an error key.

## Exercise

Run the chemistry panel at the shipped composition and record the coefficient at total pressures of 10.000000 bar, 100.000000 bar and 200.000000 bar, which are 0.974938, 0.775834 and 0.601919. Then take the coefficient at 249.000000 bar and at 400.000000 bar and say what the pair tells you about the cap. Write one sentence on what you would need before quoting a rate computed above 250.000000000000 bar to anyone.
