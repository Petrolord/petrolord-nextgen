# Depth and trajectory

Drilling days come from measured depth and trajectory together. Neither one on its own says how long a well takes, and a campaign ranked on depth alone will be ranked wrongly.

{{panel:ec-schedule-explorer}}

## One depth, three trajectories

| depth | trajectory | days | cost |
| --- | --- | --- | --- |
| 12000 ft | Vertical | 40 | 31000000 USD |
| 12000 ft | Deviated | 46 | 35650000 USD |
| 12000 ft | Horizontal | 53 | 41075000 USD |

The same hole depth spans 40 days to 53 days on trajectory alone. The cost follows the days, because every day bills the same.

## Complexity moves it again

At 12000 ft horizontal, low complexity returns 39 days, medium returns 53 and high returns 79. Medium gives back exactly the 53 days the trajectory row gives, so medium is what the engine assumes when nothing else has been said.

The spread is wide. The same hole is 39 days or 79 days on one word in one field.

## EGINA's four wells

| well | type | trajectory | measured depth | days |
| --- | --- | --- | --- | --- |
| EG-01 | Producer | Horizontal | 14200 | 61 |
| EG-02 | Producer | Deviated | 11600 | 45 |
| EG-03 | Water Injector | Deviated | 10800 | 42 |
| EG-04 | Producer | Vertical | 9400 | 34 |

The two deviated wells sit at 11600 ft and 10800 ft and take 45 and 42 days. EG-04 is the shallowest at 9400 ft and the quickest at 34 days. EG-01 is the deepest at 14200 ft and the longest at 61 days, and it is also the only horizontal well in the campaign, so two things are pushing it up at once.

The type column carries Producer and Water Injector, and it is a label for the reader. EG-03 is an injector and takes 42 days because it is 10800 ft and deviated.

## What three inputs can and cannot know

Depth, trajectory and complexity are all the day count has. The formation, the water depth, the number of hole sections, the rig's own history and the weather are absent from it, and complexity is where all of that has been compressed into one word.

That is why the spread of 39 days to 79 days on one 12000 ft horizontal well is the honest part of the answer. It is the range the engine cannot narrow without being told more, and choosing between those three words is a judgement somebody makes and should record.

## The mistake

Ranking wells by depth and expecting the days to follow. A 12000 ft horizontal well takes 53 days, more than EG-02's 45 days at 11600 ft, on less hole. A high complexity horizontal at that same 12000 ft takes 79 days, longer than any well EGINA actually drills, including EG-01's 61 days at 14200 ft.

The second mistake is comparing a well from one plan against a well from another without checking the trajectory and the complexity behind each. Two wells quoted at the same depth with different day counts are not evidence that one team drills faster. They may simply be two different wells.

## Exercise

Give the days for 12000 ft on each of the three trajectories, then for 12000 ft horizontal at low, medium and high complexity, and say which complexity the engine assumes by default. Then explain why EG-01 takes 61 days when EG-02 takes 45.
