# The capstone walkthrough

The Associate capstone booked one clean well. The Professional capstone worked a field as a portfolio. The Expert capstone asks you to produce numbers that are correct and uncomfortable, and to report them as they stand. Six graded fields, one per Expert skill.

| Graded field | Unit | Tolerance | Owning lesson |
|---|---|---|---|
| Ekene-5 post-ramp fitted Di, 2024-05-01 on | 1/d | 0.000005 | m05 l02 |
| Ekene-6 oil decline on the same window | 1/d | 0.00002 | m05 l03 |
| EUR at b 1.2, qi 120, Di 0.0012, limit 10 | stb | 2000 | m02 l01 |
| Ratio of that EUR to the exponential EUR | - | 0.02 | m02 l02 |
| Field triangle P90, the low case | stb | 2000 | m04 l03 |
| Field triangle P10, the high case | stb | 2000 | m04 l04 |

Read the first two tolerances before anything else. The Ekene-5 tolerance of 0.000005 per day is 1.43 percent of the value being graded, and a window start two months early lands 3.66 percent away, which misses by a factor of 2.5621018371390645. That tolerance is tight enough to fail a window whose fit reports R2 0.9887 and a quality tier of Excellent. It is not a generous band around a fussy number. It is the grader refusing to accept a contaminated window.

This lesson walks two fields the whole way through the panels and points at the owning lesson for the rest. Copying is not the risk. Producing a number by a route you cannot defend is.

## Walkthrough 1: Ekene-5's post-ramp decline

Open the fit explorer. Select Ekene-5, model Exponential, and set the window to the post-ramp preset, which starts 2024-05-01 and runs to the last row of history.

{{panel:dca-fit-explorer}}

The tiles come back with $q_i$ 47.10215945583964 stb/d, $D_i$ 0.00035000000000000043 per day, R2 1.00000000000000 and RMSE 5.732983582318044e-14. Report the $D_i$ tile as it stands, at whatever precision you carried; 0.00035 passes comfortably.

Before you write it down, earn it. Switch the window to custom and set the start to 2024-04-01, one month earlier, which is still a clean start because it is the ramp-end row itself. $D_i$ does not move. Now set it to 2024-03-01. $D_i$ falls to 0.00033718949081430467 and R2 to 0.988676698925396, outside the graded tolerance while still reading Excellent on the quality tile.

That pair of clicks is the defence of the answer: moving the start into the clean regime does not move the constant, and moving it into the ramp does. Note which of the three windows you would have picked on R2 alone. All three clear 0.95.

One more check that costs nothing. Ekene-5 has `wcMax` 0 and no breakthrough date, so its oil stream and its gross stream are identical and this decline is the reservoir's, not a stream artefact. That fact makes this well the reference for the next field.

## Walkthrough 2: Ekene-6's oil decline on the same window

Leave the window exactly where it was and change the well selector to Ekene-6. Keep the model on Exponential; auto-select lands on Exponential here anyway.

The tiles now read $q_i$ 58.134557068111256 stb/d, $D_i$ 0.0013275893489185155 per day, R2 0.9477350438026422, quality Good. That $D_i$ is the graded value, and the tolerance of 0.00002 is 1.5 percent of it.

This is the field people fail while doing good engineering. Having just learned that the flood's decline constant is 0.00035 per day and that all four wells recover it, the instinct is to report the reservoir's decline. The field does not ask for that. It asks what a fit of this well's oil stream on this window returns, which is 3.793112425481473 times larger, because Ekene-6's water cut climbs toward 45 percent across those twenty rows and every one of them carries water.

Two panel readings confirm you are on the right well and window before you submit. The $q_i$ tile, 58.134557068111256, sits above the well's actual oil rate on the first row of the window, which is 53.28318903080415 stb/d: that gap is the exponential straining against a stream that steepens. And the quality tile says Good rather than Excellent, on a fit whose decline constant is wrong about the reservoir by a factor of nearly four. Both are symptoms you were taught to read, and both are present.

Submitting a number you know describes a stream rather than a reservoir is the point of this field. Say what it is in the memo; do not fix it in the form.

## The other four, and where they come from

Open the uncertainty explorer for all four.

{{panel:dca-uncertainty-explorer}}

**The b 1.2 EUR, and its ratio to the exponential booking.** Module 2, lessons 1 and 2. The panel holds $q_i$ at 120 stb/d, $D_i$ at 0.0012 per day and the limit at 10 stb/d, and gives you a b slider from 0 to 1.2 in steps of 0.05. Move it to 1.20 and read the EUR tile and the ratio tile; the ratio is that EUR divided by the b = 0 booking of the same well, which is the Associate capstone's answer. Do it in two stages: read the tile at b = 0, read it again at b = 1.20, and divide them yourself before looking at the ratio tile. Every barrel of the difference is in the tail, beyond any data.

**The triangle's P90 and P10.** Module 4, lessons 3 and 4. Scroll to the triangular block. Its three inputs default to the field's primary EUR triangle: minimum 380000 stb, mode 461709.132532792 stb, maximum 580000 stb. The mode is the sum of the four closed-form EURs, which was a graded field one tier down, so the distribution is built on a number you already booked. Read the P90 and P10 tiles.

Two traps here and the panel exposes both. The petroleum convention is that P90 is the low case and P10 the high case, which is the reverse of the statistical convention some tools use, so check that your P90 tile is smaller than your P10 tile before submitting. And the mode is not the P50: the panel's F(mode) tile reads the cumulative probability at the mode, and for this right-skewed triangle it is well below 0.5, which means the number you would naturally call "the estimate" sits low in its own distribution.

## Submitting

The capstone form is on the Learning Mode page under the course. Enter the six values at the precision you carried and submit. Grading is server-side against engine truth within the stated tolerances, and you see which fields passed.

Failures here are almost never rounding. Each field has one characteristic way of going wrong: a window start inside the ramp, the reservoir's decline reported instead of the well's oil decline, an exponential EUR reported instead of the hyperbolic one, the ratio inverted, and P90 and P10 swapped. Work out which of those you did before you touch a decimal place.

## Exercise

For each of the six fields, write the one sentence you would say to an auditor who asked how you know. Then do the two experiments that make the sentences true rather than plausible.

In the fit explorer, hold Ekene-6's window start at 2024-05-01 and walk the end date backwards: 2025-09-01, 2025-06-01, 2025-03-01, 2024-12-01, 2024-09-01. The decline constant falls 0.0011423053338627778, 0.000987814518630239, 0.0008526655361004656, 0.0007323239421420079, 0.0006214027401425083 as the wettest rows leave the window, and R2 climbs the whole way, from 0.9632536322295616 to 0.9957038513755389. A number that is still 1.78 times the reservoir's decline arrives wearing the best fit statistic of the set.

In the uncertainty explorer, type 700000 into the triangle's maximum in place of 580000 and watch which of P90 and P10 moves more. Predict the direction of both experiments before you click, and write down what each result tells you about which inputs your booking is actually sensitive to.
