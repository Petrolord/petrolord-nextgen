import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Expert m02, Marching a Pressure Drop. Digest section 14, the march block.
# Lessons l01 one step is not enough, l02 the midpoint march, l03 how many
# steps are enough, l04 the temperature the gas arrives at. 15 questions.

q(1, "Multiplying the inlet coefficient by the whole pressure drop and subtracting the result from the inlet temperature is one rectangle under a curve, drawn at its left-hand edge. What does that assume?",
 "That the slope holds all the way down, when the coefficient depends on both the pressure and the temperature the march is changing.",
 ["That the gas behaves ideally over the interval, since only an ideal gas has a coefficient that can be treated as a single figure over a finite drop.",
  "That the arrival temperature is below the inlet temperature, which is the one thing a let-down guarantees and the only thing the rectangle needs.",
  "That the heat capacity is constant across the drop, which is the term the rectangle holds fixed while everything else moves."],
 "The coefficient at the inlet on the AGBADA let-down is 0.061607962 and at the last half step it is 0.071833233. One rectangle drawn at the first cannot be the area under a curve that ends at the second.")

q(3, "The same routine over the same let-down at one step and at twenty steps gives two pairs of answers. Which pair is the one-step answer?",
 "36.271170079 degF of cooling and an arrival of 59.728829921 degF.",
 ["36.316483434 degF of cooling and an arrival of 59.683516566 degF, which is what the module returns at its own default step count.",
  "36.306809467 degF of cooling, arriving at 59.693190533 degF.",
  "36.316559445 degF of cooling, which the reference march reports."],
 "Twenty steps is the module default and gives 36.316483434 degF of cooling. Two steps give 36.306809467. The reference march at twenty thousand steps reports 36.316559445 degF.")

q(2, "The one-step answer is 0.998750174391 of the reference cooling. What does the lesson draw from a figure that close?",
 "That one step is not wildly wrong on this let-down, and that it was wrong by an amount nobody had measured until the march was run at several counts.",
 ["That the march is unnecessary on a drop of this size, because a ratio this close to one means the integration has already converged at a single step.",
  "That the error at one step scales with the pressure drop, so a reader can predict it on any other let-down from this single ratio.",
  "That the default of twenty steps is too fine for a screening pass and should be lowered until the ratio moves."],
 "Having quoted the error you can decide that one step is enough for a screening pass, which is a decision made with evidence. An error nobody measured is the one that shows up on a different stream at a different pressure with a different size.")

q(0, "Within each step the module evaluates the coefficient at a half-step pressure and a half-step temperature. Which of the two has to be estimated before the full step can be taken, and why?",
 "The temperature, because the gas is cooling as it goes and the value at the middle of a step is not known until the slope at the start has been used.",
 ["The pressure, because the step size in pressure is only fixed once the number of steps has been divided into the total drop.",
  "Neither, because both are known at the start of the step from the inlet state and the step size.",
  "Both, because the midpoint values of a Runge-Kutta step are found by iterating each step until the estimate at the middle and the estimate at the end agree with one another."],
 "The half-step pressure is known before the step begins. The temperature needs an estimate from the slope at the start, and taking both is what makes the step second order in the step size.")

q(2, "A march evaluates the coefficient at the midpoint pressure of each step while holding the temperature the step began at. What has that march given up?",
 "The second order, leaving a first-order march that has the shape of a midpoint step without the behaviour of one.",
 ["Nothing measurable, because the temperature moves far less across a step than the pressure does and the coefficient is far more sensitive to the pressure.",
  "The ability to report a mean coefficient, because a mean needs the temperature at both ends of every step and this march only ever has one of them.",
  "Its refusal on a cold inlet, because the guard that stops the march reads the half-step temperature and that march never forms one."],
 "Both halves of the half step move and the engine moves both. Taking the midpoint pressure alone is the obvious half of the idea and it is only half of it.")

q(1, "What does calling this march second order actually claim?",
 "That its error falls with the square of the step size, which is a property of the method rather than a prediction about any particular let-down.",
 ["That the answer is correct to two decimal places at the default step count, which is what the convergence table is run to confirm.",
  "That two coefficients are evaluated in every step, one at each end, and the answer is the average of the two.",
  "That the arrival temperature is second order in the pressure drop, so doubling the drop quadruples the cooling."],
 "How the claim behaves on this particular let-down is what the convergence table measures, and a table measured on one stream is not the claim itself.")

q(3, "The reference march at twenty thousand steps reports a cooling of 36.316559445 degF. What authority does that figure have?",
 "None beyond being far finer than anything a design pass would run, which is what a reference of this kind needs to be.",
 ["It is the converged limit of the identity, so it is the true cooling this gas undergoes on this let-down.",
  "It is the published golden for this let-down, which is why every other row in the convergence table is read against it rather than against the default.",
  "It is the engine checked against a second method, which is what makes it independent of the step count."],
 "It is the engine checked against its own arithmetic. An oracle tells you whether two roads reach the same place. This tells you whether you have walked far enough down one of them.")

q(0, "At the module default of twenty steps the cooling is 0.999997906978 of the reference, and at two hundred steps it is 0.999999979778. What has that table established?",
 "How close the module's own arithmetic is to the limit of its own arithmetic on this let-down.",
 ["That the identity being marched is the right identity for this gas, since an arithmetic converging this cleanly could not be converging on a wrong answer.",
  "That the compressibility correlation underneath the march suits this gas.",
  "That twenty steps is the right count for any let-down whatever its depth."],
 "A table this clean invites the wrong conclusion. Converging beautifully to a wrong answer is a thing numerical methods do very well, and the published cases are where the identity is answered.")

q(2, "The digest prints one ratio against the reference on every row of the convergence table and prints no comparison between one row and the next. What follows for a reader who wants to say how the column behaves?",
 "The statement is a reading taken from the rows, and dividing one row by the row above it produces a figure the engine never formed.",
 ["The column cannot be read at all until the ratios between successive rows are computed, which is the first thing to do with a convergence table.",
  "The ratios between rows are implied by the second-order claim, so a reader may quote a factor of four between successive rows without computing anything.",
  "The missing column is an oversight in the digest, and the figures needed to fill it are all on the page."],
 "Where the digest prints a table and no ratio, the two figures are not in a relationship this engine computes. Take the reading deliberately and say that you took it.")

q(1, "A march of 0 steps, a march of -5 steps and a march of 0.4 steps all come back refused. What does each message carry?",
 "The same required shape, a positive whole number of steps, with the value it was handed printed in each case.",
 ["A different required shape in each case, because a missing count, a negative count and a fractional count are guarded separately and worded separately.",
  "The message for the fractional case alone, since zero and a negative count are caught earlier by the pressure guard and share its wording.",
  "The step count it fell back to, so a caller can see that the march ran at the default rather than stopping."],
 "A fractional count is a different mistake from a missing one, and the value in the message is what shows a reader which they made. None of the three is quietly replaced by a default.")

q(0, "A let-down is asked for with an outlet pressure above the inlet, and then with the two pressures equal. What does the engine do with the second of those?",
 "It refuses it in the same way as the first, printing both pressures.",
 ["It returns the inlet temperature, since a march of zero length is a legitimate question with a trivial answer.",
  "It refuses it with a message about the step count, because equal pressures divide into steps of zero size.",
  "It answers with a cooling of zero and attaches a note that the drop was empty."],
 "A pair of equal pressures comes back as { error: \"a Joule-Thomson let-down needs the inlet above the outlet: 1180 against 1180 psia\" }. Neither case is treated as a zero-length march that quietly returns what it was given.")

q(3, "Letting the same gas down to 640.000000 psia cools it 36.316483434 degF, and letting it down to 8.000000 psia cools it 83.563953023 degF. Why is the deeper answer so far from proportional?",
 "The coefficient falls with the pressure the march is walking down, so the later steps of a deep let-down deliver less cooling per psi than the early ones.",
 ["The compressibility approaches one at the lower pressures, and a gas approaching ideality has no cooling left to give on the last part of the drop.",
  "The march holds its step count fixed, so a deeper drop is taken in larger steps and the integration loses accuracy as the outlet falls.",
  "The gas is colder in the later steps and the temperature squared in the numerator falls with it, which is the term that carries the whole reduction."],
 "At 60.000000 psia the cooling is 79.610443897 degF and at 25.000000 psia it is 82.271300233 degF. The last part of the drop is buying very little.")

q(1, "How should the three deeper outlet rows in that table be read?",
 "As three separate answers, each the same routine on the same gas with only the outlet pressure changed.",
 ["As a single curve, so that the arrival at any intermediate outlet pressure can be interpolated between the rows that bracket it.",
  "As a sequence in which each row is the continuation of the one above it, since the march to 25.000000 psia passes through 60.000000 psia on its way.",
  "As a convergence study in the outlet pressure, since the rows are approaching the arrival temperature a full expansion would reach."],
 "Each arrival is read on its own rather than scaled from the row above. A march to a deeper outlet is its own march from the same inlet.")

q(2, "What kills a march part way down, and what does the engine say about it?",
 "A cold inlet, and the refusal names the step it died at along with the pressure and the temperature the gas had reached.",
 ["A deep outlet, and the refusal names the outlet pressure that was asked for and the shallowest one that would have worked.",
  "A step count too low to resolve the drop, and the refusal names the count that would have carried it.",
  "A gravity the pseudo-criticals cannot carry, and the refusal names the gravity and the step the march had reached when it read it."],
 "The gas cools past the reduced temperature its own compressibility correlation is valid at, and the coefficient the next step needs cannot be formed. The same gas entering at 10.000000 degF and let down to 200.000000 psia is the case the digest prints.")

q(0, "That failed march hands back step 11 of 20, a pressure of 690.000000 psia and a temperature of -105.517249 degF. What do those three fields buy a reader?",
 "They say how far the march got and name the state it could not carry, which is what a choice between a warmer inlet and a shallower drop needs.",
 ["They say which of the two guards fired, since the pressure identifies the compressibility guard and the temperature identifies the water fit.",
  "They give the march a restart point, so a caller can resume from step 11 with a wider validity band and complete the drop.",
  "They bound the answer, since the temperature reached at step 11 is the coldest the gas could have arrived at had the march completed."],
 "The march was two thirds of the way down and the gas was already cold when the method ran out. A bare refusal would have said none of that.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/advanced/fc4a_m02.json', expect_n=15)
finish()
