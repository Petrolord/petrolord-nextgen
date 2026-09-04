# Pack porosity

A pack of grains is mostly grain and partly space, and using the grain density alone throws the space away.

{{panel:st-pack-explorer}}

## The two densities

The grain density of 20/40 ISP ceramic is 3270 kg/m3. That is the density of the ceramic itself, the number you would measure by weighing a solid piece of it.

A settled pack is not solid ceramic. Grains touch at points and leave voids between them, and the catalogue takes the porosity of that pack as 0.35 for every proppant family. The density of the pack as a bulk material is therefore the grain density multiplied by one minus the porosity.

The propped width uses the bulk value, not the grain value, because the width you want is the thickness of the pack, not the thickness the grains would occupy if they were melted into a sheet.

## What using the grain density alone does

If you divide the areal concentration by 3270 kg/m3 with no porosity term, you get a width smaller than the true one by the factor one minus 0.35.

Notice the direction. The error understates the width, so it understates the conductivity, so it understates the well's performance. It is a pessimistic error, which is the kind that survives review for years because nobody complains about a job that beat the forecast.

It is still wrong, and it is wrong by more than a third of the answer, which is larger than most of the uncertainties people argue about at design meetings.

## Why the voids do not cancel

There is a tempting objection. The pack permeability of 250, 180, 120 and 70 darcy at 2, 4, 6 and 8 thousand psi of closure is already a property of the pack including its voids, so surely the porosity has been counted once already.

It has, but for a different purpose. The permeability describes how easily fluid moves through the void network. The porosity in the width calculation describes how thick the grains stand when they settle. One is about flow, the other is about geometry, and both are needed. Multiplying them together is exactly what conductivity is.

## What the engine refuses

The engine requires the pack porosity to lie strictly between 0 and 1. A porosity of 0 would claim a pack with no space between grains, which no assembly of particles achieves. A porosity of 1 would claim a pack with no grains, which would make the width infinite.

Refusing both is not fussiness. Each would produce a confident number with no physical meaning.

## Exercise

Compute the propped width from the published areal concentration twice, once with the bulk density and once with the grain density alone, and state the ratio.

Then say which of the two errors you would rather a colleague made, and why that preference is still not a defence.
