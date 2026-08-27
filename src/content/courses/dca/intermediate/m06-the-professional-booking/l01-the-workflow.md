# The workflow

The Associate tier ended with a procedure: assemble the data, take the window you were given, fit, check the plot, book EUR at a stated limit, report. It is a good procedure and nothing in this lesson repeals it. What changes at Professional is that three of those steps were handed to you as facts and are now decisions you have to make and answer for: the window, the model family, and whether you are allowed to borrow decline character from another well.

So the Professional workflow is not a longer list of calculations. It is the same calculations with a decision, and a defence of that decision, attached to each one.

## Step 1: Build the regime log before the fit

Write down every date on which the well or the field changed physically: first oil, choke changes, workovers, artificial lift installation, injection start, and any interruption long enough to disturb the pressure profile. For Ekene that log has two entries per producer: the well's own start date, and the field-wide waterflood on 2023-01-01.

The log is not background reading. Every entry in it is a candidate window boundary, and the log is what you will hand a reviewer when they ask why your window starts and ends where it does. Build it first, because building it after the fit invites you to build the log that justifies the fit.

## Step 2: Choose the window, and write the sentence

Pick the regime you intend to describe, and write one sentence naming it, the stream, and the boundary dates. For Ekene-6's primary booking: oil stream, primary depletion, 2020-09-01 to the last monthly row before 2023-01-01. That sentence is the model statement. Lesson 3 of this module is entirely about how to write it so it survives review.

## Step 3: Fit, then read every parameter

Auto-select returns a family and three parameters. Read all of them, plus RMSE, before you look at R2. Two specific checks belong here and both are cheap:

- Does the fitted $q_i$ sit near the early rates in the window? A $q_i$ well below the first recorded rate means the curve cannot reach the start of your data, which means the window contains something the model cannot represent.
- Did $b$ land on a boundary of the search range? A $b$ pinned at the ceiling is the optimizer telling you it wanted to keep going and was stopped.

## Step 4: Interrogate b before you trust the family

R2 does not choose the model family, and the Ekene data proves it on a well whose truth we know exactly. Force the wrong family on Ekene-3's primary window and you get R2 0.987334417750128 with RMSE 3.58830309063897 for exponential, and R2 0.951593684935824 with RMSE 7.01499799089027 for harmonic. Both clear the 0.95 threshold that the quality bands call Excellent. The true family is hyperbolic with b of 0.5, and over a short early window the three families are barely distinguishable by fit statistic alone.

The Professional discipline is to ask what evidence supports the b you are about to book: how much time on production, how much of the decline range the window spans, and whether the drive mechanism is consistent with that value. If the honest answer is that b is barely constrained, say so in the booking and note which way the EUR moves if b is higher.

## Step 5: Rule on any analogy explicitly

If the well has no history of its own, or you are tempted to import a b from elsewhere, the analogy has to be admitted on evidence: same drive mechanism, comparable completion, comparable decline character. Pooling two wells because they share a field name is not evidence. Pool Ekene-3 and Ekene-6, normalize, and the best single hyperbolic through the union comes back with b of 0.05 at R2 0.861590575359367, which matches neither the 0.5 nor the 0.35 that built it. Record the ruling either way, including a decision not to use an analogy.

## Step 6: Say which forecast number you are reporting

The closed forms are exact. The engine's forecast is a daily sum and lands slightly lower on a declining well. Both are legitimate; the report has to name one. This is a one-line convention, and the field it protects is reproducibility: the next engineer must be able to land on your figure, not near it.

## Step 7: Roll up and reconcile

If the booking is a portfolio, check `missingWells` first, then the per-well scenario names and dates, then the total. Reconcile the total against the sum of the closed forms and confirm the difference is the size discretization predicts. A gap much larger than that is a data problem, not a numerical one.

## Step 8: Write the booking with its conventions

Volume, limit, window, stream, model family and parameters, decline convention, forecast convention, and the exclusion list. If a clause is missing, the reader will fill it in with an assumption, and it will not be yours.

## Worked example: Ekene-6, end to end

Regime log: first oil 2020-09-01, waterflood 2023-01-01. Window: oil, primary depletion, 2020-09-01 through the last row before 2023-01-01, chosen because injection changes the pressure regime and Arps assumes it is unchanging. Fit on that window: Hyperbolic, $q_i$ 89.9999999999999 stb/d, $D_i$ 0.001 per day, $b$ 0.35, R2 1.00000000000000. Parameter read: $q_i$ matches the first recorded rate, $b$ is nowhere near the search boundary, so nothing objects. b evidence: 821 days of production in the window, covering a decline from 90 stb/d to 43.7344375460616 stb/d at the last row, enough curvature to separate families on this noise-free data. Analogy: none used, and the pooled Ekene-3 plus Ekene-6 type curve was examined and rejected for this booking. Forecast convention: closed form. Booking: EUR 105266.626461929 stb at a 10 stb/d limit, reached at 3307.62651421312 days; the engine's daily forecast gives 105220.368975831 stb and stops on day 3308, a difference of 46.2574860986206 stb. Exclusions: no flood response, no facility constraint, deterministic.

Compare that paragraph with the Associate one-paragraph booking. The numbers are the same shape. What has been added is a defence for every choice that produced them.

## Exercise

Run all eight steps on Ekene-3 and write the paragraph. You will need its primary-window fit, its EUR and time to limit at 10 stb/d, its engine daily-sum EUR from the roll-up table in module 5, and an explicit ruling on the analogy question. Then do one more thing the Associate version never asked for: beside each of the eight steps, write the single piece of evidence a reviewer could demand, and mark the ones you could not currently produce. That marked list is your real audit exposure, and it is the subject of lesson 3.
