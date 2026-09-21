import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 Professional m02: The Full Annex B Form.
# Digest sections 15 (detected failures, the MTTR, the equivalent down times),
# 16 (the simplified forms as a special case), 17 (the MRT after a test) and
# 18 (imperfect proof test coverage).

q(1,
 "Add a dangerous detected rate of 2.8e-6 per hour to the EKULAMA channel, with an MTTR of 8 hours and a repair time after a test of 8 hours, all stated. Which channel equivalent down time comes back?",
 "1322.000000",
 ["1326.800000","1341.200000","1319.600000"],
 "The engine states the channel equivalent down time as lDU/lD (T1/2 + MRT) + lDD/lD MTTR, and on these inputs it prints 1322.000000 hours. 1319.600000 hours is the same channel with the repair time after a test set to zero. 1326.800000 and 1341.200000 hours come from that same sweep at 24 and 72 hours, so each answers a different repair time.")

q(3,
 "Half of the stated proof test interval is the down time the simplified forms would charge an undetected failure. What is that figure in hours?",
 "4380.000000",
 ["4404.000000","1370.000000","1322.000000"],
 "The full form section prints T1/2 as 4380.000000 hours, derived, and the point of the row is that detected failures pull the channel figure far below it. 1322.000000 hours is the channel equivalent down time that results. 1370.000000 hours is the same channel at a repair time after a test of a week. 4404.000000 hours belongs to the OBAGI valve at a perfect proof test.")

q(0,
 "What PFDavg does the engine return for that EKULAMA channel as a single channel, with its detected failures and its stated restoration times in place?",
 "0.005288000000",
 ["0.005256000000","0.010576000000","0.000298987176"],
 "The formula for a single channel is printed with every call as PFD = lD tCE, and lambdaD of 4e-6 per hour times 1322.000000 hours gives the 0.005288000000 the table prints. 0.005256000000 is the same channel with no detected failures at all. 0.010576000000 is the two out of two on these inputs, which is twice the single channel figure. 0.000298987176 is the redundant pair.")

q(2,
 "Run as a redundant pair on the same stated inputs, the call returns a second equivalent down time for the group. What figure is that?",
 "884.000000",
 ["665.000000","881.600000","888.800000"],
 "Both the 1oo2 and the 2oo3 carry 884.000000 hours here, because a group is charged T1/3 where a single channel is charged T1/2. 665.000000 hours appears only where a third channel has to fail as well. 881.600000 and 888.800000 hours are what the same pair shows once its repair time after a proof test is moved to zero and to 24 hours.")

q(3,
 "Vote that diagnostics bearing channel one out of two, on its stated beta factor of 0.05 and its stated betaD of 0.02. Which PFDavg results?",
 "0.000298987176",
 ["0.000296042728","0.000369505528","0.000264001209"],
 "The full form table prints 0.000298987176 for the 1oo2 on these inputs, of which 0.000263280000 is the undetected common cause term and the call is reported as common cause dominant. 0.000296042728 is the simplified pair with no detected failures and no repair time after a test. 0.000369505528 is the 2oo3 and 0.000264001209 is the three channel arrangement on the same inputs.")

q(1,
 "On those same stated inputs, what independent term does the two out of three carry?",
 "0.000105777528",
 ["0.000035259176","0.000263280000","0.000000448000"],
 "The equivalent down time table prints an independent term of 0.000105777528 for the 2oo3, which is three times the pair's because its formula carries 6 where the pair carries 2. 0.000035259176 is the pair's independent term. 0.000263280000 and 0.000000448000 are the undetected and detected common cause terms, which are identical across the two arrangements.")

q(2,
 "Which figure fills the undetected common cause column for that pair in the equivalent down time table?",
 "0.000263280000",
 ["0.000000448000","0.000035259176","0.000105777528"],
 "The table prints an undetected common cause term of 0.000263280000, which is the beta factor multiplied by lambdaDU and by T1/2 plus MRT, and it is the largest single piece of the pair's answer. 0.000000448000 is the detected common cause term on the same row, far smaller because it is multiplied by the MTTR alone. 0.000035259176 and 0.000105777528 are the independent terms of the pair and of the two out of three.")

q(0,
 "The redundant pair is held at an MTTR of 8 hours and the repair time after a proof test is swept. At a repair time of 168 hours, a week, what PFDavg comes back?",
 "0.000311851427",
 ["0.000304116193","0.000300267345","0.000298347613"],
 "The sweep prints 0.000311851427 at 168 hours, with a channel equivalent down time of 1370.000000 hours. 0.000304116193 is the 72 hour row, 0.000300267345 the 24 hour row and 0.000298347613 the row at a repair time of zero, which is the base the sweep is measured against.")

q(3,
 "Taken over the row where that repair time is zero, what does the same sweep print for the week long repair time?",
 "1.045262",
 ["1.019335","1.006435","1.002144"],
 "The derived column of the sweep reads 1.045262 at 168 hours. 1.019335 belongs to 72 hours, 1.006435 to 24 hours and 1.002144 to the 8 hours the channel is otherwise stated at. Each is a ratio against the same zero repair time row, so picking one of the shorter repair times understates what a week costs.")

q(2,
 "The vendored golden keeps one case where the repair time after a test is 168 hours and the MTTR is 8 hours. What PFDavg do the engine and the golden agree on there?",
 "0.000255485341",
 ["0.000298347613","0.000311851427","0.000300267345"],
 "That case exists because until the two restoration times differ a mix up between them cannot be seen, and the engine gives 0.000255485341 against the golden's own 0.000255485341. The other three are rows of the repair time sweep on the EKULAMA pair, which is a different set of inputs and a different subsystem.")

q(1,
 "OBAGI is one shutdown valve, stated at lambdaDU 9e-7 per hour, a proof test interval of 8760 hours, a repair time after a test of 24 hours and a lifetime of 87600 hours. At a proof test coverage of 0.8, what PFDavg does the engine return?",
 "0.011059200000",
 ["0.007511400000","0.005737500000","0.014607000000"],
 "The coverage table prints 0.011059200000 at a coverage of 0.8, with a risk reduction factor of 90.422454, and the band falls to 1 there. 0.007511400000 is the coverage 0.9 row and 0.005737500000 the coverage 0.95 row, both of which stay in band 2. 0.014607000000 is the coverage 0.7 row, which is further down the same table.")

q(0,
 "On that same valve, what channel equivalent down time does a proof test coverage of 0.95 give?",
 "6375.000000",
 ["8346.000000","4404.000000","1322.000000"],
 "The coverage table prints 6375.000000 hours at 0.95, because the engine splits every undetected down time as PTC (T1/(j+1) + MRT) + (1 - PTC)(T2/(j+1) + MRT). 8346.000000 hours is the 0.9 row and 4404.000000 hours is the perfect test row. 1322.000000 hours belongs to the EKULAMA channel with detected failures, which is a different subsystem entirely.")

q(3,
 "Two restoration times appear in these equations. What does each one restore?",
 "MRT is the restoration time after a proof test reveals a dangerous undetected failure, and MTTR is the restoration time of a detected failure.",
 ["MRT is the mean time between two proof tests on the same channel, and MTTR is the average time a maintenance team takes to reach the plant at all.",
  "MRT is the restoration time of a detected failure announced by diagnostics, and MTTR is the restoration time after a proof test reveals a hidden failure.",
  "MRT is the restoration time charged to the group of channels together, and MTTR is the restoration time charged to each channel of that group on its own."],
 "The repair time section states it plainly: MRT is the mean restoration time after a proof test reveals a dangerous undetected failure, and MTTR is the restoration time of a detected failure. One of the wrong answers swaps the two, which is exactly the mix up the golden's differing case exists to expose. Neither time is an interval between tests, and neither is charged by group or by channel.")

q(2,
 "At a proof test coverage of 0.7, how many times the perfect test figure does the OBAGI valve PFDavg reach?",
 "3.685286",
 ["1.235857","2.000000","1.045262"],
 "The coverage section prints 3.685286 times the perfect test's, derived, for a coverage of 0.7, which leaves 30.00 percent of the undetected failures waiting for the overhaul. 1.235857 is the two out of three over the pair on the EKULAMA channel. 2.000000 is the two out of two over the single channel. 1.045262 comes from the repair time sweep.")

q(1,
 "Once a proof test coverage below one is typed, which input stops being optional?",
 "The lifetime, and the engine names lifetimeHours when a coverage below one arrives without it.",
 ["The betaD, because an imperfect test leaves detected failures that a redundant call has to share out among its channels.",
  "The MTTR, because the uncovered failures wait for a restoration.",
  "The beta factor, because coverage is a common cause claim."],
 "The engine's own words are that the lifetime is required when proofTestCoverage is below 1, since the uncovered failures stay until the item is restored as new, and the lifetime must be at least the proof test interval. The MTTR is required when lambdaDD is above zero. The beta factor and betaD are required for redundant architectures, and none of the three has anything to do with coverage.")

emit(Q, '/root/hse-wip-lopa/banks/h3i_m02.json', expect_n=15)
finish()
