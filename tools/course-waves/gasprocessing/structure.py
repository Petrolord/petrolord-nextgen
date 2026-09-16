# FC4 Gas Processing. Three tiers, six modules each, 26 lessons a tier.
#
# Panel ids: W the water explorer (the saturation surface, the spec, the water
# load, the circulation ratio and the duty split), A the absorber explorer
# (the Kremser surface in both directions, the amine property table, the
# loading swing and the contactor), C the cold end explorer (HELD, see below).
#
# Titles carry COUNTS only, never a measurement.
#
# FRAMED HISTORY IS CURRICULUM. Expert m05 l01 is titled so that the frame is
# in the HEADING, which is where the gate looks for it and where a reader
# meets it first. Its source is digest Section 20, the one section of the
# digest whose subject is what this engine used to do and which says so in
# its own title and first line. Unframed history is still a defect: a
# sentence about former behaviour that reads as current behaviour is the
# thing that has actually gone wrong in this programme, every time. No em dashes and no
# "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engine: engines/facilities/gasProcessing.js over
# engines/production/gasProperties.js for the Sutton pseudo-criticals, the DAK
# compressibility correlation and the Rankine door. Vendored at NextGen
# fa33717f, sha-identical with engines 709172f.
#
# ---------------------------------------------------------------------------
# The Expert tier's m01, m02 and m03 are built on digest Section 14, which was
# WITHHELD while the Joule-Thomson chain was under repair and printed nothing
# rather than printing behind a banner. It is built now. Nothing is held.
#
# m01 is shaped around WHERE THE NUMBER COMES FROM and around the seam to the
# Flow Assurance engine, which takes a Joule-Thomson coefficient as a typed
# input and never computes one. That subject was chosen so it would survive
# the repair unchanged, and it did: only its figures moved.
#
# SCOPE SEAMS, all three checked against the 47 live course slugs:
#  * Souders-Brown, the K value and the settling velocity are OWNED by
#    separation (FC1). Professional m05 teaches the contactor's own duty and
#    cites separation for the equation. It does not re-derive it.
#  * The Joule-Thomson coefficient and mu times delta P are OWNED by
#    flowassurance (PD6) advanced m01. Expert m01 starts from the plant
#    application and from the fact that this is the only module in the
#    package that COMPUTES the quantity flowassurance asks a caller to type.
#  * Hydrates are OWNED by flowassurance, which refuses to compute a hydrate
#    boundary of its own. Expert m03 teaches dehydration as the OTHER answer
#    to the same question and hands the margin back.
#  * "Dew point" already means the saturation pressure of a reservoir fluid
#    in fluid advanced m02. Expert m01 l05 disambiguates the three senses
#    before any of them is used.
# ---------------------------------------------------------------------------
W = 'fc-water-explorer'
A = 'fc-absorber-explorer'
C = 'fc-coldend-explorer'

TIERS = {
 'beginner': [
  ('m01-what-this-engine-conditions', 'What This Engine Conditions', [
    ('l01-three-units-one-gas-stream', 'Three units, one gas stream', 12, []),
    ('l02-every-design-choice-is-visible', 'Every design choice is visible', 13, [W]),
    ('l03-what-it-refuses-to-answer', 'What it refuses to answer', 13, [W]),
    ('l04-the-units-and-the-standard-cubic-foot', 'The units and the standard cubic foot', 12, [W]),
  ]),
  ('m02-how-much-water-a-gas-carries', 'How Much Water a Gas Carries', [
    ('l01-saturation-is-a-pressure-ratio', 'Saturation is a pressure ratio', 12, [W]),
    ('l02-the-vapour-pressure-of-water', 'The vapour pressure of water', 13, [W]),
    ('l03-a-mole-fraction-becomes-pounds', 'A mole fraction becomes pounds', 13, [W]),
    ('l04-hotter-carries-more-and-tighter-carries-less', 'Hotter carries more, tighter carries less', 14, [W]),
    ('l05-the-band-the-answer-is-honest-in', 'The band the answer is honest in', 14, [W]),
  ]),
  ('m03-the-water-a-unit-takes-out', 'The Water a Unit Takes Out', [
    ('l01-the-outlet-spec-sets-the-load', 'The outlet spec sets the load', 12, [W]),
    ('l02-pounds-a-day-and-why-the-rate-arrives-here', 'Pounds a day, and why the rate arrives here', 13, [W]),
    ('l03-the-circulation-ratio-is-a-choice', 'The circulation ratio is a choice', 14, [W]),
    ('l04-gallons-a-minute-out-of-pounds-a-day', 'Gallons a minute out of pounds a day', 13, [W]),
    ('l05-the-customary-band-and-either-side-of-it', 'The customary band, and either side of it', 13, [W]),
  ]),
  ('m04-what-the-reboiler-pays-for', 'What the Reboiler Pays For', [
    ('l01-sensible-heat-absorber-to-still', 'Sensible heat, absorber to still', 13, [W]),
    ('l02-boiling-the-water-back-out', 'Boiling the water back out', 13, [W]),
    ('l03-the-reflux-the-still-sends-back', 'The reflux the still sends back', 13, [W]),
    ('l04-btu-a-gallon-becomes-mmbtu-an-hour', 'Btu a gallon becomes MMBtu an hour', 12, [W]),
  ]),
  ('m05-a-dehydration-answer-end-to-end', 'A Dehydration Answer End to End', [
    ('l01-the-chain-from-line-conditions-to-duty', 'The chain from line conditions to duty', 13, [W]),
    ('l02-what-moves-the-circulation', 'What moves the circulation', 13, [W]),
    ('l03-what-moves-the-duty', 'What moves the duty', 13, [W]),
    ('l04-the-three-levers-pulled-one-at-a-time', 'The three levers, pulled one at a time', 14, [W]),
    ('l05-reading-an-answer-for-sense', 'Reading an answer for sense', 13, [W]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-one-stream-one-answer', 'One stream, one answer', 13, [W]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [W]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-a-contactor-is-a-staged-device', 'A Contactor Is a Staged Device', [
    ('l01-what-a-theoretical-stage-is', 'What a theoretical stage is', 13, [A]),
    ('l02-the-absorption-factor', 'The absorption factor', 13, [A]),
    ('l03-kremser-in-one-relation', 'Kremser, in one relation', 14, [A]),
    ('l04-solving-it-the-other-way-round', 'Solving it the other way round', 13, [A]),
  ]),
  ('m02-what-the-absorption-factor-can-buy', 'What the Absorption Factor Can Buy', [
    ('l01-more-stages-against-more-solvent', 'More stages against more solvent', 13, [A]),
    ('l02-the-ceiling-below-unity', 'The ceiling below unity', 14, [A]),
    ('l03-unity-and-why-the-shape-changes-there', 'Unity, and why the shape changes there', 14, [A]),
    ('l04-a-spec-more-trays-cannot-reach', 'A spec more trays cannot reach', 13, [A]),
    ('l05-stages-on-paper-against-trays-in-steel', 'Stages on paper against trays in steel', 13, [A]),
  ]),
  ('m03-acid-gas-is-removed-by-moles', 'Acid Gas Is Removed by Moles', [
    ('l01-the-spec-the-pipeline-sets', 'The spec the pipeline sets', 12, [A]),
    ('l02-mole-percent-into-lbmol-a-day', 'Mole percent into lbmol a day', 13, [A]),
    ('l03-lean-rich-and-the-swing-between-them', 'Lean, rich, and the swing between them', 14, [A]),
    ('l04-from-moles-of-acid-gas-to-gallons', 'From moles of acid gas to gallons', 13, [A]),
    ('l05-the-regenerator-a-sweetening-unit-needs', 'The regenerator a sweetening unit needs', 13, [A]),
  ]),
  ('m04-three-amines-and-what-separates-them', 'Three Amines and What Separates Them', [
    ('l01-the-property-set-and-what-each-column-does', 'The property set, and what each column does', 13, [A]),
    ('l02-strength-and-what-it-buys', 'Strength, and what it buys', 13, [A]),
    ('l03-the-rich-limit-and-the-corrosion-warning', 'The rich limit, and the corrosion warning', 14, [A]),
    ('l04-duty-per-gallon-and-the-same-ranking-twice', 'Duty per gallon, and the same ranking twice', 14, [A]),
    ('l05-choosing-one-and-an-amine-the-table-lacks', 'Choosing one, and an amine the table lacks', 13, [A]),
  ]),
  ('m05-the-vessel-the-gas-goes-up', 'The Vessel the Gas Goes Up', [
    ('l01-a-contactor-is-not-a-knockout-drum', 'A contactor is not a knockout drum', 13, [A]),
    ('l02-the-gas-density-the-correlation-gives', 'The gas density the correlation gives', 14, [A]),
    ('l03-the-k-value-as-the-one-choice', 'The K value as the one choice', 13, [A]),
    ('l04-the-liquid-the-engine-assumes', 'The liquid the engine assumes', 13, [A]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-one-column-three-questions', 'One column, three questions', 14, [A]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [A]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 # -------------------------------------------------------------------------
 # EXPERT m01, m02 and m03 ARE HELD. Fourteen lessons with no digest source
 # until FC4-0 is vendored and Section 14 is built. m04, m05 and m06 are
 # twelve lessons that can be written today from Sections 13, 15, 16 and 17.
 # -------------------------------------------------------------------------
 'advanced': [
  ('m01-dew-point-control-by-expansion', 'Dew Point Control by Expansion', [
    ('l01-what-a-dew-point-skid-sells', 'What a dew point skid sells', 13, [C]),
    ('l02-the-coefficient-another-engine-asks-you-to-type', 'The coefficient another engine asks you to type', 14, [C]),
    ('l03-where-the-number-comes-from', 'Where the number comes from', 14, [C]),
    ('l04-a-coefficient-that-survives-low-pressure', 'A coefficient that survives low pressure', 13, [C]),
    ('l05-three-dew-points-one-phrase', 'Three dew points, one phrase', 13, [C]),
  ]),
  ('m02-marching-a-pressure-drop', 'Marching a Pressure Drop', [
    ('l01-one-step-is-not-enough', 'One step is not enough', 13, [C]),
    ('l02-the-midpoint-march', 'The midpoint march', 13, [C]),
    ('l03-how-many-steps-are-enough', 'How many steps are enough', 14, [C]),
    ('l04-the-temperature-the-gas-arrives-at', 'The temperature the gas arrives at', 13, [C]),
  ]),
  ('m03-the-cold-separator', 'The Cold Separator', [
    ('l01-water-the-cold-gas-can-still-hold', 'Water the cold gas can still hold', 13, [C]),
    ('l02-what-drops-out-and-where', 'What drops out, and where', 13, [C]),
    ('l03-dew-point-depression-as-the-product', 'Dew point depression as the product', 14, [C]),
    ('l04-the-hydrate-question-this-engine-hands-on', 'The hydrate question this engine hands on', 14, [C]),
    ('l05-cooling-against-dehydrating', 'Cooling against dehydrating', 13, [C]),
  ]),
  ('m04-the-still-overhead-nobody-sells', 'The Still Overhead Nobody Sells', [
    ('l01-aromatics-arrive-in-the-glycol', 'Aromatics arrive in the glycol', 13, [W]),
    ('l02-a-mole-balance-from-ppmv', 'A mole balance from ppmv', 13, [W]),
    ('l03-short-tons-a-year', 'Short tons a year', 12, [W]),
    ('l04-one-molecular-weight-for-four-compounds', 'One molecular weight for four compounds', 13, [W]),
  ]),
  ('m05-computed-chosen-and-kept', 'Computed, Chosen and Kept', [
    ('l01-what-was-repaired-and-what-was-not', 'What was repaired, and what was not', 13, [W]),
    ('l02-what-a-refusal-is', 'What a refusal is', 14, [A]),
    # TITLE CORRECTED by the Expert writer. The old title asserted, in an H1,
    # that one export sits outside the module's error contract. Digest Section
    # 15 prints the opposite as current behaviour (THE CONTRACT IS WHOLE), and
    # digest_prose.rules.mjs carries a rule whose own text says this exact title
    # went stale on the FC4-0 rebuild. The key is unchanged so banks, capstones
    # and migrations keyed on it are unaffected.
    ('l03-the-one-export-outside-the-contract', 'The contract read on one export', 13, [A]),
    ('l04-constants-measured-out-of-the-engine', 'Constants measured out of the engine', 14, [W]),
    ('l05-what-a-published-case-can-catch', 'What a published case can catch', 14, [A]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-what-the-method-does-not-know', 'What the method does not know', 14, [W]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [C]),
    ('l03-where-this-engine-hands-over', 'Where this engine hands over', 12, []),
  ]),
 ],
}

# Nothing is held. FC4-0 is merged and vendored, digest Section 14 is built,
# and all three Expert modules have their source.
HELD = {}

if __name__ == '__main__':
    total = 0
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        held = sum(len(m[2]) for m in mods if m[0] in HELD.get(tier, []))
        total += n
        print(f'{tier:<14} {len(mods)} modules  {n} lessons  ({held} held)')
        assert len(mods) == 6, f'{tier} has {len(mods)} modules'
        assert n == 26, f'{tier} has {n} lessons'
    print(f'{"total":<14} {total} lessons, all writable')
    keys = [l[0] for mods in TIERS.values() for m in mods for l in m[2]]
    titles = [l[1] for mods in TIERS.values() for m in mods for l in m[2]]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no "X, not Y" contrastives')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            assert len(set(l[0] for l in lessons)) == len(lessons), mkey
    print('lesson keys unique inside every module')
