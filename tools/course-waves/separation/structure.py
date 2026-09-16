# FC1 Separation & Slug Catching. Three tiers, six modules each, 26
# lessons a tier. Panel ids: P the separator explorer (gas conditions, K,
# settling, the vertical vessel), S the slug and vessel explorer (the
# horizontal vessel, the three-phase split, slug catchers, the L/D
# family), L the layout explorer (distances, computed setbacks, the
# layout check).
#
# Titles carry COUNTS only, never a measurement.
#
# Engines, as repaired in FC1-0 (engines #188, owner decisions
# 2026-09-15): engines/facilities/separatorSizing.js (the Separator &
# Slug Catcher Designer: DAK z inside its range, K with its published
# derating, Souders-Brown settling, vertical and horizontal two-phase,
# three-phase with an exact interface and droplet verdicts, the L/D
# family with feasibility and a preferred row) and
# engines/facilities/spacing.js (the Facility Layout Mapper's missing
# half: the spacing table, haversine distances, computed flare and pool
# fire setbacks, and the layout check with its completeness reading).
P = 'fc-separator-explorer'
S = 'fc-slug-explorer'
L = 'fc-layout-explorer'
TIERS = {
 'beginner': [
  ('m01-what-a-separator-is-for', 'What a Separator Is For', [
    ('l01-one-vessel-one-job', 'One vessel, one job', 12, []),
    ('l02-sizing-is-not-flashing', 'Sizing is not flashing', 13, [P]),
    ('l03-what-it-refuses-to-guess', 'What it refuses to guess', 13, [P]),
    ('l04-the-units-it-works-in', 'The units it works in', 12, [P]),
  ]),
  ('m02-the-gas-at-separator-conditions', 'The Gas at Separator Conditions', [
    ('l01-pressure-is-not-gauge-pressure', 'Pressure is not gauge pressure', 12, [P]),
    ('l02-pseudo-criticals-from-gravity', 'Pseudo-criticals from gravity', 13, [P]),
    ('l03-the-z-factor-and-its-range', 'The z factor, and its range', 14, [P]),
    ('l04-density-from-the-gas-law', 'Density from the gas law', 13, [P]),
    ('l05-the-rate-the-vessel-actually-sees', 'The rate the vessel actually sees', 13, [P]),
  ]),
  ('m03-the-k-value', 'The K Value', [
    ('l01-six-published-rows', 'Six published rows', 12, [P]),
    ('l02-what-a-mist-extractor-changes', 'What a mist extractor changes', 13, [P]),
    ('l03-a-rule-of-thumb-with-a-floor', 'A rule of thumb with a floor', 14, [P]),
    ('l04-a-vendor-number-beats-a-table', 'A vendor number beats a table', 12, [P]),
  ]),
  ('m04-settling', 'Settling', [
    ('l01-the-two-densities', 'The two densities', 12, [P]),
    ('l02-oil-water-and-the-mixture', 'Oil, water and the mixture', 13, [P]),
    ('l03-souders-brown', 'Souders-Brown', 13, [P]),
    ('l04-when-settling-has-no-answer', 'When settling has no answer', 12, [P]),
    ('l05-the-published-cases', 'The published cases', 13, [P]),
  ]),
  ('m05-the-vertical-vessel', 'The Vertical Vessel', [
    ('l01-the-diameter-the-gas-demands', 'The diameter the gas demands', 13, [P]),
    ('l02-height-from-retention', 'Height from retention', 13, [P]),
    ('l03-the-allowance-above-the-liquid', 'The allowance above the liquid', 12, [P]),
    ('l04-a-diameter-somebody-chose', 'A diameter somebody chose', 14, [P]),
    ('l05-margin-and-slenderness', 'Margin, and slenderness', 13, [P]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [P]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
 'intermediate': [
  ('m01-the-horizontal-vessel', 'The Horizontal Vessel', [
    ('l01-a-circle-cut-by-a-level', 'A circle cut by a level', 13, [S]),
    ('l02-the-gas-space', 'The gas space', 13, [S]),
    ('l03-the-chord-and-what-it-is-not', 'The chord, and what it is not', 12, [S]),
    ('l04-a-level-the-engine-refuses', 'A level the engine refuses', 12, [S]),
    ('l05-half-full-is-an-assumption', 'Half full is an assumption', 13, [S]),
  ]),
  ('m02-two-lengths-one-vessel', 'Two Lengths, One Vessel', [
    ('l01-the-length-the-liquid-needs', 'The length the liquid needs', 13, [S]),
    ('l02-the-length-the-gas-needs', 'The length the gas needs', 14, [S]),
    ('l03-which-one-controls', 'Which one controls', 13, [S]),
    ('l04-slenderness-in-a-horizontal-vessel', 'Slenderness in a horizontal vessel', 12, [S]),
  ]),
  ('m03-gas-capacity', 'Gas Capacity', [
    ('l01-velocity-in-the-gas-space', 'Velocity in the gas space', 13, [S]),
    ('l02-the-margin-and-the-verdict', 'The margin, and the verdict', 13, [S]),
    ('l03-a-vessel-that-cannot-carry-its-gas', 'A vessel that cannot carry its gas', 13, [S]),
    ('l04-what-the-gas-length-cannot-exceed', 'What the gas length cannot exceed', 14, [S]),
  ]),
  ('m04-slug-catchers', 'Slug Catchers', [
    ('l01-where-the-slug-volume-comes-from', 'Where the slug volume comes from', 12, [S]),
    ('l02-the-working-volume', 'The working volume', 13, [S]),
    ('l03-a-vessel-from-a-volume', 'A vessel from a volume', 14, [S]),
    ('l04-fingers-instead-of-a-vessel', 'Fingers instead of a vessel', 13, [S]),
    ('l05-what-a-slug-catcher-refuses', 'What a slug catcher refuses', 12, [S]),
  ]),
  ('m05-distances-on-a-site', 'Distances on a Site', [
    ('l01-a-table-is-a-table', 'A table is a table', 12, [L]),
    ('l02-distance-on-a-sphere', 'Distance on a sphere', 13, [L]),
    ('l03-a-flare-setback-is-computed', 'A flare setback is computed', 14, [L]),
    ('l04-a-pool-fire-and-its-edge', 'A pool fire, and its edge', 14, [L]),
    ('l05-what-a-point-source-cannot-say', 'What a point source cannot say', 13, [L]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [S]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
 'advanced': [
  ('m01-three-phases-in-one-vessel', 'Three Phases in One Vessel', [
    ('l01-the-split-the-retentions-imply', 'The split the retentions imply', 13, [S]),
    ('l02-the-interface-at-its-exact-height', 'The interface at its exact height', 14, [S]),
    ('l03-a-level-somebody-pins', 'A level somebody pins', 13, [S]),
    ('l04-two-retention-lengths', 'Two retention lengths', 13, [S]),
    ('l05-what-three-phase-sizing-demands', 'What three-phase sizing demands', 12, [S]),
  ]),
  ('m02-droplets-and-verdicts', 'Droplets and Verdicts', [
    ('l01-stokes-between-two-liquids', 'Stokes between two liquids', 13, [S]),
    ('l02-water-out-of-the-oil', 'Water out of the oil', 13, [S]),
    ('l03-oil-out-of-the-water', 'Oil out of the water', 13, [S]),
    ('l04-residence-in-the-sized-vessel', 'Residence in the sized vessel', 14, [S]),
    ('l05-a-verdict-that-used-to-fail-open', 'A verdict that used to fail open', 13, [S]),
  ]),
  ('m03-the-family-of-vessels', 'The Family of Vessels', [
    ('l01-every-row-and-its-reasons', 'Every row, and its reasons', 13, [S]),
    ('l02-the-smallest-one-that-works', 'The smallest one that works', 14, [S]),
    ('l03-three-statuses', 'Three statuses', 13, [S]),
    ('l04-the-band-is-an-input', 'The band is an input', 12, [S]),
  ]),
  ('m04-judging-a-layout', 'Judging a Layout', [
    ('l01-what-counts-as-a-check', 'What counts as a check', 13, [L]),
    ('l02-the-items-nobody-placed', 'The items nobody placed', 13, [L]),
    ('l03-complete-is-not-pass', 'Complete is not pass', 14, [L]),
    ('l04-two-rankings-that-disagree', 'Two rankings that disagree', 13, [L]),
    ('l05-nothing-checked-is-not-a-pass', 'Nothing checked is not a pass', 12, [L]),
  ]),
  ('m05-what-the-method-does-not-know', 'What the Method Does Not Know', [
    ('l01-a-derating-held-for-the-literature', 'A derating held for the literature', 13, [P]),
    ('l02-the-settling-velocity-borrowed', 'The settling velocity borrowed', 13, [S]),
    ('l03-tables-and-labels-without-a-source', 'Tables and labels without a source', 12, [L]),
    ('l04-goldens-that-are-not-measurements', 'Goldens that are not measurements', 13, [S]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-story-so-far', 'The story so far', 12, []),
    ('l02-working-the-capstone', 'Working the capstone', 14, [S]),
    ('l03-onward', 'Onward', 9, []),
  ]),
 ],
}
