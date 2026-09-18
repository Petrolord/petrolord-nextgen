# Where the customary time comes from

A depressuring study is almost always run to answer one question: is the vessel down inside the customary time. The customary figure is fifteen minutes. This engine has never heard of it.

{{panel:fc-blowdown-explorer}}

## A limit the engine does not hold

Nothing in this module carries fifteen minutes. There is no constant for it, no flag returned about it, and no verdict of any kind. The march returns 268.419002 s on AFIESERE, which is 4.473650 min, and stops. Comparing that against a limit is your act, on a limit you stated, for a case you chose.

That is the course thesis in its sharpest form. Every number this engine returns is the size or the duration that one chosen case demands, and the engine never chooses the case. Here it does not even hold the acceptance criterion.

The practical consequence is a discipline. Write down the limit you are judging against and where it came from, in the same place you write down the time, because the engine will not record it for you and a bare time in a report looks exactly like a passing time.

## The one limit the engine does hold

There is a time limit in this route, and it is a different kind of thing. The march refuses rather than marching forever, at 7199.999985603571 s, measured by bisecting on the engine's own behaviour.

Hand it an orifice too small to finish inside that budget and you get an object carrying `error` and the message `did not reach the end pressure inside the time limit: check the orifice size`. That is a refusal about the computation rather than a verdict about the design. The engine is saying it declined to keep integrating, and it names the input most likely to be at fault.

Those two limits are easy to confuse and they answer different questions. One is a customary engineering target you supply. The other is an internal budget past which this implementation will not go.

## What the module does with the question

The next three lessons do the thing properly. The time is read off a sweep of the orifice rather than asserted, the orifice that meets a stated time is found by bisecting on the engine's own answer rather than by rearranging a formula, and the cold end that comes with it is read from the same sweep.

That order matters. A time is a reading. An orifice is a solve. A temperature is a consequence. Treating all three as outputs of one call is how a reader ends up quoting the one the engine was least asked about.

## Exercise

State the customary depressuring time in words and say what this engine holds about it. Record the AFIESERE time in seconds and in minutes. Then record the internal time limit in seconds, quote the refusal that fires against it, and write two sentences distinguishing that limit from the customary one.
