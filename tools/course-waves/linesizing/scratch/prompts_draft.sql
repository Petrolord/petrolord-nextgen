-- DRAFT capstone prompts for FC2 (conditions only, no answers). This file
-- exists so promptleak.py can sweep the prompts in the foundation phase;
-- gen_course.py generates the real migration next phase from the same text.
-- Regenerated 2026-09-16 in the REAL academy_capstones row shape: the gate
-- was rewritten to find prompts structurally, so a row must carry its own
-- graded answer key. Every expected value and tolerance below is read from
-- fields.json by the generator and is never typed here.
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'linesizing', 'beginner', 'associate',
  'IMO-1, a transfer line the lessons never use',
  'Size the transfer line',
  'IMO-1 is the crude transfer line from the IMO flow station to the tank farm. It carries 6800 barrels a day of dead crude at a density of 52.3 lb/ft3 and a viscosity of 4.2 centipoise, downstream of separation, so take the rate at line conditions. The line is 6.065 inches bore and 19800 feet long, and it climbs 180 feet from the station to the farm. It has been in service for years, so use an absolute roughness of 0.006 inches rather than new steel. The isometric adds up to a resistance coefficient sum of 3.85 velocity heads for all its bends, valves and the exit into the tank. The operator has agreed a site erosional c factor of 120 for this service, which is its own figure and not one of the published rows. Work the chain the studio works: the bore to a flow area, the area and the rate to a velocity, the velocity to a Reynolds number, the Reynolds number and the relative roughness to a friction factor, and then the three losses kept apart. Report: the velocity in ft/s; the Reynolds number; the Darcy friction factor; the friction loss in psi; the total pressure loss in psi; and the erosional velocity in ft/s at the agreed c factor.',
    jsonb_build_array(
      jsonb_build_object('key','imo1_velocity_fts', 'label','Velocity in the IMO-1 line', 'unit','ft/s', 'expected',2.2025394846583723, 'tol',1e-06),
      jsonb_build_object('key','imo1_reynolds', 'label','Reynolds number of the IMO-1 line', 'unit','dimensionless', 'expected',20628.885999489932, 'tol',0.01),
      jsonb_build_object('key','imo1_friction_factor', 'label','Darcy friction factor', 'unit','dimensionless', 'expected',0.027758986529736098, 'tol',1e-09),
      jsonb_build_object('key','imo1_friction_drop_psi', 'label','Friction loss along the line', 'unit','psi', 'expected',29.776303763560268, 'tol',1e-05),
      jsonb_build_object('key','imo1_total_drop_psi', 'label','Total pressure loss', 'unit','psi', 'expected',95.25672115819587, 'tol',1e-05),
      jsonb_build_object('key','imo1_erosional_velocity_fts', 'label','Erosional velocity at the agreed c factor', 'unit','ft/s', 'expected',16.593209696456945, 'tol',1e-06)
    )
),
(
  'linesizing', 'intermediate', 'professional',
  'the BRASS trunk, a descending gas line the lessons never use',
  'Read the trunk both ways',
  'The BRASS trunk carries gas from the BRASS gathering station down to the terminal. It is 15 inches bore and 58 miles long, it runs at 1150 psia at the station and 840 psia at the terminal, and the terminal sits 950 feet BELOW the station, so the elevation change is a descent. The gas has a gravity of 0.62, the average flowing temperature along the line is 552 degrees Rankine and the average compressibility is 0.845. The line has been surveyed and its transmission efficiency is 0.92, which is a stated condition of this line and not a figure to be looked up. Where the General Flow equation is asked for, use a gas viscosity of 0.0125 centipoise and a pipe roughness of 0.0006 inches. First work the elevation group that all four published forms share, then run the forms themselves, and then turn the question round: the terminal has contracted for 92000000 standard cubic feet a day, and you are asked what pressure it will actually see at that rate through the Weymouth form. Report: the elevation factor e to the s; the Weymouth rate in scfd; the Panhandle B rate in scfd; the General Flow rate in scfd; the Darcy friction factor the General Flow solve settles on; and the outlet pressure in psia at the contracted rate.',
    jsonb_build_array(
      jsonb_build_object('key','brass_elevation_factor', 'label','Elevation factor, e to the s', 'unit','dimensionless', 'expected',0.9537503233579996, 'tol',1e-09),
      jsonb_build_object('key','brass_weymouth_scfd', 'label','Weymouth rate', 'unit','scfd', 'expected',121983243.41355602, 'tol',1000),
      jsonb_build_object('key','brass_panhandleb_scfd', 'label','Panhandle B rate', 'unit','scfd', 'expected',158089257.28536567, 'tol',1000),
      jsonb_build_object('key','brass_general_scfd', 'label','General Flow rate', 'unit','scfd', 'expected',135290712.75490567, 'tol',1000),
      jsonb_build_object('key','brass_general_friction_factor', 'label','Darcy friction factor the General Flow solve settles on', 'unit','dimensionless', 'expected',0.010546475636391016, 'tol',1e-09),
      jsonb_build_object('key','brass_outlet_pressure_psia', 'label','Outlet pressure at the contracted rate', 'unit','psia', 'expected',999.6232577666815, 'tol',1e-05)
    )
),
(
  'linesizing', 'advanced', 'expert',
  'the QUA IBOE export line, which the lessons never use',
  'Rate the wall and plan the pig',
  'The QUA IBOE export line runs from the terminal to the loading buoy. Its wall is designed to B31.8 at a design pressure of 1450 psig on 16 inch outside diameter API 5L X60 line pipe with a specified minimum yield of 60000 psi. The route crosses the outskirts of a town, so it is location Class 3, and that class is a stated fact of the route rather than something to assume. The pipe is seamless, so take a joint factor of 1, the line runs hot enough to need a temperature derating factor of 0.967, and the corrosion allowance is 0.0625 inches. The mill rolled the line in a 0.5 inch wall, which is what the rating has to be read back from, and the rating must respect the same corrosion allowance the design did. The line itself is 15 inches bore and 306240 feet long. It is pigged with a sphere that runs at 4 feet per second, the last three runs measured a liquid holdup of 0.035 along the line, the slug catcher at the buoy holds 3200 barrels, and liquid drops out into the line at 95 barrels a day between runs. Report: the required wall thickness in inches; the maximum allowable operating pressure in psig of the wall as built; the line volume in barrels; the swept liquid volume in barrels at the measured holdup; the pig run time in hours; and the interval in days between runs that keeps the arriving slug inside the catcher.',
    jsonb_build_array(
      jsonb_build_object('key','quaiboe_required_wall_in', 'label','Required wall thickness', 'unit','in', 'expected',0.46236211651154774, 'tol',5e-07),
      jsonb_build_object('key','quaiboe_maop_as_built_psig', 'label','MAOP of the wall as built', 'unit','psig', 'expected',1586.4843750000002, 'tol',1e-05),
      jsonb_build_object('key','quaiboe_line_volume_bbl', 'label','Line volume', 'unit','bbl', 'expected',66935.15776219887, 'tol',0.0001),
      jsonb_build_object('key','quaiboe_swept_volume_bbl', 'label','Swept liquid volume at the measured holdup', 'unit','bbl', 'expected',2342.7305216769605, 'tol',5e-05),
      jsonb_build_object('key','quaiboe_pig_run_hours', 'label','Pig run time', 'unit','hours', 'expected',21.266666666666666, 'tol',5e-07),
      jsonb_build_object('key','quaiboe_pigging_interval_days', 'label','Interval between pig runs', 'unit','days', 'expected',9.023889245505679, 'tol',5e-05)
    )
);
