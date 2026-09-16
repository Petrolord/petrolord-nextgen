# FC2 Line Sizing & Hydraulics. Three tiers, six modules each, 26 lessons a
# tier. Panel ids: L the liquid line explorer (regime, the three losses, the
# erosional limit, the bore sweep), G the gas line explorer (the four forms,
# the elevation group, the ceiling and the inverse solve, the marched
# profile), W the wall and pigging explorer (the code design factors, MAOP,
# line volume, the holdup sweep, and the domain limits).
#
# Titles carry COUNTS only, never a measurement.
#
# Engine, as REPAIRED by the FC2-0 wave (engines PR #196, vendored at NextGen
# 27de8d90, all eight paths sha-identical with the engines branch):
# engines/facilities/lineHydraulics.js (the Pipeline & Line Sizing Studio:
# Colebrook friction with a laminar branch, Darcy-Weisbach with the three
# losses kept apart, a marched liquid profile that refuses with its evidence
# attached, the four published gas transmission forms with the shared
# elevation adjustment, the outlet pressure bracketed at the pressure where
# the driving group vanishes, Barlow to B31.4 and B31.8 with the four
# location classes, and the pigging chain), over
# engines/production/chokePerformance.js for the API RP 14E erosional limit
# and engines/production/pipeSchedule.js for the bores and the roughness
# catalogue.
#
# RE-CUT 2026-09-16 after FC2-0. Two modules changed subject because the
# defects they were built on were repaired:
#   * Expert m04 was "What It Accepts and Should Not", five lessons on
#     unguarded inputs. Twenty-one of those inputs now return a named error,
#     so four of the five described behaviour that no longer exists. It is
#     now built on digest Section 16: what a refusal IS, the contract, the
#     messages, the boundary either side of every guard, and the two things
#     the engine still accepts and should not.
#   * Professional m04's l02 and l04 described a bracket that was wrong and a
#     descent that was mishandled. Both are now correct, and the ceiling the
#     bracket really ends at is the most interesting physics in the course,
#     so the module is re-cut around it, with the ASCENT promoted to its own
#     lesson because it is the commoner case and the one that was wrong by
#     the widest margin.
#   * Professional m05 l04 was "Where a line dies", written when the traverse
#     marched past zero absolute and returned a number. It now refuses and
#     hands back the evidence, which is a better lesson under a new title.
L = 'fc-liquid-explorer'
G = 'fc-gasline-explorer'
W = 'fc-wall-pig-explorer'
TIERS = {
 'beginner': [
  ('m01-what-a-line-sizing-engine-does', 'What a Line Sizing Engine Does', [
    ('l01-one-line-one-answer', 'One line, one answer', 12, []),
    ('l02-sizing-is-not-networking', 'Sizing is not networking', 13, [L]),
    ('l03-what-it-refuses-to-guess', 'What it refuses to guess', 13, [L]),
    ('l04-the-units-it-works-in', 'The units it works in', 12, [L]),
  ]),
  ('m02-velocity-reynolds-and-friction', 'Velocity, Reynolds and Friction', [
    ('l01-a-bore-is-an-area', 'A bore is an area', 12, [L]),
    ('l02-the-reynolds-number-in-field-units', 'The Reynolds number in field units', 13, [L]),
    ('l03-the-laminar-branch', 'The laminar branch', 13, [L]),
    ('l04-colebrook-and-what-it-solves-for', 'Colebrook, and what it solves for', 14, [L]),
    ('l05-the-band-with-no-correlation', 'The band with no correlation', 14, [L]),
  ]),
  ('m03-three-losses-kept-apart', 'Three Losses Kept Apart', [
    ('l01-the-velocity-head', 'The velocity head', 12, [L]),
    ('l02-friction-along-the-pipe', 'Friction along the pipe', 13, [L]),
    ('l03-fittings-as-a-resistance-sum', 'Fittings as a resistance sum', 13, [L]),
    ('l04-elevation-is-not-friction', 'Elevation is not friction', 14, [L]),
    ('l05-the-gradient-and-what-it-averages', 'The gradient, and what it averages', 13, [L]),
  ]),
  ('m04-the-erosional-limit', 'The Erosional Limit', [
    ('l01-c-over-root-rho', 'C over root rho', 12, [L]),
    ('l02-three-published-rows-and-a-practice', 'Three published rows and a practice', 13, [L]),
    ('l03-the-largest-rate-a-bore-can-carry', 'The largest rate a bore can carry', 13, [L]),
    ('l04-a-limit-that-is-not-a-pressure-drop', 'A limit that is not a pressure drop', 12, [L]),
  ]),
  ('m05-choosing-a-bore', 'Choosing a Bore', [
    ('l01-the-same-duty-in-every-size', 'The same duty in every size', 13, [L]),
    ('l02-a-schedule-is-two-numbers', 'A schedule is two numbers', 12, [L]),
    ('l03-velocity-against-pressure-drop', 'Velocity against pressure drop', 13, [L]),
    ('l04-what-a-recommendation-ranks', 'What a recommendation ranks', 14, [L]),
    ('l05-roughness-is-not-the-fluid', 'Roughness is not the fluid', 13, [L]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [L]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
 'intermediate': [
  ('m01-a-gas-line-is-not-a-liquid-line', 'A Gas Line Is Not a Liquid Line', [
    ('l01-why-the-pressures-are-squared', 'Why the pressures are squared', 13, [G]),
    ('l02-base-conditions-are-a-choice', 'Base conditions are a choice', 13, [G]),
    ('l03-miles-not-feet', 'Miles, not feet', 12, [G]),
    ('l04-what-a-dead-line-returns', 'What a dead line returns', 12, [G]),
  ]),
  ('m02-the-four-transmission-forms', 'The Four Transmission Forms', [
    ('l01-weymouth', 'Weymouth', 13, [G]),
    ('l02-the-two-panhandles', 'The two Panhandles', 13, [G]),
    ('l03-general-flow-and-its-iteration', 'General Flow, and its iteration', 14, [G]),
    ('l04-four-answers-on-one-line', 'Four answers on one line', 14, [G]),
    ('l05-the-diameter-exponent', 'The diameter exponent', 13, [G]),
  ]),
  ('m03-the-elevation-adjustment', 'The Elevation Adjustment', [
    ('l01-a-static-column-in-a-flowing-line', 'A static column in a flowing line', 13, [G]),
    ('l02-the-driving-group-changes-shape', 'The driving group changes shape', 13, [G]),
    ('l03-the-equivalent-length-factor', 'The equivalent length factor', 14, [G]),
    ('l04-two-things-a-hill-does', 'Two things a hill does', 13, [G]),
  ]),
  # RE-CUT. Built on digest Section 10 as it now stands: the bracket ends
  # where the driving group vanishes, which is the inlet over the square root
  # of e to the s, and a hill moves it in whichever direction the hill runs.
  ('m04-the-outlet-pressure', 'The Outlet Pressure', [
    ('l01-no-closed-form-in-this-engine', 'No closed form in this engine', 13, [G]),
    ('l02-the-ceiling-is-not-the-inlet', 'The ceiling is not the inlet', 14, [G]),
    ('l03-a-rate-the-line-cannot-carry', 'A rate the line cannot carry', 13, [G]),
    ('l04-downhill-where-the-drop-is-negative', 'Downhill, where the drop is negative', 13, [G]),
    ('l05-uphill-where-the-ceiling-falls', 'Uphill, where the ceiling falls', 14, [G]),
  ]),
  ('m05-marching-a-profile', 'Marching a Profile', [
    ('l01-one-segment-at-a-time', 'One segment at a time', 13, [G]),
    ('l02-the-station-list', 'The station list', 12, [G]),
    ('l03-marched-against-one-shot', 'Marched against one shot', 14, [G]),
    ('l04-refusing-with-the-evidence-attached', 'Refusing with the evidence attached', 13, [L]),
    ('l05-what-a-traverse-drops', 'What a traverse drops', 13, [L]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [G]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
 'advanced': [
  ('m01-the-wall-a-code-demands', 'The Wall a Code Demands', [
    ('l01-barlow-with-a-design-factor', 'Barlow with a design factor', 13, [W]),
    ('l02-four-location-classes', 'Four location classes', 14, [W]),
    ('l03-the-joint-factor-and-the-derate', 'The joint factor and the derate', 13, [W]),
    ('l04-the-allowance-that-is-not-strength', 'The allowance that is not strength', 13, [W]),
    ('l05-reading-the-rating-back', 'Reading the rating back', 13, [W]),
  ]),
  ('m02-the-pig-and-what-it-pushes', 'The Pig and What It Pushes', [
    ('l01-a-line-is-a-volume', 'A line is a volume', 12, [W]),
    ('l02-holdup-is-an-input', 'Holdup is an input', 14, [W]),
    ('l03-the-swept-volume', 'The swept volume', 13, [W]),
    ('l04-the-run', 'The run', 12, [W]),
    ('l05-the-interval-a-catcher-allows', 'The interval a catcher allows', 14, [W]),
  ]),
  ('m03-where-the-correlations-stop', 'Where the Correlations Stop', [
    ('l01-the-jump-at-the-branch', 'The jump at the branch', 14, [L]),
    ('l02-colebrook-past-its-roughness', 'Colebrook past its roughness', 13, [L]),
    ('l03-the-friction-weymouth-assumes', 'The friction Weymouth assumes', 14, [G]),
    ('l04-four-forms-and-no-regime-check', 'Four forms and no regime check', 13, [G]),
    ('l05-an-iteration-that-never-reports', 'An iteration that never reports', 13, [G]),
  ]),
  # RE-CUT. Was "What It Accepts and Should Not", five lessons on defects the
  # FC2-0 wave repaired. Built now on digest Section 16: the refusal CONTRACT,
  # the returns that sit outside it on purpose, the messages themselves, the
  # boundary either side of every guard, and what is still accepted.
  ('m04-what-a-refusal-is', 'What a Refusal Is', [
    ('l01-an-object-carrying-an-error', 'An object carrying an error', 13, [L]),
    ('l02-three-returns-outside-the-contract', 'Three returns outside the contract', 14, [L]),
    ('l03-the-messages-and-what-each-protects', 'The messages, and what each protects', 13, [G]),
    ('l04-both-sides-of-every-guard', 'Both sides of every guard', 14, [W]),
    ('l05-what-it-still-accepts', 'What it still accepts', 13, [W]),
  ]),
  ('m05-what-the-method-does-not-know', 'What the Method Does Not Know', [
    ('l01-items-held-for-the-literature', 'Items held for the literature', 13, [G]),
    ('l02-goldens-that-are-not-measurements', 'Goldens that are not measurements', 13, [L]),
    ('l03-the-half-that-is-not-here', 'The half that is not here', 14, [W]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [W]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
}

if __name__ == '__main__':
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        print(f'{tier}: {len(mods)} modules, {n} lessons')
        assert len(mods) == 6, tier
        assert n == 26, (tier, n)
    print('6 modules and 26 lessons in every tier')
