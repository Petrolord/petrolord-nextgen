# No published worked example

{{panel:qr-societal}}

Much of this academy's arithmetic is validated against a published worked example: a source prints inputs and an answer, and the engine reproduces the answer. The F-N curve has no such example behind it. No source the engine read prints a worked F-N curve or a worked societal risk calculation, and the CCPS and HSE worked examples were not available. This lesson says what the engine does instead, and how you should speak about an F-N figure as a result.

## What is checked, and how

The curve is checked by self-consistency only, three ways:

| check | what it compares |
| --- | --- |
| a brute force count | F at every corner, recounted scenario by scenario |
| a second route | F on a grid of N, built independently of the corner list |
| the area identity | the area under the step curve against the sum of f times N |

On the JISIKE off-site set the area identity gives 0.000336000000 per year from the curve and 0.000336000000 per year from the sum of f times N. Every check agrees. What the checks prove is that the engine computes the quantity it declares, the frequency of N or more deaths, without an arithmetic slip. They cannot prove that the declared quantity is the one a published author would have printed, because no author printed one.

## How to speak about an F-N figure

A JISIKE value such as F(3) of 0.000049700000 per year is the engine's own figure, checked by self-consistency. It is never a published reproduction, and a report should never call it one. The honest sentence names the reading, "N or more", names the scenario set and its stated N values, and says the curve was checked against its own expected value.

## What is published

The criterion side is different. The Dutch line's three Bevi points are printed, and the engine's constants reproduce them exactly: at N = 10 the line gives 1e-5 per year, at N = 100 it gives 1e-7, and at N = 1000 it gives 1e-9. The R2P2 point, 50 or more deaths at one in five thousand a year, is printed in the source too. So a comparison has a published criterion on one side and a self-consistent curve on the other, and a report should say both halves plainly.

## Why the course still grades it

A capstone may grade an F-N figure because the engine's reading is declared and its arithmetic is checked three ways, so every learner who follows the declared reading reaches the same number. What a capstone never does is claim the number matches a textbook. The grade is for following the method, which is the part of the work a reviewer can reproduce.

## Exercise

Write the two sentences you would put in an assessment report beside the JISIKE curve's value of 0.000049700000 per year at N = 3: one saying what that figure is and how it was checked, and one saying what is published on the criterion side. Then check your sentences for any word that implies a published F-N reproduction, and remove it.
