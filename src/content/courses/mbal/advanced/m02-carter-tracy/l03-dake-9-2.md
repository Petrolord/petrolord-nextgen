# Dake Exercise 9.2

This is the case the whole Expert module has been building towards: a real field history, a mapped finite aquifer, a published answer to check against, and a benchmark that the engine has to pass before anything in this course is allowed to claim it works. Dake sets it out in chapter 9 of Fundamentals of Reservoir Engineering as an exercise in aquifer fitting by unsteady state theory.

## The case

The reservoir and aquifer parameters, as they stand in the committed fixture `test-data/mbal/dake-9-2.ts`.

| quantity | value |
|---|---|
| initial pressure | 2740 psia |
| connate water saturation Swc | 0.05 |
| formation compressibility cf | 0.000004 /psi |
| water compressibility cw | 0.000003 /psi |
| gas cap ratio m | 0 |
| reservoir radius at the oil water contact rR | 9200 ft |
| aquifer dimensionless radius reD | 5 |
| aquifer thickness h | 100 ft |
| aquifer permeability k | 200 md |
| aquifer porosity phi | 0.25 |
| water viscosity muw | 0.55 cp |
| encroachment angle theta | 140 deg |
| aquifer total compressibility ct | 0.000007 /psi |

Three fixture notes belong in the record. The bubble point is set equal to the initial pressure because Dake does not quote one, which is harmless here because per row PVT is supplied and the engine therefore never reaches its correlations. Reservoir temperature 200 F, oil gravity 35 API and gas gravity 0.7 are nominal for the same reason. And the year 9 solution gas ratio carries a correction from 381 to 371 scf per stb, an optical character recognition error in the scanned table that was caught and is documented in the fixture.

Table 9.3, the production and PVT history, eleven annual rows.

| yr | p psia | Np MMstb | Rp scf/stb | Bo | Rs | Bg rb/scf |
|---|---|---|---|---|---|---|
| 0 | 2740 | 0 | 650 | 1.404 | 650 | 0.00093 |
| 1 | 2620 | 7.88 | 760 | 1.374 | 592 | 0.00098 |
| 2 | 2395 | 18.42 | 845 | 1.349 | 545 | 0.00107 |
| 3 | 2199 | 29.15 | 920 | 1.329 | 507 | 0.00117 |
| 4 | 2029 | 40.69 | 975 | 1.316 | 471 | 0.00128 |
| 5 | 1883 | 50.14 | 1025 | 1.303 | 442 | 0.00139 |
| 6 | 1760 | 58.42 | 1065 | 1.294 | 418 | 0.0015 |
| 7 | 1655 | 65.39 | 1095 | 1.287 | 398 | 0.0016 |
| 8 | 1571 | 70.74 | 1120 | 1.28 | 383 | 0.0017 |
| 9 | 1507 | 74.54 | 1145 | 1.276 | 371 | 0.00176 |
| 10 | 1460 | 77.43 | 1160 | 1.273 | 364 | 0.00182 |

Read the pressures before anything else. They fall by 1280 psi over ten years while cumulative production reaches 77.43 MMstb, and the decline is decelerating: 120 psi in the first year, 47 psi in the tenth. Something is holding the pressure up, and it is holding it up harder as time goes on. That shape is what a water drive looks like from the inside.

## What the engine returns

Running `computeMaterialBalance` with `aquifer_model` set to `carter_tracy`, a radius ratio of 5, and the per row PVT from the table returns an oil in place, a cumulative influx, a fit statistic, a drive mechanism of `water_drive_with_depletion`, an aquifer strength of `strong`, and a set of drive indices. The oil in place and the cumulative influx are two of the Expert capstone's fields, so this lesson does not print them: run the case yourself in the tank explorer's Dake mode (Dataset: Dake Exercise 9.2, aquifer: Carter-Tracy, finite), which opens with no aquifer, the counterfactual.

The influx history the march produces, year by year, in reservoir barrels, up to year 8:

| yr | tD | cumulative drawdown psi | We rb |
|---|---|---|---|
| 1 | 5.68592541673827 | 120 | 3119439.46038555 |
| 2 | 11.3563155181303 | 345 | 11680219.6835526 |
| 4 | 22.6970957209142 | 711 | 34026926.6977129 |
| 6 | 34.0534112390445 | 980 | 56244693.3766256 |
| 8 | 45.3941914418285 | 1169 | 74704534.6703933 |

Those dimensionless times use the material balance engine's own coefficient of 0.0155353153462794 per day on the calendar spacing of the fixture dates, which includes three leap years, so they differ in the fourth figure from the 365 day values used in the hand calculations of lesson 2. The onset of pseudo steady state for this aquifer is at $t_D = 0.4 r_{eD}^2 = 10$, so the march crosses into the bounded regime between year 1 and year 2 and spends nine tenths of the history there. That is why the finite solution matters so much on this case, and it is what module 1 predicted from the ratio column.

## Worked example: closing the books at a survey

Take a survey and check the material balance directly rather than trusting the regression. At year 6 the engine's per timestep terms are an underground withdrawal $F$ of 132292090 rb, an oil expansion $E_o$ of 0.238 rb per stb, a rock and connate water expansion $E_{fw}$ of 0.00601059789473684 rb, a total expansion $E_t$ of 0.244010597894737 rb, and a cumulative influx $W_e$ of 56244693.3766256 rb.

The tank statement is that withdrawal equals expansion plus imported water: $F = N E_t + W_e$. Put your own $N$ from the panel into the right hand side and compare it with $F$. The books will not close exactly: a single value of $N$ has to serve all ten surveys, and it cannot fit every one of them exactly.

That residual is also the reason the drive indices do not sum to one. Form them from the same terms, $N E_o / F$, $N E_{fw} / F$ and $W_e / F$, and the sum falls a fraction of a percent short of one. Now note what it is not. No water has been produced on this field, so $W_p B_w$ is zero, and the gross withdrawal denominator the engine uses is identical to the net withdrawal denominator the literature uses. The convention question that separates those two cannot be responsible here. What is left is the least squares residual.

Work the residual at every survey and it is positive throughout, rising to a hump in the middle of the history and falling back by the end. A systematically signed residual with a hump in the middle is not noise. It says the influx model and the data have slightly different shapes in time, which is exactly what you would expect from an approximation to the aquifer response rather than the exact one.

## At the panel

{{panel:mb-tank-explorer}}

The panel opens on the Ekene tank. Use it as the control first: with the aquifer selector on **None (the truth)**, **Drive mechanism** shows `depletion_drive`, **Water drive index** shows a value indistinguishable from zero, **Aquifer strength** shows `none`, and **Drive indices sum** shows a number that closes to one.

Then switch **Dataset** to **Dake Exercise 9.2 (published)**. It opens with no aquifer at all, the counterfactual. Choose **Carter-Tracy, finite** and read the oil in place and the cumulative influx the capstone asks for, then **Carter-Tracy, infinite acting** and watch what an aquifer with no outer boundary does to both.

## Exercise

Work year 6 of Dake 9.2 with the terms given in the worked example and the $N$ you read from the panel.

First, compute $N E_t + W_e$ and state the residual against $F$, in barrels and as a percentage of $F$. Second, form the three drive indices at year 6 and their sum, and say whether the water drive index is larger or smaller than at year 10. Third, explain in two sentences what a rising water drive index through the middle of a field's life tells you about which mechanism is taking over, and say what you would expect the index to do if the aquifer were infinite instead of bounded at $r_{eD}$ 5.
