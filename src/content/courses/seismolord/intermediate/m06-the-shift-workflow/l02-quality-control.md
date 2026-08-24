# Quality control

The Associate tier had a QC checklist for building a synthetic, and it worked stage by stage down the pipeline so that a failure was caught where it was caused. This tier needs its own, because the failures here are different in kind. Nothing crashes, nothing looks broken, and every number on the panel is a real number produced by real arithmetic. The failures are all failures of interpretation, and the checklist is five questions you ask of a tie before you let anyone else use it.

## Check one: was the shift found by a scan rather than by eye

Start here because everything else rests on it. A shift produced by dragging the synthetic until the peaks look aligned is an opinion. It cannot be reproduced by a second person, it cannot be defended when the section is redisplayed at a different gain, and there is no way to arbitrate between two interpreters who disagree.

A shift produced by a scan is a measurement. It has a stated search range and a stated step, and anybody can rerun it. On the teaching exercise the scan walks 41 lags from minus 40 ms to plus 40 ms in one-sample steps at the 2 ms sample rate and returns a suggested bulk shift of 8 ms.

The check has a practical form. Ask what the search range was. If nobody can tell you, the shift was not scanned.

## Check two: is the correlation reported with the shift

A shift on its own is half a result. The scan returns the best lag it found, and it will always return something, including on data where no lag is any good. The correlation is what tells you whether the best lag was worth having.

So a tie record carries both. On the teaching exercise the correlation at the suggested shift of 8 ms is 1.

This check has a second half that is easy to skip. A correlation is only meaningful next to the correlations the scan rejected. At lag 0 on this exercise, which means no shift applied at all, the correlation is 0.621742. That is a number many people would accept if they saw it on its own, and it belongs to a tie sitting a full 8 ms wrong. The worst correlation anywhere across the 41 lags is -0.409277. Seeing the whole curve is what makes the peak convincing, and a single number quoted without its curve proves less than it appears to.

## Check three: is the wavelet frequency stated alongside any amplitude or pick

This is the check the whole of module 5 was written to justify.

Every amplitude read off a synthetic and every time read off its peak is a joint statement about the rock and the wavelet. Without a frequency beside it, the reader cannot tell whether your number disagrees with theirs because one of you made an error or because you ran different experiments on identical rock.

Apply it to your own notes. "Peak amplitude 0.1573149710893631 at 1580 ms TWT" fails the check. "Peak amplitude 0.1573149710893631 at 1580 ms TWT, 15 Hz Ricker" passes it. The rule is the same one you already apply to a depth without a unit.

## Check four: does the reported peak time match the frequency it was measured at

Check three asks whether a frequency is present. This one asks whether it is the right frequency, and it catches a specific and common failure, which is a number copied from one run into a note about another.

On the teaching well the pairings are fixed. At 15 Hz the peak is 0.1573149710893631 at 1580 ms TWT. At 25 Hz it is 0.07300488650798798 at 1642 ms TWT. At 40 Hz it is 0.0362229160964489 at 1646 ms TWT. A record that reports 1646 ms TWT for a 15 Hz wavelet has crossed two runs, and because both halves of it are genuine numbers from this well there is nothing about either one that looks wrong in isolation.

The way to catch it is to check the pair rather than either member of it. Amplitude and time move together when the frequency changes, so a large amplitude sitting at a late time is an internal contradiction on this well.

## Check five: has the strongest amplitude been confused with the strongest reflector

The last check is the one that costs the most when it is missed.

The strongest reflection coefficient on the teaching well is 0.017688043415546417 in absolute value at 1582 ms TWT, and it does not move with frequency. The strongest amplitude moves to 1580, 1642 and 1646 ms TWT at 15, 25 and 40 Hz. At 15 Hz those two coincide within one sample, which is a coincidence of that bandwidth rather than a rule, and at the other two frequencies they are about 60 ms apart.

Read a tie record and ask which of the two it was hung on. If it was hung on the brightest event, the tie belongs to a bandwidth and will not survive reprocessing. If it was hung on a named impedance contrast, it belongs to the well.

Run the checks against the panel below, which shows the scan curve and lets you change the wavelet frequency.

{{panel:sl-shift-explorer}}

## Exercise

Take a tie record that says only "shifted 8 ms, looks good" and list every one of the five checks it fails, then rewrite it as a record that passes all five using the teaching exercise numbers. As a self-check: it fails check one because no search range is stated, check two because no correlation is given, check three because no wavelet frequency appears, check four because there is no peak reading to pair with a frequency, and check five because it does not say what feature the tie was hung on. Then state why a correlation of 0.621742 quoted on its own is not evidence that a tie is aligned.
