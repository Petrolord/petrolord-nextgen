# When the exception count changes

This campaign returned one exception on each of three fields. That will not always happen, and the two answers on either side of one are worth thinking through before you meet them. There is no second campaign in this course to read, so this lesson stays qualitative. Nothing here comes with numbers attached, because inventing a batch to illustrate a point is exactly the habit this tier is trying to break.

## An exception count of zero

Zero is the answer people hope for and the answer that deserves the most suspicion, because two completely different situations produce it.

The first is a genuinely uniform delivery. Every file arrived in the same depth unit, every depth column steps evenly, no curve came through empty. That happens, particularly when a single vendor exports a single project on a single day with a single template, and it is good news.

The second is a test that is not doing anything. A check that never runs, a check pointed at the wrong field, a check whose condition can never be true, and a reader that quietly skipped files it could not open all report zero exceptions. So does a campaign that read four files while you believed it read six.

The output looks identical in both cases, which is the whole problem. A number cannot tell you whether it was measured. So when a field returns zero, confirm the denominator before you celebrate: how many files did the campaign actually read, and does that match the number you delivered to it. A zero over the right denominator is a finding. A zero with no denominator beside it is a sentence with the important half missing.

The stronger habit is to keep a file you know fails. Run the campaign over your real batch plus one file that must trip the test, and a field that comes back zero on the known bad file has told you about your campaign rather than about your data. This is cheap, it takes one extra row in the table, and it converts an unfalsifiable zero into a checked one.

## An exception count equal to the batch

Now the other end. Suppose every file in a delivery needed a depth unit conversion, or no file had a uniform depth step.

The first thing to notice is that this is not really an exception count any more. When every file behaves the same way, nothing is the odd one out, and what you have found is the convention of the delivery rather than a defect in any member of it. The word exception has quietly stopped applying, and if you keep using it you will keep looking for the wrong thing.

The response changes accordingly. A single odd file is a query about that file: what happened here, and what do we do with it. A whole batch that differs is a conversation about the delivery: this is how your supplier exports, or this is what this vintage of data looks like, or our project default does not match the source. You handle it once, with one decision applied to everything, and you write the decision down where the next delivery from the same source will find it.

The second thing to check is your own assumption. When every file fails a test, the likeliest explanation after a genuine convention difference is that the test is wrong. A check calibrated against the wrong reference, a unit table missing an entry that half the world uses, a tolerance too tight for the data it is applied to: all of these fail everything, and all of them look like a catastrophic delivery until somebody reads the test. A result of every file is a claim that your data is entirely unlike what you expected, and it is worth spending an hour on that claim before you send it to anyone.

## Where a campaign earns the most

Between those two ends, the count that pays best is a small one over a large batch, which is what this campaign returned.

A small count is specific. It hands you a short list of names, and every name on it is worth opening. The work it creates is proportionate to the problem, and the majority of the batch is cleared at the same time by the same run.

Zero and all give you no separation between files. They are statements about the batch as a whole, and they are worth having, and neither of them will send you to a particular file with a particular question. That is the sense in which the exceptions are the product. A field that discriminates between the members of a batch is doing something a total cannot do.

## Watching the count across deliveries

The single most useful thing you can do with these numbers is keep them. Record each field for each delivery, from the same source, in one place.

Then movement becomes visible, and movement is where the information is. A field that has always returned zero and now returns something has caught a real change, in the source, the tool, the template or the export settings, and it caught it on the day it happened rather than months later in an interpretation. A field that has always found an exception and now finds none deserves the same scrutiny in the other direction, because a problem that stopped appearing and a check that stopped working look the same from here.

None of that is possible from a single campaign run. One run gives you a snapshot. A record of runs gives you a baseline, and a baseline is what turns a count into a signal.

## Exercise

Without using any numbers, write two short paragraphs. In the first, describe how you would tell a genuinely clean delivery from a campaign whose checks are not running, given that both report zero exceptions. In the second, describe what you would do differently if a field reported that every file in a delivery needed a depth unit conversion, compared with what you did for feet_20 in this campaign.

Self-check: for the first, the two look identical in the output, so you confirm the denominator by checking that the campaign read every file you handed it and reported on each one, you look for files it silently skipped, and you keep a file you know fails the test in the run so that a zero on the known bad file exposes a check that is not working. For the second, a whole batch that converts is a property of the delivery rather than of any file in it, so the response is one decision applied to everything and a note recorded against the source for next time, rather than the single file query that feet_20 deserved as the one exception among six, and before sending any of it you re-read the test itself, because a check that fails everything is more often miscalibrated than a delivery is uniformly foreign.
