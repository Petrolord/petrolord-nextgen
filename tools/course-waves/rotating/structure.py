# FC3 Rotating Equipment. Three tiers, six modules each, 26 lessons a tier.
# Panel ids: P the pump explorer (the two curves and the crossing, the power
# chain, the four regions), S the suction and changes explorer (NPSH available
# assembled from its three parts, the margin and its severities, a trim beside
# a speed change, parallel and series re-solved, the Hydraulic Institute
# factors), C the compressor explorer (the two staging limits and which
# governed, the train stage by stage with its cooling duty, the machine screen,
# the driver fuel, the domain limits).
#
# Titles carry COUNTS only, never a measurement.
#
# Engine, as REPAIRED by the FC3-0 wave (engines PR #197, vendored at
# 4fa37e6, twelve paths sha-identical with the engines branch, 68 gate tests
# green): engines/facilities/pumps.js (the Pump Station Designer: a
# least-squares head curve that reports its own conditioning and its droop, a
# system curve stated through a friction head at a flow, a duty point solved as
# their crossing and reporting the bracket and residual it finished on, the
# power chain, NPSH available and the margin rule, the affinity laws and the
# trim, machines in parallel and in series, the Hydraulic Institute viscosity
# correction and the four operating regions) and engines/facilities/
# compression.js (the Compressor Station Designer: the polytropic exponent, the
# stage count against both limits at the inlet the stages will really have, a
# stage with compressibility at both ends, a train with its interstage cooling
# duty, the machine screen, the driver fuel), over engines/production/
# gasProperties.js for the gas constant, the molecular weight of air, the
# Rankine offset, the Sutton pseudo-criticals and the DAK z factor, over
# engines/facilities/separatorSizing.js for the DAK validity window, and over
# lib/units/fieldUnits.js for the two derived power packagings.
#
# CUT 2026-09-16, after FC3-0. Four modules differ from the foundation plan
# because the engine they were planned against was repaired:
#   * Expert m05 was "What These Engines Accept and Should Not", five lessons
#     on unguarded inputs. Thirty-one of those inputs now return a named error,
#     so most of it described behaviour that no longer exists. It is now built
#     on digest Section 15: what a refusal IS, the bare-number contract, the
#     guards that used to share one sentence, and the validity window this
#     module imports from the module that declares it.
#   * Expert m03 was "the limit it can break". The train no longer breaks the
#     limit it was staged against, and the lesson the repair exposed is better:
#     a hotter intercooler approach is paid for in STAGES, and the
#     cooling-against-power trade reverses across a stage-count change.
#   * Professional m04 was written when the Pump studio showed two answers for
#     one change. Suite PR #491 labelled them as two questions, so the module
#     teaches the distinction between a crossing and an affinity map rather
#     than a disagreement between them.
#   * Associate m02 and m03 gain what the solve now reports about itself: the
#     conditioning behind a fit, an R squared that can be null, and a
#     convergence flag with a case that makes it false.
P = 'fc-pump-explorer'
S = 'fc-suction-explorer'
C = 'fc-compressor-explorer'
TIERS = {
 'beginner': [
  ('m01-what-these-engines-size', 'What These Engines Size, and What They Refuse', [
    ('l01-two-machines-and-two-modules', 'Two machines and two modules', 12, []),
    ('l02-where-this-package-stops', 'Where this package stops', 13, []),
    ('l03-a-refusal-is-a-returned-object', 'A refusal is a returned object', 13, [P]),
    ('l04-the-five-that-return-a-bare-number', 'The five that return a bare number', 12, [P]),
  ]),
  ('m02-two-curves-and-no-operating-point', 'Two Curves, and Why Neither Has an Operating Point', [
    ('l01-a-catalogue-is-four-points', 'A catalogue is four points', 12, [P]),
    ('l02-the-least-squares-quadratic', 'The least-squares quadratic', 13, [P]),
    ('l03-r-squared-and-when-it-is-null', 'R squared, and when it is null', 13, [P]),
    ('l04-the-conditioning-behind-the-fit', 'The conditioning behind the fit', 14, [P]),
    ('l05-the-droop-flag-and-what-reads-it', 'The droop flag, and what reads it', 13, [P]),
  ]),
  ('m03-the-duty-point-solved', 'The Duty Point, Solved', [
    ('l01-the-crossing', 'The crossing', 12, [P]),
    ('l02-the-report-the-solve-leaves-behind', 'The report the solve leaves behind', 13, [P]),
    ('l03-a-flag-that-can-come-out-false', 'A flag that can come out false', 14, [P]),
    ('l04-three-refusals-that-are-real-answers', 'Three refusals that are real answers', 13, [P]),
    ('l05-what-moves-the-point', 'What moves the point', 13, [P]),
  ]),
  ('m04-power-head-and-pressure', 'Power, Head and Pressure', [
    ('l01-hydraulic-brake-and-motor-input', 'Hydraulic, brake and motor input', 12, [P]),
    ('l02-head-belongs-to-the-machine', 'Head belongs to the machine and pressure to the fluid', 13, [P]),
    ('l03-two-packagings-measured', 'Two packagings measured out of the engine', 14, [P]),
    ('l04-one-water-density-twice', 'One water density, twice', 13, [P]),
  ]),
  ('m05-where-the-duty-landed', 'Where the Duty Landed', [
    ('l01-the-percentage-of-best-efficiency-flow', 'The percentage of best efficiency flow', 12, [P]),
    ('l02-the-four-bands', 'The four bands', 13, [P]),
    ('l03-both-sides-of-every-boundary', 'Both sides of every boundary', 13, [P]),
    ('l04-what-each-region-costs', 'What each region costs', 13, [P]),
    ('l05-the-note-that-names-its-own-limit', 'The note that names its own limit', 14, [P]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [P]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
 'intermediate': [
  ('m01-npsh-available', 'NPSH Available, From the Real Suction Side', [
    ('l01-the-pressure-head-over-the-vapour-pressure', 'The pressure head over the vapour pressure', 12, [S]),
    ('l02-the-static-column-and-the-friction', 'The static column and the suction friction', 13, [S]),
    ('l03-padding-the-drum', 'Padding the drum', 13, [S]),
    ('l04-a-liquid-already-flashing', 'A liquid already flashing', 14, [S]),
    ('l05-an-available-figure-decides-nothing-alone', 'An available figure decides nothing on its own', 13, [S]),
  ]),
  ('m02-the-margin-and-what-a-check-does-not-check', 'The Margin, and What a Check Does Not Check', [
    ('l01-the-margin-rule-measured', 'The margin rule, measured', 13, [S]),
    ('l02-where-the-floor-and-the-fraction-change-places', 'Where the floor and the fraction change places', 14, [S]),
    ('l03-the-three-severities', 'The three severities', 13, [S]),
    ('l04-a-verdict-needs-an-input', 'A verdict needs an input', 13, [S]),
  ]),
  ('m03-a-speed-change-and-a-trim', 'A Speed Change and a Trim Are Not the Same Thing', [
    ('l01-the-affinity-laws-as-a-subtraction', 'The affinity laws, printed as a subtraction', 13, [S]),
    ('l02-the-band-reported-without-comment', 'The band the engine reports without comment', 13, [S]),
    ('l03-the-trim-shortfall-ideal-beside-real', 'The trim shortfall, ideal beside real', 14, [S]),
    ('l04-the-efficiency-the-trim-implies', 'The efficiency the trim implies', 14, [S]),
    ('l05-two-boundaries-and-the-slack-that-holds-them', 'Two boundaries and the slack that holds them', 13, [S]),
  ]),
  ('m04-an-affinity-law-is-not-a-duty-point', 'An Affinity Law Applied to a Duty Point Is Not a New Duty Point', [
    ('l01-the-system-curve-did-not-move', 'The system curve did not move', 13, [S]),
    ('l02-factors-read-out-of-the-engine', 'Scaling factors read out of the engine', 13, [S]),
    ('l03-the-crossing-and-the-map', 'The crossing and the map, side by side', 14, [S]),
    ('l04-how-far-apart-they-get', 'How far apart they get', 13, [S]),
  ]),
  ('m05-two-pumps-and-a-water-curve', 'Two Pumps, and a Catalogue Curve That Is a Water Curve', [
    ('l01-parallel-adds-flow-at-equal-head', 'Parallel adds flow at equal head', 13, [S]),
    ('l02-series-adds-head-at-equal-flow', 'Series adds head at equal flow', 12, [S]),
    ('l03-a-count-is-a-number-of-machines', 'A count is a number of machines', 13, [S]),
    ('l04-the-hydraulic-institute-correction', 'The Hydraulic Institute correction', 14, [S]),
    ('l05-where-the-correlation-stops', 'Where the correlation stops', 13, [S]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [S]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
 'advanced': [
  ('m01-a-stage-is-not-a-pump', 'A Stage Is Not a Pump', [
    ('l01-the-polytropic-exponent', 'The polytropic exponent against the isentropic one', 13, [C]),
    ('l02-the-discharge-temperature-that-follows', 'The discharge temperature that follows', 13, [C]),
    ('l03-compressibility-at-both-ends', 'Compressibility at both ends', 13, [C]),
    ('l04-two-heads-so-neither-is-quoted-as-the-other', 'Two heads, so neither is quoted as the other', 14, [C]),
    ('l05-an-identity-is-not-a-check', 'An identity is not a check', 14, [C]),
  ]),
  ('m02-the-stage-count-and-the-limit-that-governs', 'The Stage Count, and the Limit That Governs', [
    ('l01-the-equal-ratio-rule', 'The equal-ratio rule', 12, [C]),
    ('l02-tested-at-the-inlet-the-stages-have', 'The temperature limit, tested at the inlet the stages have', 14, [C]),
    ('l03-which-limit-governed', 'Which limit governed', 13, [C]),
    ('l04-the-twelve-stage-cap', 'The twelve-stage cap', 13, [C]),
    ('l05-a-refusal-that-carries-its-evidence', 'A refusal that carries its evidence', 14, [C]),
  ]),
  ('m03-the-train-and-what-buys-the-stages', 'The Train, Its Cooling, and the Limit That Buys the Stages', [
    ('l01-equal-ratios-chained', 'Equal ratios chained', 12, [C]),
    ('l02-cooling-as-an-exchanger-duty', 'Interstage cooling as an exchanger duty', 13, [C]),
    ('l03-moving-the-approach-across-the-suction', 'Moving the approach across the suction', 14, [C]),
    ('l04-a-hotter-approach-is-paid-in-machines', 'A hotter approach is paid in machines', 14, [C]),
    ('l05-the-trade-that-reverses', 'The trade that reverses', 13, [C]),
  ]),
  ('m04-the-machine-the-driver-and-the-fuel', 'The Machine, the Driver and the Fuel', [
    ('l01-actual-inlet-volume', 'Actual inlet volume', 12, [C]),
    ('l02-the-four-screening-branches', 'The four screening branches', 13, [C]),
    ('l03-fuel-out-of-the-stream-compressed', 'Fuel out of the stream being compressed', 13, [C]),
    ('l04-the-heat-rate-the-first-law-refuses-below', 'The heat rate the first law refuses below', 14, [C]),
  ]),
  ('m05-what-a-refusal-is', 'What a Refusal Is, and Where Each Guard Turns Over', [
    ('l01-an-object-carrying-an-error', 'An object carrying an error', 13, [C]),
    ('l02-the-bare-number-contract', 'The bare-number contract', 14, [C]),
    ('l03-four-faults-four-refusals', 'Four faults, four refusals', 13, [C]),
    ('l04-a-window-declared-in-one-place', 'A window declared in one place', 14, [C]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [C]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
}

if __name__ == '__main__':
    import re
    seen = set()
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        print(f'{tier}: {len(mods)} modules, {n} lessons')
        assert len(mods) == 6, tier
        assert n == 26, (tier, n)
        for mslug, mtitle, lessons in mods:
            for lslug, ltitle, q, panels in lessons:
                key = (tier, mslug, lslug)
                assert key not in seen, key
                seen.add(key)
                # Owner copy rule: no em dashes anywhere, in a module title or
                # a lesson title. FC2 shipped one and the manifest fix did not
                # reach the lesson text, so this is gated at the source.
                for text in (mtitle, ltitle):
                    assert chr(0x2014) not in text and '--' not in text, text
                    assert not re.search(r',\s+not\s+\w', text), text
                assert lslug.startswith(('l0', 'l1')), lslug
                assert mslug.startswith('m0'), mslug
                assert 9 <= q <= 15, (lslug, q)
    print('6 modules and 26 lessons in every tier, 78 lessons, no em dash and no contrastive in any title')
