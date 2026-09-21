import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 qra, Expert tier, module 02 "The Benefit of a Measure".
# Digest sections drawn on: 27 (the benefit, VPF, the EDIKAN firewall, the
# R2P2 footnote), 28 (the published CBA checklist example and its rounded
# print), the costBenefit refusals of section 3, and section 34.

q(2,
 "How does the engine build the yearly benefit of a measure that lowers the PLL by deltaPLL fatalities a year?",
 "deltaPLL times the VPF, plus the sum over the injury and ill health lines of expected cases a year times the value per case.",
 ["deltaPLL times the VPF alone, since injuries prevented are a matter for the ALARP note and never enter the arithmetic of the benefit.",
  "The VPF divided by deltaPLL, which gives the value of each fatality the measure prevents over a year of its operation.",
  "deltaPLL times the VPF times the DF, so that the gross disproportion factor is already carried inside the yearly benefit."],
 "The digest writes B = deltaPLL x VPF + the sum of expected cases a year times the value per case, and the checklist example carries three injury lines through exactly that sum. Leaving the injuries out drops real benefit. Dividing the VPF by deltaPLL inverts the product, and the DF belongs to the test that compares cost with benefit, never to the benefit itself."),

q(0,
 "The EDIKAN firewall lowers the PLL by 2e-3 a year with a VPF of 1000000 over a life of 20 years. Undiscounted, what are its fatality benefit a year and the present value of the benefit?",
 "2000.00 a year, and 40000.00 over the life.",
 ["2000.00 a year, and 34337.28 over the life, at the checklist limits.",
  "40000.00 a year, and 350000.00 over the life.",
  "2000.00 a year, and 2000.00 over the life."],
 "2e-3 times 1000000 is 2000.00 a year, and twenty year-end flows of it at no discount give 40000.00, as the digest prints. 34337.28 is the same benefit at a benefit rate of 0.015, a different convention from the undiscounted one asked for. 40000.00 is the life's benefit and 350000.00 the cost, and 2000.00 over the life forgets nineteen of the twenty years."),

q(3,
 "`costBenefit` is called for the EDIKAN firewall with every input but the VPF. What does the engine return?",
 "A refusal naming `vpf`, in the engine's own words: vpf: the value of preventing a fatality is required, above 0; HSE figures are illustrative only (HSE_ILLUSTRATIVE_VALUES)",
 ["A result computed at the 2003 checklist figure of 1336800, the most recent HSE value the engine exports, with a note in its basis block.",
  "A result computed at the R2P2 figure of 1000000, which is the engine's default VPF whenever the caller leaves the field out of a call.",
  "A result with a benefit of zero, so the verdict comes back GROSSLY_DISPROPORTIONATE for any measure that has a cost of its own."],
 "VPF has no default, and a call without one is refused with the message quoted, which is the engine's own. Both HSE figures are exported for illustration only, so the engine uses neither of them in place of a missing input. A benefit of zero would be the engine inventing a number, which it never does."),

q(1,
 "What status does the engine give the two HSE values it exports as HSE_ILLUSTRATIVE_VALUES, 1000000 and 1336800?",
 "Illustration only, each in GBP at its own price year, and neither a recommendation, because current HSE figures were not found on a live page.",
 ["Defaults, the older applied when the caller names the 2001 convention and the newer applied whenever a call arrives with no VPF at all, as the basis block of the result then records.",
  "Bounds, so that the engine refuses any VPF the caller gives that lies below 1000000 or above 1336800 at the prices of today.",
  "Current recommendations, 1336800 being the value HSE publishes now and 1000000 kept only for the reproduction of older work."],
 "The digest is plain: both figures are exported for illustration only, in GBP at their price year, a call without a VPF is refused, and current HSE figures were not found on a live page, so neither is a recommendation. They are not defaults, the engine bounds a VPF only by requiring it above 0, and the 2003 value is a dated figure."),

q(2,
 "R2P2 Appendix 3 paragraph 13 says that with a VPF of 1000000 a reduction of one in a hundred thousand in one person's individual risk is worth about 10. What does the engine give for deltaPLL 1e-5 over 1 year?",
 "A benefit of 10.00, which reproduces the published figure.",
 ["A benefit of 10.00 a year for each of 20 years, because the engine applies the EDIKAN life whenever a caller asks for one year.",
  "A benefit of 40000.00, because the paragraph's figure is carried at the full EDIKAN life of 20 years before it is printed.",
  "No benefit at all, because a single year of life is refused by the engine as too short a period to weigh against a cost."],
 "1e-5 times 1000000 is 10.00 for one year, which is the golden case the digest prints and the published margin note reproduced. The engine takes the life the caller states, so the EDIKAN life of 20 years has no part in this call, and 40000.00 is the EDIKAN benefit. A lifetime of 1 year is a whole number of years, 1 or more, which the engine accepts."),

q(3,
 "In the HSE CBA checklist example the fatality line is deltaPLL 0.0002 at a value of 1336800 a case over 25 years, undiscounted. What does the engine give for that line?",
 "6684.00",
 ["2072.00, the permanent incapacity line",
  "9283.50, the whole benefit",
  "512.50"],
 "0.0002 x 1336800 x 25 is 6684.00, and the checklist prints 6684. 2072.00 is the permanent incapacity line, 512.50 the serious injury line, and 9283.50 the total of all four lines, so each is a real figure from the example read against the wrong question."),

q(0,
 "The checklist's permanently incapacitating injury line carries 0.0004 cases a year at 207200 a case over 25 years. What benefit does that line add over the life?",
 "2072.00, which is also what the checklist prints.",
 ["15.00, the slight injury line.",
  "6684.00, the fatality line, which the ICAF counts.",
  "9283.50, the whole benefit of the example."],
 "0.0004 x 207200 x 25 is 2072.00, and the checklist prints 2072. 15.00 and 6684.00 are the slight injury and fatality lines, and 9283.50 is the total of all four lines. A benefit line is cases a year times value per case times years, undiscounted here."),

q(1,
 "The checklist's serious injury line comes out at 512.50 in the engine, and the checklist prints 512. What does the difference show?",
 "That the source rounded its printed figure, a property of the SOURCE, while the engine carries the exact product of the stated inputs.",
 ["That the engine applies a small discount to injury lines which the undiscounted checklist leaves out, so the two differ by half a unit.",
  "That the engine mistranscribed the serious injury value per case, which the checklist prints as 20500 and the golden reads differently.",
  "That the checklist counts whole cases only, so a fraction of a serious injury in a year is dropped before the value is applied."],
 "0.001 x 20500 x 25 is 512.50 exactly, and the checklist prints 512: the difference is the source's rounding, which the course describes as a property of the source. The example is undiscounted in both, the golden uses 20500 as printed, and expected cases a year need not be whole, as the stated 0.001 shows."),

q(2,
 "What total benefit does the engine give for the whole checklist example, and what does the checklist print?",
 "9283.50 in the engine, printed 9283 in the checklist, the half coming from the serious injury line.",
 ["9283 in both, because the engine rounds every money figure to a whole unit before it adds the lines, as the checklist does.",
  "92835.00 in the engine, printed 93000 in the checklist, because the total is carried at the DF of 10 the example uses throughout.",
  "6684.00 in the engine, printed 6684 in the checklist, because the fatality line is the whole of the benefit a checklist counts."],
 "The four lines, 6684.00, 2072.00, 512.50 and 15.00, sum to 9283.50, and the checklist prints 9283. The engine rounds nothing before summing. 92835.00 and 93000 are the largest reasonable cost at DF 10, computed and printed, which is a different quantity from the benefit. The fatality line alone ignores the three injury lines."),

q(3,
 "The checklist prints the largest reasonable cost of its measure at DF 10 as 93000. What does the engine compute from the stated inputs?",
 "92835.00, which is DF 10 times the total benefit of 9283.50.",
 ["93000, because the engine multiplies the printed total 9283 by 10 and rounds the answer up to the nearest thousand as the source does.",
  "9283.50, because the engine reports the benefit and leaves the multiplication by the DF to the analyst who reads the result.",
  "The fatality line of 6684.00 times the DF of 10, since the engine's limit counts no injury line at all."],
 "The engine returns DF times the present value of the benefit, 10 x 9283.50 = 92835.00, from the inputs. The checklist's 93000 is a rounded print, 9283.50 is the benefit alone, a product built on the printed total would inherit the source's rounding, which the engine never reads, and the fatality line alone drops the injury lines the benefit includes."),

q(0,
 "A cost of exactly the printed 93000 is weighed against the checklist measure at DF 10. What verdict does the engine return, and what does it teach?",
 "GROSSLY_DISPROPORTIONATE, by 165.00, an artefact of the source's rounding, so an ALARP note computes from the inputs and never from a rounded figure.",
 ["NOT_GROSSLY_DISPROPORTIONATE, because 93000 is the checklist's own printed limit and a cost at the limit belongs to the lower band.",
  "NOT_GROSSLY_DISPROPORTIONATE with `atBoundary` true, because the snap of 1e-9 relative absorbs a difference as small as 165.00.",
  "GROSSLY_DISPROPORTIONATE, by the half unit that separates the printed total benefit of 9283 from the computed 9283.50."],
 "The computed limit is 92835.00, so 93000 lies above it by 165.00 and the engine returns GROSSLY_DISPROPORTIONATE. The checklist meant \"in the region of\", and the verdict is an artefact of its rounding. The lower band applies at the computed limit, the snap is far narrower than 165.00, and the half unit on the benefit becomes 165.00 only after the DF of 10 and the rounding up of the print."),

q(1,
 "The checklist table prints the permanent incapacity value mistyped with an extra digit. Which figure does the course use, and why?",
 "207200, because the checklist's own worked example uses 207,200 and the golden does too.",
 ["The mistyped table value, because a published table outranks the arithmetic of a worked example that sits under it.",
  "Both, running the example twice and quoting whichever verdict is the more favourable to adopting the measure being weighed.",
  "Neither, since a value printed two ways is withheld and the permanent incapacity line is dropped from the benefit."],
 "The digest notes the table's mistyped value and says the checklist's worked example uses 207200, as the golden does, so that is the figure the course carries, and it reproduces the printed 2072. Choosing the more favourable verdict is not a method, and dropping the line throws away a benefit whose value the example itself confirms."),

q(2,
 "A caller describes a measure that RAISES the PLL by passing a negative deltaPLL. What does the engine return?",
 "A refusal, in its own words: deltaPllPerYr: must be the reduction in PLL, 0 or more fatalities per year (a measure that raises risk has no benefit to weigh)",
 ["A negative benefit, so the cost to benefit ratio comes back negative and the verdict is read as GROSSLY_DISPROPORTIONATE.",
  "A benefit computed on the magnitude of deltaPLL, since the engine takes the absolute value of any reduction it is handed.",
  "A verdict of NOT_GROSSLY_DISPROPORTIONATE, because a measure with no benefit carries no disproportion to weigh at all."],
 "The engine refuses a negative deltaPLL with the message quoted, which is its own. It never computes a negative benefit or ratio, it never silently flips a sign, and a verdict needs a benefit to weigh, which a measure that raises individual risk does not have."),

q(3,
 "The two HSE VPF figures carry price years. What does the engine's export say about each?",
 "1000000 is about GBP 1 000 000 at 2001 prices from R2P2, and 1336800 is the 2003 Q3 checklist fatality value, times 2 for cancer.",
 ["1000000 is the 2003 Q3 checklist value and 1336800 the R2P2 figure uprated to 2001 prices by the benefit growth of 4 percent a year.",
  "Both are 2003 figures, one for workers and one for the public, matching the two tolerability presets the engine carries.",
  "Both are current figures, with 1336800 applying to fatalities from fire and 1000000 to fatalities from a toxic release."],
 "The export's sources are verbatim in the digest: R2P2 (2001) Appendix 3 para 13, about GBP 1 000 000 at 2001 prices, and the CBA checklist (2003 values), fatality GBP 1,336,800, times 2 for cancer. The years are not swapped, the two figures do not map to the worker and public presets, and neither is current."),

q(0,
 "The checklist example is worked undiscounted over 25 years. Which call through `costBenefit` reproduces its benefit?",
 "deltaPLL 0.0002, a VPF of 1336800, the three injury lines as other harms, a life of 25 years and every rate left at its default of zero.",
 ["deltaPLL 0.0002, a VPF of 1336800 and a life of 25 years, with the injury lines left out because the engine counts fatalities alone.",
  "deltaPLL 0.0002, a VPF of 1000000 and a life of 25 years, since the R2P2 figure is the one the engine applies to the checklist at all times.",
  "deltaPLL 0.0002, a VPF of 1336800 and a life of 25 years, with the checklist limits of 0.015 on benefits and 0.035 on costs."],
 "Every rate defaults to zero, which is undiscounted as in the checklist example, and the injury lines enter as other harms, which is how the engine reaches 9283.50. Leaving the injuries out gives the fatality line alone, 6684.00. The checklist values its fatality at 1336800, and the 2003 rate limits belong to a discounted convention the example does not use."),

emit(Q, '/root/hse-wip-qra/banks/h5a_m02.json', expect_n=15)
finish()
