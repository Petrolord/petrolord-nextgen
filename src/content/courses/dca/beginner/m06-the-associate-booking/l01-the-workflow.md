# The workflow

Everything in this tier assembles into one repeatable procedure. You have met every piece already: the data in module 1, the models in module 2, the cumulatives in module 3, the fit in module 4, the booking numbers in module 5. This lesson puts them in order, because the order is what protects you. An analyst who fits before choosing a window, or books an EUR before checking the fit, gets numbers that look fine and mean nothing.

Here is the Associate workflow, six steps, in the order they must happen.

## Step 1: Assemble the rate-time data

Start from the monthly oil-rate table for one well and one stream. Confirm three things before touching a model: the units (stb/d here, one reading on the first of each month), the start date of the well (Ekene-1 came on 2020-01-01), and any events in the field's life that changed operating conditions. For Ekene that event is the waterflood, which started 2023-01-01. Write these down. They are part of the booking, not trivia.

## Step 2: Choose the fit window

Decline analysis assumes unchanging conditions. The Ekene flood changed conditions for every producer, so the valid window for primary-decline analysis runs from each well's start up to the last monthly row before 2023-01-01. Choosing the window is a physical judgment, made before fitting, from what you know about the field. It is never a knob to turn afterwards until the answer looks nice.

## Step 3: Fit, and read what came back

Fit the windowed data with auto-select. The engine tries all three model families and returns the one with the lowest RMSE. For Ekene-1's primary window it returns Exponential with qi 120 stb/d, Di 0.0012 per day, and R2 of 1, because the teaching data is noise-free. Real data never gives R2 of exactly 1, but the reading habit is the same: note the model family, the three parameters, R2 and RMSE together.

## Step 4: Sanity-check against the plot

Put the fitted curve over the data on a semilog plot. An exponential decline is a straight line there; Ekene-1's points sit exactly on it. Check that qi is close to the early rates (120 stb/d against a first reading of 120), and that the curve does not drift away late in the window. If the curve fits the middle and misses both ends, the model family is wrong no matter what R2 says.

## Step 5: Book EUR and time to limit

State an economic limit first, then compute. At 10 stb/d, Ekene-1 books an EUR of 91666.6666666667 stb, reached after 2070.75554149 days. Both come from the closed forms of module 5, and both move if the limit moves, which is why the limit is stated with the number. An EUR without its limit is not a booking, it is a rumor.

## Step 6: Report the supporting numbers

Two more numbers complete the report: cumulative production at a stated date (for Ekene-1 at the flood start, 73157.9366256283 stb after 1096 days), and the decline stated in the form your reader expects. Di is 0.0012 per day nominal; the tangent effective annual decline is 35.4674217142705 percent per year. Say which convention you used. Then record the window and the limit beside the results, so the next engineer can reproduce every figure.

## Worked example: the whole chain in one paragraph

Ekene-1, oil, monthly stb/d, on stream 2020-01-01, flood at 2023-01-01, so the window is 2020-01-01 through 2022-12-01. Auto-select on that window: Exponential, qi 120 stb/d, Di 0.0012 per day, R2 = 1. Semilog check: straight line, no drift. At a 10 stb/d limit: EUR 91666.6666666667 stb, time to limit 2070.75554149 days. Cumulative at the flood start 73157.9366256283 stb; tangent effective decline 35.4674217142705 percent per year. Window and limit recorded. That paragraph is a complete Associate booking.

## Exercise

Run the same six steps on Ekene-6 in the fit explorer panel (open any lesson that carries it, or the Learning Mode page). Ekene-6 came on 2020-09-01 and is hyperbolic, so expect a third parameter: the fit should return qi 90 stb/d, Di 0.001 per day and b of 0.35 on the primary window. Book its EUR and time to limit at 10 stb/d, read its cumulative at the flood start, and write the one-paragraph report in the same shape as the worked example. Keep your paragraph; the capstone walkthrough in the next lesson follows the identical structure.
