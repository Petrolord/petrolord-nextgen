import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, Expert tier, module 02 "Imperfect Proof Testing".
# Digest sections drawn on: 27 (imperfect coverage, the floor and the lifetime
# cap), and the proofTestCoverage and lifetimeHours refusals of section 3.

q(1,
 "A proof test reveals only a fraction of the dangerous undetected failures. Where do the rest of them wait, on the engine's treatment?",
 "They stay until the item is restored as new at the lifetime T2, so the uncovered share is averaged over the lifetime.",
 ["They are revealed at the next proof test like every other dangerous undetected failure, so coverage works out as a small correction to the interval and nothing more.",
  "They are charged against the MTTR, since a failure the test missed is found by the diagnostics soon after.",
  "They are dropped, because a failure no test reveals cannot be counted in an average."],
 "The engine's declared choice is that uncovered failures stay until the item is restored as new, which is why a coverage below one has to arrive with a lifetime. Treating them as revealed at the next test would make coverage a small correction and would remove the floor entirely. They are undetected failures, so the MTTR does not apply, and dropping them would understate the PFDavg."),

q(0,
 "What is the FLOOR of a partially tested subsystem, in the sense the engine uses when it reports one?",
 "The PFDavg the subsystem approaches as the proof test interval goes toward zero, with every other input held, so it is what no interval can reach below.",
 ["The lowest PFDavg reached anywhere in the sensitivity sweep the analyst ran.",
  "The PFDavg at the lifetime, which is the longest interval worth asking about.",
  "The lowest PFDavg any coverage could produce on that subsystem."],
 "The floor is the PFDavg as T1 goes to zero: the uncovered failures stay down for half the lifetime on average whatever the test interval. A sweep only samples intervals, the lifetime is the other end of the range entirely, and the floor is quoted at one stated coverage and moves when the coverage moves."),

q(3,
 "The OBAGI shutdown valve is read at five coverages against a target of 0.02. What floor does the engine report at a coverage of 0.7?",
 "0.011847600000",
 ["0.007905600000, which is the floor the engine reports at a coverage of 0.8",
  "0.003963600000, which is the floor the engine reports at a coverage of 0.9",
  "0.001992600000, which is the floor the engine reports at a coverage of 0.95"],
 "The printed floor at a coverage of 0.7 is 0.011847600000. 0.007905600000, 0.003963600000 and 0.001992600000 are the floors at coverages of 0.8, 0.9 and 0.95, each one row off. The floor rises as the coverage falls, because more of the failures are waiting for the overhaul."),

q(2,
 "At a perfect proof test the same valve still has a floor, of 0.000021600000. What is left in the answer once the interval has gone to zero?",
 "The restoration time after each test, which is charged on every undetected failure however often the test runs.",
 ["The detected failures sitting down for their restoration time, which no proof test interval ever touches on any channel at all.",
  "The uncovered share of the undetected failures, which is small at a perfect test and never quite reaches zero on real equipment.",
  "A numerical residue of the bisection, which converges to one part in a trillion and leaves a small remainder behind it."],
 "At a coverage of one there is no uncovered share at all, so the floor of 0.000021600000 is only the MRT after each test. This channel has no detected failures, so no MTTR term is in the answer, and the floor is an exact limit of the form, which the search plays no part in."),

q(1,
 "Take the floor from a perfect test to a coverage of 0.95 on that valve. What happens, and what does the step teach?",
 "It goes from 0.000021600000 to 0.001992600000, so a small hole in the procedure buys a large floor because the failures behind it wait half a lifetime.",
 ["It goes from 0.000021600000 to 0.003963600000, which is in fact the floor the engine prints one row further down the table, at a coverage of 0.9 on the same valve.",
  "It does not move, because the floor is set by the restoration time and the coverage only moves the answer at long intervals.",
  "It falls, because a coverage below one lets more of the failures be found at the overhaul."],
 "The printed floors are 0.000021600000 at a perfect test and 0.001992600000 at a coverage of 0.95; 0.003963600000 belongs to a coverage of 0.9, one row further down. The uncovered share is multiplied by half the lifetime, which is far longer than the restoration time a perfect test leaves behind, so five percent of the failures moving into that share dominates the answer. The floor rises as the coverage falls and is not fixed by the restoration time alone."),

q(2,
 "The floor of that valve at a coverage of 0.7 can be built from its stated inputs. Which expression gives it?",
 "lambdaDU (1 - PTC)(T2/2 + MRT) + lambdaDU PTC MRT, which comes to 0.011847600000 and carries no T1 at all.",
 ["lambdaDU (1 - PTC)(T1/2 + MRT) + lambdaDU PTC MRT, which is the same split with the interval in place of the lifetime in the uncovered term.",
  "lambdaDU (T2/2 + MRT), which charges every undetected failure against the lifetime whatever the coverage happens to be.",
  "lambdaDU PTC (T2/2 + MRT), which charges the covered share of the failures against the lifetime."],
 "The course derives the floor as lambdaDU (1 - PTC)(T2/2 + MRT) + lambdaDU PTC MRT and states that it is the engine's floor to the digit. Nothing about T1 appears in it, which is exactly why no interval reaches below it. Putting T1 into the uncovered term, or charging every failure or the covered share against the lifetime, all misplace the split."),

q(1,
 "The same valve is searched against a target of 0.02 at a coverage of 0.9. What longest interval does the engine return?",
 "39596.049383 hours, which is 4.520097 years",
 ["42122.573099 hours, or 4.808513 years, which is what a coverage of 0.95 supports against the same target",
  "33595.555556 hours, or 3.835109 years",
  "25880.634921 hours, or 2.954410 years"],
 "At a coverage of 0.9 the engine returns 39596.049383 hours, 4.520097 years. 42122.573099 hours belongs to a coverage of 0.95, 33595.555556 hours to 0.8 and 25880.634921 hours to 0.7, so each wrong figure is the right search at the wrong coverage."),

q(3,
 "With a perfect proof test, how many years may that valve run between tests before it passes the target of 0.02?",
 "5.068087 years",
 ["5.305186 years, which the engine returns for the IDU valves against a target of 0.01",
  "4.808513 years, which is the answer at a coverage of 0.95",
  "The whole ten year lifetime, because a perfect test has no uncovered share to cap it"],
 "A perfect test gives 44396.444444 hours, 5.068087 years. 5.305186 years is the IDU valve answer against a target of 0.01 and belongs to another subsystem. 4.808513 years is the coverage 0.95 row. The lifetime would come back only with the state CAPPED_AT_LIFETIME, and this search found a crossing."),

q(0,
 "A target is set below a partially tested subsystem's floor. What does the longest interval search return, and what moves the floor?",
 "No interval and the state UNACHIEVABLE, and only a better test or a shorter lifetime moves the floor, since more frequent testing of the same procedure moves nothing.",
 ["A very short interval with the state FOUND, since shortening the test is always the lever that reaches a tighter target.",
  "The lifetime with the state CAPPED_AT_LIFETIME, since the floor and the lifetime are the same bound under two names.",
  "A refusal naming the target field, since a target below the floor cannot be met."],
 "A target below the floor is UNACHIEVABLE whatever the interval, and the course names the two things that move a floor: a better test or a shorter lifetime. No finite interval exists, so FOUND is impossible, and the lifetime cap is a different case where the target IS met. A refusal is a finding about the call, and this call is well formed."),

q(2,
 "A 1oo1 at a coverage of 0.9 with a lifetime of 87600 hours meets a target of 0.01 even at the lifetime. What does the engine return, and why that number?",
 "The lifetime itself with the state CAPPED_AT_LIFETIME, because no interval longer than the lifetime is meaningful.",
 ["A very long interval with the state FOUND, because the bisection keeps going until the PFDavg rises to meet the target somewhere above the lifetime.",
  "No interval and the state UNACHIEVABLE, because a coverage of 0.9 leaves an uncovered share and an uncovered share always defeats a target.",
  "A refusal, because a search whose target is met everywhere has no crossing for the engine to report."],
 "The target is met at the lifetime, so the engine reports the lifetime and the state CAPPED_AT_LIFETIME. Searching past the lifetime would return a combination the same engine declines, since it refuses a lifetime shorter than the interval. The target is met, so UNACHIEVABLE is wrong, and the call itself is well formed so nothing is refused."),

q(3,
 "A site runs a partial stroke test at a short interval and a full test at the overhaul. How does the engine model that scheme?",
 "As one coverage split: the covered part sees the short interval and the uncovered part sees the overhaul, and it models nothing more elaborate.",
 ["As two separate test tasks at two separate intervals, each one carrying its own coverage, summed together into a single equivalent down time for the channel.",
  "As a coverage that improves with each test, so that the uncovered share shrinks over the life of the equipment and the floor falls with it.",
  "As a shorter effective lifetime, since a partial test at a short interval restores part of the item as new at that interval."],
 "The engine models exactly one split, the covered part against the interval and the uncovered part against the lifetime, and nothing more elaborate. Two tasks at two intervals, an improving coverage and a shortened lifetime are all schemes an analyst must reduce to one coverage, one interval and one lifetime before the engine sees them, and the reduction is the analyst's argument to record."),

q(0,
 "A subsystem is typed with a proof test coverage below one and no lifetime. What does the engine say?",
 "It declines and names the field, in its own words: lifetimeHours: is required when proofTestCoverage is below 1: the uncovered failures stay until the item is restored as new",
 ["It assumes a ten year lifetime, which is the ordinary assumed life of process instrumentation.",
  "It treats the uncovered failures as revealed at the next proof test and returns a result.",
  "It returns a result with a warning that the uncovered share could not be averaged."],
 "The message above is the engine's own, and it names the field `lifetimeHours`. A refusal replaces the result entirely, so no assumed lifetime is supplied and no warned result comes back. The engine invents no number, which is why the lifetime has to be typed whenever coverage is below one."),

q(1,
 "A lifetime shorter than the proof test interval is typed. Which reply does the engine give, word for word?",
 "lifetimeHours: must be at least the proof test interval",
 ["lifetimeHours: is required when proofTestCoverage is below 1: the uncovered failures stay until the item is restored as new",
  "proofTestIntervalHours: must be no longer than the lifetime, so the two inputs were swapped before the PFDavg was computed",
  "lifetimeHours: must be a time above 0 hours"],
 "That is the engine's own refusal, and it names `lifetimeHours`. The message saying a lifetime is required answers a coverage below one with no lifetime at all. The engine swaps nothing and computes nothing, because a refusal replaces the result and carries no number of its own."),

q(2,
 "A proof test coverage of zero arrives. Which field does the engine name, and what range does it give?",
 "proofTestCoverage, which must lie in (0, 1]",
 ["proofTestCoverage, which must lie in [0, 1], so a coverage of zero is accepted and every undetected failure waits for the lifetime",
  "lifetimeHours, because a coverage of zero sends every undetected failure to the lifetime and the lifetime must then be checked first",
  "proofTestIntervalHours, which must be above 0"],
 "The engine refuses in its own words, proofTestCoverage: must lie in (0, 1], so a coverage has to lie above zero and no higher than one. Nothing is accepted and no other field is named, because the coverage is checked on its own before the lifetime and a refusal replaces the result."),

q(1,
 "Shortening the proof test interval is the cheapest lever an operating site has. Why does imperfect coverage make that lever run out?",
 "The covered share does improve as the interval shortens, while the uncovered share does not move at all, so the PFDavg approaches a floor and never approaches zero.",
 ["The engine caps the shortest interval it will search at a fraction of the lifetime, so a site cannot drive the interval as far down as it would like to.",
  "Each test carries its own restoration time, so testing more often raises the MTTR term faster than it lowers the undetected term.",
  "The beta factor rises as the interval falls, so a shorter interval buys less common cause reduction than it appears to buy."],
 "The uncovered failures are waiting for the overhaul and the proof test never touches them, so driving the interval toward zero leaves the floor. The engine puts no lower cap on the interval it will search, the restoration time after a test is part of the floor and does not grow with testing, and the beta factor is a typed input that the interval does not move."),

emit(Q, '/root/hse-wip-lopa/banks/h3a_m02.json', expect_n=15)
finish()
