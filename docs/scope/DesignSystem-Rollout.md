# NextGen Academy: design family rollout

Owner decisions, 2026-09-28. The Petrolord family theme is the grey panel
light theme (bg `#E1E4E8`, surface `#EDEFF2`, raised `#F8F9FA`, sunken
`#D8DCE1`, border `#C3C9D0`, border-strong `#6E7883`, muted `#4D5761`) with
the Suite's current input styling. Dark is a per-user choice from a header
toggle, and the user can always switch back to light. Charts stay white.
The owner approved extending the family from the Suite to NextGen and HSE
the same day.

This document is the plan of record for NextGen: the inventory of every
route and screen, the batches, what stays out, the shared kits, canvases
and charts, the scope strategy, the recipe and the test strategy. The rules
of the family live in the Suite (`Petrolord/petrolord-suite`,
`docs/scope/DesignSystem.md` and `docs/scope/DesignSystem-Rollout.md`);
this repo follows them and records only what differs for NextGen.

Measured on main `cb5251926` (2026-09-28). Wave 0 (this document's pull
request) lands the plumbing, the adapted ui kit and one pilot screen.

## 0. Summary

| | count |
|---|---|
| routed screens (signed-in, public and auth) | 120 units |
| course apps (one learning page per app at `/dashboard/apps/<slug>`) | 79 |
| course reader pages (course home, module, lesson, quiz, exam, capstone) | 6 routes, one shared reader |
| learner, account and sponsor pages | 10 |
| admin pages | 13 |
| public and auth pages (login, register, verify, legal, the 404 page) | 9, always light (section 5.3) |
| regal homepage | 1, stays out (section 2) |
| legacy colour classes in screen-owned files | about 10,700 (plus about 3,000 hex colours in SVG and chart styles) |
| estimated effort, all units | about 86 VRR-equivalents, plus about 3 for the 1B kits (section 1) |
| agent sessions | 23: wave 0 (this PR), 21 migration batches, 1 end state |

| wave | what | sessions | parallel |
|---|---|---|---|
| 0 | plumbing, ui kit, header, pilot (dashboard home) | 1 | done in this PR |
| 1 | 1A frame and search, 1B course kit and chart kit, 1C course reader and handbook | 3 | yes |
| 2 | 2A learner and account pages, 2B admin I, 2C admin II | 3 | yes |
| 3 | course apps: geoscience (2), reservoir, drilling (2) | 5 | yes, after 1B |
| 4 | course apps: production (3), economics | 4 | yes, after 1B |
| 5 | course apps: facilities (2, assurance with the second), HSE with gas value and carbon, data and AI with crude, refinery and supply | 4 | yes, after 1B |
| 6 | 6A commercial and trading, 6B public and auth pages (always light) | 2 | yes |
| 7 | end state: the scope becomes unconditional, legacy branches deleted | 1 | after all |

Waves 1 and 2 can run together; waves 3 to 6 need 1B (the course kit and
the chart kit) merged first, because every course app uses them.

## 1. How the inventory was measured

A throwaway script (not committed) walked the import graph from every route
element in `src/App.jsx` and from every route in `src/pages/DashboardPage.jsx`.

- **Unit.** One routed screen. The four role homes at `/dashboard` are one
  unit (one file, one route). The six course reader routes
  (`/dashboard/apps/:appSlug/course/:tier/...`) are six units that share the
  lesson reader. Each course app is its learning page at
  `/dashboard/apps/<slug>`.
- **Own files.** Files reachable from exactly one unit. The walk stops at
  other units' entry files (DashboardPage imports every learning page), and
  two hubs are ignored when deciding ownership, as the Suite ignored its dev
  harnesses: the lesson reader and the course handbook both reach every
  course's panels (the panel registry), so a course's panels belong to its
  course app.
- **Legacy.** In own files: `bg|text|border|ring|from|to|via|divide|outline|fill|stroke|placeholder|shadow`
  with `slate|zinc|gray|neutral|stone|cyan|lime|emerald`, black and white
  text, borders and fills, and arbitrary hex classes such as `bg-[#1E293B]`
  and `text-[#BFFF00]` (NextGen's console colours).
- **Hex in SVG and style.** `stroke`, `fill`, `stopColor` and colour style
  values given as hex. These are almost all chart colours on the dark chart
  plates; each chart moves to the white chart standard (section 4).
- **Status hues.** red, amber, green, blue, sky, yellow and the other hues.
  Each needs a decision (a status role or a neutral role), so they add
  effort.
- **Chart files.** Own files that import `recharts` or draw an `<svg>`.
- **Effort (VRR).** The Suite's measure, so batch sizes compare across the
  family: `0.3 + 0.7 x (legacy + 0.5 x hex + 0.5 x hues) / 178.5`, where 1.0
  is the Suite's Voidage Replacement Monitor before its migration. The
  Suite's batches were 3 to 4 VRR per agent session. NextGen's course apps
  are far more uniform than the Suite's apps (one page shape, one course
  kit, the same panel pattern), so batches here run to 4 or 5 VRR; the three
  largest (3E, 5D, 6A) are marked to split if the first half runs long.

## 2. What stays out

- **The regal public homepage** (`/`, `src/pages/LandingPage.jsx` with
  `LandingPage.css`, scoped under `.ng-home`) keeps its own paper look, as
  the Suite's paper homepage does. It is never registered and never wrapped.
  It shares one piece with the signed-in screens, `PracticeCourseBadge`,
  which therefore stays scope-aware (legacy outside a scope) until the end
  state.
- **Learner certificates** keep their designed artwork: the certificate
  sheet in `components/academy/CertificateView.jsx` (on screen and in
  print), the PDF exports (`utils/reportGenerator.js`,
  `lib/reportExportUtils.js`, `lib/exportUtils.js`) and the certificate shown
  on the public verify page. The page chrome around a certificate (the
  certificates list, the verify page frame) is migrated; the certificate
  itself sits in a `data-canvas="document"` region so the theme test skips
  it and nothing inside it takes a role.
- **Printable pages** keep their print styles. The course handbook
  (`/dashboard/admin/handbook`) is a printable document: its screen toolbar
  and frame are migrated in 1C, and its document body is a
  `data-canvas="document"` region with its print CSS unchanged.
- **Engine and teaching content** (lesson markdown, question banks, digests,
  capstone cases) is untouched by the rollout. Only class names change.

## 3. Inventory and batches

Routes are under `/dashboard/` unless they start with `/`. Columns count
own files only (section 1).

#### Public and auth pages (10)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Homepage (regal) | `/` | `pages/LandingPage.jsx` | 2 / 0 | 0 | 1 | 0 | 0 | 0.30 | out |
| Login | `/login` | `pages/LoginPage.jsx` | 1 / 1 | 29 | 0 | 4 | 0 | 0.42 | 6B |
| Register | `/register` | `pages/RegisterPage.jsx` | 1 / 1 | 29 | 0 | 6 | 0 | 0.43 | 6B |
| Verify certificate | `/verify, /verify/:code` | `pages/VerifyCertificatePage.jsx` | 1 / 1 | 32 | 0 | 7 | 0 | 0.44 | 6B |
| Forgot password | `/forgot-password` | `pages/PasswordResetPage.jsx` | 1 / 1 | 69 | 0 | 24 | 0 | 0.62 | 6B |
| Reset password | `/reset-password` | `pages/ResetPasswordPage.jsx` | 1 / 1 | 37 | 0 | 18 | 0 | 0.48 | 6B |
| Privacy policy | `/privacy-policy` | `pages/PrivacyPolicyPage.jsx` | 1 / 1 | 14 | 0 | 0 | 0 | 0.35 | 6B |
| Terms of service | `/terms-of-service` | `pages/TermsOfServicePage.jsx` | 1 / 1 | 9 | 0 | 0 | 0 | 0.34 | 6B |
| Academic integrity | `/academic-integrity` | `pages/AcademicIntegrityPage.jsx` | 1 / 1 | 35 | 0 | 15 | 0 | 0.47 | 6B |
| Not found | `*` | `pages/NotFoundPage.jsx` | 1 / 1 | 12 | 0 | 3 | 0 | 0.35 | 6B |

#### Frame (2)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Signed-in frame (Layout, Header, Sidebar, course nav) | `every signed-in route` | `components/Layout.jsx` | 10 / 7 | 105 | 0 | 6 | 0 | 0.72 | 0 (header) + 1A (rail) |
| App root pieces (loader, toaster, search modal, device guard) | `global` | `components/ui/toaster.jsx, components/search/GlobalSearchModal.jsx, components/academy/DeviceGuard.jsx` | 4 / 3 | 38 | 0 | 6 | 0 | 0.46 | 0 (loader, toaster) + 1A |

#### Account (3)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Search | `/search` | `pages/SearchPage.jsx` | 8 / 8 | 143 | 0 | 6 | 0 | 0.87 | 1A |
| Settings | `/dashboard/settings` | `pages/SettingsPage.jsx` | 4 / 2 | 102 | 0 | 6 | 0 | 0.71 | 2A |
| Notifications | `/dashboard/notifications` | `pages/NotificationCenterPage.jsx` | 4 / 3 | 70 | 0 | 5 | 0 | 0.58 | 2A |

#### Learner pages (6)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| My certificates | `/dashboard/certificates` | `pages/AcademyCertificatesPage.jsx` | 2 / 2 | 58 | 0 | 6 | 0 | 0.54 | 2A |
| Dashboard homes (learner, lecturer, admin, super admin) + modules placeholder | `/dashboard, /dashboard/modules/*` | `pages/DashboardPage.jsx` | 2 / 2 | 78 | 0 | 4 | 0 | 0.61 | 0 (homes) + 1A (placeholder) |
| Enroll | `/dashboard/enroll` | `pages/EnrollPage.jsx` | 1 / 1 | 103 | 0 | 12 | 0 | 0.73 | 2A |
| Get started (activation) | `/dashboard/get-started` | `pages/GetStartedPage.jsx` | 1 / 1 | 47 | 0 | 1 | 0 | 0.49 | 2A |
| Devices | `/dashboard/devices` | `pages/DevicesPage.jsx` | 1 / 1 | 24 | 0 | 4 | 0 | 0.40 | 2A |
| Prerequisite waiver | `/dashboard/waiver/:appSlug` | `pages/PrereqWaiverPage.jsx` | 1 / 1 | 7 | 0 | 0 | 0 | 0.33 | 2A |

#### Sponsor (1)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Sponsor console | `/dashboard/sponsor` | `pages/SponsorConsolePage.jsx` | 2 / 2 | 86 | 0 | 12 | 0 | 0.66 | 2A |

#### Admin pages (13)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Analytics (admin) | `/dashboard/analytics` | `pages/AdminAnalyticsPage.jsx` | 3 / 3 | 64 | 22 | 2 | 1 | 0.60 | 2C |
| Compliance (admin) | `/dashboard/compliance` | `pages/AdminCompliancePage.jsx` | 4 / 4 | 136 | 0 | 14 | 0 | 0.86 | 2C |
| Compliance reports (admin) | `/dashboard/reports` | `pages/AdminComplianceReportsPage.jsx` | 18 / 15 | 89 | 0 | 6 | 0 | 0.66 | 2C |
| Academy doors | `/dashboard/admin/academy-doors` | `pages/AdminAcademyDoorsPage.jsx` | 2 / 2 | 133 | 0 | 11 | 0 | 0.84 | 2B |
| Certifications (admin) | `/dashboard/admin/certifications` | `pages/AdminCertificationsPage.jsx` | 1 / 1 | 40 | 0 | 5 | 0 | 0.47 | 2B |
| Course handbook (printable) | `/dashboard/admin/handbook` | `pages/AdminCourseHandbookPage.jsx` | 28 / 23 | 185 | 263 | 2 | 22 | 1.55 | 1C |
| Audit logs | `/dashboard/admin/audit-logs` | `pages/AdminAuditLogsPage.jsx` | 2 / 2 | 28 | 0 | 16 | 0 | 0.44 | 2B |
| Live monitoring | `/dashboard/admin/monitoring` | `pages/RealTimeMonitoringPage.jsx` | 1 / 1 | 64 | 0 | 13 | 0 | 0.58 | 2C |
| User directory | `/dashboard/admin/users` | `pages/AdminUsersPage.jsx` | 3 / 3 | 86 | 0 | 30 | 0 | 0.70 | 2B |
| Admin roles | `/dashboard/admin/admin-mgmt` | `pages/AdminManagementPage.jsx` | 1 / 1 | 55 | 0 | 9 | 0 | 0.53 | 2C |
| System analytics | `/dashboard/admin/analytics` | `pages/AdminReportAnalyticsPage.jsx` | 2 / 2 | 38 | 9 | 0 | 2 | 0.47 | 2C |
| Super admins | `/dashboard/admin/super-admins` | `pages/SuperAdminToolPage.jsx` | 1 / 1 | 53 | 0 | 5 | 0 | 0.52 | 2B |
| System settings | `/dashboard/admin/settings` | `pages/AdminSystemSettingsPage.jsx` | 3 / 1 | 90 | 0 | 6 | 0 | 0.66 | 2B |

#### Course reader (6)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Course home | `/dashboard/apps/:appSlug/course/:tier/...` | `pages/course/CourseHomePage.jsx` | 1 / 1 | 54 | 0 | 0 | 0 | 0.51 | 1C |
| Course module | `/dashboard/apps/:appSlug/course/:tier/...` | `pages/course/ModulePage.jsx` | 1 / 1 | 21 | 0 | 0 | 0 | 0.38 | 1C |
| Lesson reader (+ lesson renderer kit) | `/dashboard/apps/:appSlug/course/:tier/...` | `pages/course/LessonPage.jsx` | 28 / 23 | 155 | 263 | 1 | 22 | 1.43 | 1C |
| Module quiz | `/dashboard/apps/:appSlug/course/:tier/...` | `pages/course/ModuleQuizPage.jsx` | 1 / 1 | 2 | 0 | 0 | 0 | 0.31 | 1C |
| Final exam | `/dashboard/apps/:appSlug/course/:tier/...` | `pages/course/FinalExamPage.jsx` | 1 / 1 | 2 | 0 | 0 | 0 | 0.31 | 1C |
| Capstone redirect | `/dashboard/apps/:appSlug/course/:tier/...` | `pages/course/CapstoneRedirect.jsx` | 1 / 0 | 0 | 0 | 0 | 0 | 0.30 | 1C |

#### Course apps: geoscience (10)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Petrophysics | `/dashboard/apps/petrophysics` | `pages/apps/PetrophysicsLearningPage.jsx` | 10 / 5 | 126 | 28 | 4 | 3 | 0.86 | 3A |
| Well Data | `/dashboard/apps/welldata` | `pages/apps/WellDataLearningPage.jsx` | 7 / 5 | 139 | 0 | 7 | 0 | 0.86 | 3A |
| Well Correlation | `/dashboard/apps/wellcorrelation` | `pages/apps/WellCorrelationLearningPage.jsx` | 4 / 3 | 86 | 6 | 5 | 1 | 0.66 | 3A |
| Seismolord | `/dashboard/apps/seismolord` | `pages/apps/SeismolordLearningPage.jsx` | 2 / 1 | 87 | 25 | 4 | 1 | 0.70 | 3A |
| Mapping | `/dashboard/apps/mapping` | `pages/apps/MappingLearningPage.jsx` | 2 / 1 | 91 | 7 | 5 | 1 | 0.68 | 3A |
| Reservoir Calc | `/dashboard/apps/reservoircalc` | `pages/apps/ReservoirCalcLearningPage.jsx` | 2 / 1 | 88 | 5 | 4 | 1 | 0.66 | 3B |
| Rock Physics | `/dashboard/apps/rockphysics` | `pages/apps/RockPhysicsLearningPage.jsx` | 2 / 1 | 90 | 15 | 4 | 1 | 0.69 | 3B |
| Pore Pressure | `/dashboard/apps/porepressure` | `pages/apps/PorePressureLearningPage.jsx` | 2 / 1 | 83 | 7 | 4 | 1 | 0.65 | 3B |
| Earth Model | `/dashboard/apps/earthmodel` | `pages/apps/EarthModelLearningPage.jsx` | 2 / 1 | 85 | 11 | 5 | 1 | 0.66 | 3B |
| Basin | `/dashboard/apps/basin` | `pages/apps/BasinLearningPage.jsx` | 2 / 1 | 82 | 17 | 5 | 1 | 0.66 | 3B |

#### Course apps: reservoir (7)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Dca | `/dashboard/apps/dca` | `pages/apps/DcaLearningPage.jsx` | 5 / 4 | 66 | 18 | 3 | 2 | 0.60 | 3C |
| Mbal | `/dashboard/apps/mbal` | `pages/apps/MbalLearningPage.jsx` | 5 / 4 | 68 | 18 | 3 | 2 | 0.61 | 3C |
| Scal | `/dashboard/apps/scal` | `pages/apps/ScalLearningPage.jsx` | 5 / 4 | 74 | 35 | 3 | 3 | 0.66 | 3C |
| Waterflood | `/dashboard/apps/waterflood` | `pages/apps/WaterfloodLearningPage.jsx` | 5 / 4 | 113 | 33 | 3 | 3 | 0.81 | 3C |
| Sim | `/dashboard/apps/sim` | `pages/apps/SimLearningPage.jsx` | 5 / 4 | 84 | 2 | 3 | 2 | 0.64 | 3C |
| Fluid | `/dashboard/apps/fluid` | `pages/apps/FluidLearningPage.jsx` | 5 / 4 | 132 | 0 | 12 | 0 | 0.84 | 3C |
| Well Test | `/dashboard/apps/welltest` | `pages/apps/WellTestLearningPage.jsx` | 6 / 4 | 108 | 14 | 18 | 2 | 0.79 | 3C |

#### Course apps: drilling (12)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Well Design | `/dashboard/apps/welldesign` | `pages/apps/WellDesignLearningPage.jsx` | 5 / 4 | 112 | 20 | 15 | 3 | 0.81 | 3D |
| Torque Drag | `/dashboard/apps/torquedrag` | `pages/apps/TorqueDragLearningPage.jsx` | 5 / 3 | 79 | 43 | 9 | 3 | 0.71 | 3D |
| Hydraulics | `/dashboard/apps/hydraulics` | `pages/apps/HydraulicsLearningPage.jsx` | 6 / 5 | 82 | 42 | 4 | 3 | 0.71 | 3D |
| Well Control | `/dashboard/apps/wellcontrol` | `pages/apps/WellControlLearningPage.jsx` | 5 / 4 | 79 | 17 | 7 | 2 | 0.66 | 3D |
| Geomech | `/dashboard/apps/geomech` | `pages/apps/GeomechLearningPage.jsx` | 5 / 4 | 57 | 51 | 5 | 3 | 0.63 | 3D |
| Casing Tubing | `/dashboard/apps/casingtubing` | `pages/apps/CasingTubingLearningPage.jsx` | 5 / 4 | 68 | 40 | 7 | 3 | 0.66 | 3D |
| Cementing | `/dashboard/apps/cementing` | `pages/apps/CementingLearningPage.jsx` | 5 / 4 | 66 | 62 | 7 | 3 | 0.69 | 3E |
| Completion | `/dashboard/apps/completion` | `pages/apps/CompletionLearningPage.jsx` | 5 / 4 | 72 | 30 | 9 | 3 | 0.66 | 3E |
| Perfsand | `/dashboard/apps/perfsand` | `pages/apps/PerfsandLearningPage.jsx` | 5 / 4 | 75 | 63 | 6 | 3 | 0.73 | 3E |
| Stimulation | `/dashboard/apps/stimulation` | `pages/apps/StimulationLearningPage.jsx` | 5 / 4 | 105 | 178 | 15 | 3 | 1.09 | 3E |
| Integrity | `/dashboard/apps/integrity` | `pages/apps/IntegrityLearningPage.jsx` | 5 / 4 | 159 | 81 | 43 | 3 | 1.17 | 3E |
| Well Cost | `/dashboard/apps/wellcost` | `pages/apps/WellCostLearningPage.jsx` | 5 / 4 | 153 | 75 | 5 | 3 | 1.06 | 3E |

#### Course apps: production (9)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Nodal | `/dashboard/apps/nodal` | `pages/apps/NodalLearningPage.jsx` | 5 / 4 | 175 | 92 | 28 | 3 | 1.22 | 4A |
| Gas Lift | `/dashboard/apps/gaslift` | `pages/apps/GasLiftLearningPage.jsx` | 6 / 5 | 222 | 116 | 3 | 3 | 1.40 | 4A |
| Esp | `/dashboard/apps/esp` | `pages/apps/EspLearningPage.jsx` | 5 / 4 | 199 | 94 | 13 | 3 | 1.29 | 4A |
| Rod Pump | `/dashboard/apps/rodpump` | `pages/apps/RodPumpLearningPage.jsx` | 6 / 5 | 238 | 100 | 3 | 3 | 1.44 | 4B |
| Gas Well | `/dashboard/apps/gaswell` | `pages/apps/GasWellLearningPage.jsx` | 5 / 4 | 176 | 84 | 3 | 3 | 1.16 | 4B |
| Flow Assurance | `/dashboard/apps/flowassurance` | `pages/apps/FlowAssuranceLearningPage.jsx` | 5 / 4 | 229 | 56 | 3 | 3 | 1.31 | 4B |
| Network | `/dashboard/apps/network` | `pages/apps/NetworkLearningPage.jsx` | 6 / 5 | 283 | 43 | 3 | 3 | 1.50 | 4C |
| Intervention | `/dashboard/apps/intervention` | `pages/apps/InterventionLearningPage.jsx` | 5 / 4 | 199 | 49 | 3 | 3 | 1.18 | 4C |
| Surveillance | `/dashboard/apps/surveillance` | `pages/apps/SurveillanceLearningPage.jsx` | 5 / 4 | 272 | 63 | 3 | 3 | 1.50 | 4C |

#### Course apps: economics (6)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Cashflow | `/dashboard/apps/cashflow` | `pages/apps/CashflowLearningPage.jsx` | 5 / 4 | 145 | 49 | 21 | 3 | 1.01 | 4D |
| Fiscal | `/dashboard/apps/fiscal` | `pages/apps/FiscalLearningPage.jsx` | 6 / 5 | 136 | 59 | 10 | 3 | 0.97 | 4D |
| Uncertainty | `/dashboard/apps/uncertainty` | `pages/apps/UncertaintyLearningPage.jsx` | 5 / 4 | 117 | 39 | 3 | 3 | 0.84 | 4D |
| Decision | `/dashboard/apps/decision` | `pages/apps/DecisionLearningPage.jsx` | 6 / 5 | 74 | 14 | 3 | 2 | 0.62 | 4D |
| Portfolio | `/dashboard/apps/portfolio` | `pages/apps/PortfolioLearningPage.jsx` | 5 / 4 | 100 | 19 | 4 | 2 | 0.74 | 4D |
| Fdp | `/dashboard/apps/fdp` | `pages/apps/FdpLearningPage.jsx` | 5 / 4 | 83 | 37 | 3 | 3 | 0.70 | 4D |

#### Course apps: facilities (9)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Separation | `/dashboard/apps/separation` | `pages/apps/SeparationLearningPage.jsx` | 5 / 4 | 102 | 37 | 12 | 3 | 0.80 | 5A |
| Line Sizing | `/dashboard/apps/linesizing` | `pages/apps/LineSizingLearningPage.jsx` | 5 / 4 | 105 | 42 | 24 | 3 | 0.84 | 5A |
| Rotating | `/dashboard/apps/rotating` | `pages/apps/RotatingLearningPage.jsx` | 6 / 4 | 159 | 67 | 30 | 3 | 1.11 | 5A |
| Gas Processing | `/dashboard/apps/gasprocessing` | `pages/apps/GasProcessingLearningPage.jsx` | 5 / 4 | 91 | 48 | 21 | 3 | 0.79 | 5A |
| Relief | `/dashboard/apps/relief` | `pages/apps/ReliefLearningPage.jsx` | 6 / 4 | 86 | 118 | 24 | 3 | 0.92 | 5A |
| Heat Transfer | `/dashboard/apps/heattransfer` | `pages/apps/HeatTransferLearningPage.jsx` | 7 / 5 | 85 | 47 | 10 | 3 | 0.75 | 5B |
| Metering | `/dashboard/apps/metering` | `pages/apps/MeteringLearningPage.jsx` | 6 / 5 | 135 | 48 | 22 | 4 | 0.97 | 5B |
| Produced Water | `/dashboard/apps/producedwater` | `pages/apps/ProducedWaterLearningPage.jsx` | 6 / 4 | 87 | 38 | 18 | 3 | 0.75 | 5B |
| Corrosion | `/dashboard/apps/corrosion` | `pages/apps/CorrosionLearningPage.jsx` | 6 / 4 | 97 | 33 | 18 | 3 | 0.78 | 5B |

#### Course apps: assurance (2)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Risk Change | `/dashboard/apps/riskchange` | `pages/apps/RiskChangeLearningPage.jsx` | 6 / 5 | 88 | 2 | 15 | 3 | 0.68 | 5B |
| Compliance | `/dashboard/apps/compliance` | `pages/apps/ComplianceLearningPage.jsx` | 6 / 4 | 93 | 24 | 20 | 3 | 0.75 | 5B |

#### Course apps: hse (5)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Safety Stats | `/dashboard/apps/safetystats` | `pages/apps/SafetyStatsLearningPage.jsx` | 6 / 2 | 62 | 8 | 10 | 1 | 0.58 | 5C |
| Hygiene | `/dashboard/apps/hygiene` | `pages/apps/HygieneLearningPage.jsx` | 6 / 3 | 61 | 0 | 6 | 0 | 0.55 | 5C |
| Lopa | `/dashboard/apps/lopa` | `pages/apps/LopaLearningPage.jsx` | 6 / 2 | 63 | 0 | 12 | 0 | 0.57 | 5C |
| Qra | `/dashboard/apps/qra` | `pages/apps/QraLearningPage.jsx` | 6 / 2 | 62 | 0 | 9 | 0 | 0.56 | 5C |
| Consequence | `/dashboard/apps/consequence` | `pages/apps/ConsequenceLearningPage.jsx` | 6 / 2 | 63 | 0 | 12 | 0 | 0.57 | 5C |

#### Course apps: data and AI (5)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Data Qc | `/dashboard/apps/dataqc` | `pages/apps/DataQcLearningPage.jsx` | 7 / 2 | 63 | 12 | 9 | 2 | 0.59 | 5D |
| Ml Core | `/dashboard/apps/mlcore` | `pages/apps/MlCoreLearningPage.jsx` | 7 / 2 | 67 | 4 | 12 | 1 | 0.59 | 5D |
| Facies | `/dashboard/apps/facies` | `pages/apps/FaciesLearningPage.jsx` | 7 / 3 | 69 | 0 | 12 | 0 | 0.59 | 5D |
| Forecastml | `/dashboard/apps/forecastml` | `pages/apps/ForecastmlLearningPage.jsx` | 7 / 2 | 68 | 0 | 12 | 0 | 0.59 | 5D |
| Appliedai | `/dashboard/apps/appliedai` | `pages/apps/AppliedaiLearningPage.jsx` | 7 / 2 | 68 | 0 | 12 | 0 | 0.59 | 5D |

#### Course apps: midstream, downstream and energy transition (5)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Crude | `/dashboard/apps/crude` | `pages/apps/CrudeLearningPage.jsx` | 6 / 3 | 79 | 22 | 11 | 3 | 0.67 | 5D |
| Refinery | `/dashboard/apps/refinery` | `pages/apps/RefineryLearningPage.jsx` | 6 / 5 | 88 | 6 | 10 | 3 | 0.68 | 5D |
| Supply | `/dashboard/apps/supply` | `pages/apps/SupplyLearningPage.jsx` | 6 / 5 | 88 | 9 | 12 | 3 | 0.69 | 5D |
| Gasvalue | `/dashboard/apps/gasvalue` | `pages/apps/GasvalueLearningPage.jsx` | 6 / 5 | 107 | 13 | 15 | 3 | 0.77 | 5C |
| Carbon | `/dashboard/apps/carbon` | `pages/apps/CarbonLearningPage.jsx` | 6 / 5 | 99 | 10 | 12 | 3 | 0.73 | 5C |

#### Course apps: commercial and trading (9)

| Screen | Route | Entry | Own files / with colour | Legacy classes | Hex in SVG/style | Status hues | Chart files | Effort (VRR) | Batch |
|---|---|---|---|---|---|---|---|---|---|
| Procurement | `/dashboard/apps/procurement` | `pages/apps/ProcurementLearningPage.jsx` | 7 / 2 | 69 | 0 | 12 | 0 | 0.59 | 6A |
| Marine | `/dashboard/apps/marine` | `pages/apps/MarineLearningPage.jsx` | 8 / 2 | 103 | 0 | 15 | 0 | 0.73 | 6A |
| Pia | `/dashboard/apps/pia` | `pages/apps/PiaLearningPage.jsx` | 7 / 2 | 69 | 0 | 12 | 0 | 0.59 | 6A |
| Gsa | `/dashboard/apps/gsa` | `pages/apps/GsaLearningPage.jsx` | 7 / 2 | 74 | 0 | 15 | 0 | 0.62 | 6A |
| Joa | `/dashboard/apps/joa` | `pages/apps/JoaLearningPage.jsx` | 7 / 2 | 91 | 0 | 15 | 0 | 0.69 | 6A |
| Farmout | `/dashboard/apps/farmout` | `pages/apps/FarmoutLearningPage.jsx` | 7 / 3 | 97 | 0 | 18 | 0 | 0.72 | 6A |
| Prms | `/dashboard/apps/prms` | `pages/apps/PrmsLearningPage.jsx` | 7 / 2 | 99 | 0 | 15 | 0 | 0.72 | 6A |
| Materials | `/dashboard/apps/materials` | `pages/apps/MaterialsLearningPage.jsx` | 8 / 3 | 100 | 0 | 18 | 0 | 0.73 | 6A |
| Contracts | `/dashboard/apps/contracts` | `pages/apps/ContractsLearningPage.jsx` | 2 / 1 | 30 | 0 | 0 | 0 | 0.42 | 6A |

### Batches

| Batch | Contents | Effort (VRR) | Registry file |
|---|---|---|---|
| 0 | plumbing (tokens, theme.css, provider, registry, cold load, test helpers), ui kit, header, notification bell, view-as selector, toaster, dashboard home (four role homes), activation banner | done | `rollout/w0.js`: `/dashboard` |
| 1A | the sidebar rail and course nav (dark ink rail under `FixedTheme`, section 5.2), global search modal (follows the active theme like the toaster), device guard, `/search`, the modules placeholder | 2.1 | `w1a.js` |
| 1B | course kit (`LearningModeGate`, `DeepCourseBanner`, `petrophysics/panelKit`, `CapstoneCaseFiles`, `LockedCard`, `QuizRunner`, the three practice-course pieces) scope-aware with `useThemeClass`; the chart kit (section 4); no routes | about 3 | `w1b.js` (empty) |
| 1C | course reader (course home, module, lesson reader with its renderer kit, module quiz, final exam, capstone redirect) and the course handbook frame | 4.8 | `w1c.js`: `/dashboard/apps/:slug/course/*`, `/dashboard/admin/handbook` |
| 2A | enroll, get started, devices, prerequisite waiver, my certificates (frame), settings, notifications, sponsor console | 4.4 | `w2a.js` |
| 2B | academy doors, certifications, user directory, audit logs, super admins, system settings | 3.6 | `w2b.js` |
| 2C | live monitoring, system analytics, `/dashboard/analytics`, `/dashboard/compliance`, `/dashboard/reports`, admin roles (owns `charts/DashboardWidgets`) | 3.7 | `w2c.js` |
| 3A | petrophysics, well data, well correlation, seismolord, mapping | 3.8 | `w3a.js` |
| 3B | reservoircalc, rock physics, pore pressure, earth model, basin | 3.3 | `w3b.js` |
| 3C | DCA, material balance, SCAL, waterflood, simulation, fluid, well test | 5.0 | `w3c.js` |
| 3D | well design, torque and drag, hydraulics, well control, geomechanics, casing and tubing | 4.2 | `w3d.js` |
| 3E | cementing, completion, perforation and sand control, stimulation, integrity, well cost (split after three if long) | 5.4 | `w3e.js` |
| 4A | nodal, gas lift, ESP | 3.9 | `w4a.js` |
| 4B | rod pump, gas well, flow assurance | 3.9 | `w4b.js` |
| 4C | network, intervention, surveillance | 4.2 | `w4c.js` |
| 4D | cash flow, fiscal, uncertainty, decision, portfolio, FDP | 4.9 | `w4d.js` |
| 5A | separation, line sizing, rotating equipment, gas processing, relief | 4.5 | `w5a.js` |
| 5B | heat transfer, metering, produced water, corrosion, risk and change, compliance | 4.7 | `w5b.js` |
| 5C | safety statistics, hygiene, LOPA, QRA, consequence, gas value, carbon | 4.3 | `w5c.js` |
| 5D | data QC, ML core, facies, forecast ML, applied AI, crude, refinery, supply (split after the five data and AI apps if long) | 5.0 | `w5d.js` |
| 6A | procurement, marine, PIA, GSA, JOA, farmout, PRMS, materials, contracts (one panel pattern; split after five if long) | 5.8 | `w6a.js` |
| 6B | login, register, verify, forgot and reset password, the three legal pages (with `LegalPageLayout`, `PolicySection`, `Footer`) and the 404 page: always light, no toggle | 3.9 | `PUBLIC_LIGHT_ROUTES` in `scopePaths.jsx` |
| 7 | end state (section 9) | about 2 | deletes the registry |

A course app batch registers each app as `'/dashboard/apps/<slug>'` (exact);
its course reader pages are 1C's pattern entry.

## 4. Shared components and kits

Ownership follows the Suite's rule (lead decision 4): if every screen that
uses a shared file is in one batch, that batch owns it and moves it straight
to roles; otherwise the file becomes scope-aware with `useThemeClass`
(byte-identical legacy output outside a scope) and the batch proves the
other users unchanged.

| Kit | Used by | State after wave 0 | Owner |
|---|---|---|---|
| `components/ui/*` (the 21 pieces in use) | every screen | scope-aware (section 7) | wave 0 |
| `ThemeToggle` (`components/ui/theme-toggle.jsx`) | the header | new, Suite copy | wave 0 |
| `Header`, `NotificationBell`, `ViewAsSelector` | every signed-in screen | scope-aware | wave 0 |
| `Toaster` / `toast` | app root | follows the active theme (`design/activeTheme.js`) | wave 0 |
| `Sidebar`, `CourseModuleNav` | every signed-in screen | legacy | 1A |
| `GlobalSearchModal`, `DeviceGuard` | app root | legacy | 1A |
| course kit: `LearningModeGate` (79), `DeepCourseBanner` (79), `petrophysics/panelKit` (71), `CapstoneCaseFiles` (16), `LockedCard` (5), `QuizRunner` (3), practice-course pieces (2 to 5) | course apps, reader, homepage (badge) | legacy | 1B, scope-aware |
| per-course `panelBits` and lab views | one course app each (plus the reader and handbook hubs) | legacy | that app's batch, scope-aware while the reader and handbook are unmigrated |
| lesson renderer (`MarkdownLesson` and the reader's own files) | reader, handbook | legacy | 1C |
| `charts/DashboardWidgets` | 3 admin pages | legacy | 2C |
| legal kit (`LegalPageLayout`, `PolicySection`, `Footer`) | 3 legal pages | legacy | 6B |

Most shared files with legacy colours, by the number of screens that pull
them (ui kit excluded):

| File | Screens | Legacy | Hex | Hues |
|---|---|---|---|---|
| `components/academy/LearningModeGate.jsx` | 79 | 13 | 0 | 0 |
| `components/course/DeepCourseBanner.jsx` | 79 | 7 | 0 | 0 |
| `components/course/panels/petrophysics/panelKit.jsx` | 71 | 19 | 0 | 0 |
| `components/course/CapstoneCaseFiles.jsx` | 16 | 9 | 0 | 0 |
| `components/course/PracticeCourseBadge.jsx` | 5 | 0 | 0 | 3 |
| `components/course/LockedCard.jsx` | 5 | 5 | 0 | 0 |
| `components/legal/PolicySection.jsx` | 3 | 8 | 0 | 0 |
| `components/legal/LegalPageLayout.jsx` | 3 | 38 | 0 | 0 |
| `components/Footer.jsx` | 3 | 52 | 0 | 0 |
| `components/charts/DashboardWidgets.jsx` | 3 | 22 | 7 | 1 |
| `components/course/QuizRunner.jsx` | 3 | 38 | 0 | 4 |
| `components/course/PracticeCertificateCard.jsx` | 2 | 15 | 0 | 1 |
| `components/course/PracticeCourseNotice.jsx` | 2 | 2 | 0 | 3 |

## 5. Scope strategy

### 5.1 One scope at the signed-in layout, from the start

The Suite wrapped each app in its own `<ThemedApp>` during its rollout and
moved to one dashboard scope only at the end (its batch 7A), then deleted
the per-app wraps. NextGen has no per-app wrap history, so it starts where
the Suite finished: **one scope in `Layout`** (`src/design/SignedInScope.jsx`),
around the header and the page column. Pages never wrap themselves.

While the rollout runs, `Layout` opens the scope only on the routes a batch
has registered (`src/design/rollout/<batch>.js`, pre-created for every batch
so parallel batches never edit the same file; `isThemedPath` in
`src/design/scopePaths.jsx` reads them). An unregistered route renders
exactly what it rendered before; the pilot test proves it on
`/dashboard/modules/*`. The same registry drives the cold-load loader in
`App.jsx`, so a themed route paints the device's last theme before the
session restores.

Why a gate at the layout and no per-page wrap:

- one provider, one storage listener and one toggle state for every
  signed-in page, from the first batch;
- a batch touches only its own files and its registry file; `Layout` stays as it is;
- the end state is two deletions (the gate and the registry), with no wrap
  to find and remove in 100 screens.

### 5.2 The frame

- **Header.** Inside the scope, on roles, with the `ThemeToggle` next to the
  notification bell. Done in wave 0.
- **Sidebar rail.** Outside the scope. It keeps a dark rail in both themes,
  as the Suite decided at its pilot 1 (lead decision 1). In wave 0 it is
  still NextGen's legacy slate rail with the lime active item; 1A moves it
  to the family's dark ink rail under `FixedTheme theme="dark"` (owner
  decision item 1 in section 10).

### 5.3 Public and auth pages: always light

As the Suite's batch 7C: login, register, the certificate verify page, the
password pages, the three legal pages and the 404 page render light with no
toggle and no per-user choice, in their own fixed light scope
(`FixedTheme theme="light"` plus `data-pl-theme="light" data-pl-root`), and
their loader paints light (`PUBLIC_LIGHT_ROUTES`). The regal homepage stays
out (section 2).

### 5.4 Storage and origin

The choice is stored per user under `petrolord.theme.v1:<user id>`, the
Suite's key, with the device key `petrolord.theme.v1.last` for the cold
load. NextGen is served from its own origin (`nextgen.petrolord.com`; the
Suite is `petrolord.com`) and signs users in against its own Supabase
project, so browser storage is separate and the user ids differ: a choice
made in the Suite does not carry over to NextGen, and the other way round.
The key has the same shape in both apps so that a future shared origin or
identity would carry it with no code change. The operating-system colour
preference is not read (light by default).

## 6. Dark canvases and charts

- **Charts stay white.** The family's chart standard is a white plot in
  both themes (the Suite's `chartTheme` with `ChartLogo`, and `ChartPanel`
  for a whole card). NextGen's course panels draw about 180 charts, today on
  dark plates (`bg-[#0F172A]`, slate grids, lime `#BFFF00` series): 145
  files use `recharts` and 34 draw hand-made SVG. 1B ports the Suite's
  `utils/chartTheme.js`, `components/charts/ChartLogo.jsx` and
  `ChartFrame`, and adds a small helper for the hand-made SVG plots (white
  plate, family grid and axis colours, the five `CHART_SERIES` colours
  validated on white). Each course app batch then moves its own charts:
  the plot region carries `data-canvas="chart"` (white in both themes,
  skipped by the legacy-chrome check), and every series colour comes from
  the chart theme. Lime fails contrast on white and does not survive on a
  chart.
- **Dark canvases.** NextGen has no WebGL, map or 3D viewer. The seismic
  views in the Seismolord course (wedge, synthetic and shift explorers) are
  SVG charts and follow the white chart standard; a batch that keeps a
  plate dark on purpose (a seismic amplitude section, for example) marks it
  `data-canvas="dark"` and says so in its pull request.
- **Documents.** Certificates and printable pages are
  `data-canvas="document"` regions (section 2).

## 7. The ui kit: scope-aware until the rollout finishes

Every screen will be migrated in this one programme, which argued for the
simpler option of moving the kit straight to roles. That option fails on
the calendar: wave 0 ships with one themed screen, and the other 118 keep
their dark look for weeks while batches land. A kit that renders roles
everywhere would turn every unmigrated screen into light controls on dark
pages.

So the kit follows the Suite's method: each piece asks `useDsTheme()` (or
`useThemeClass`, `src/design/themeClass.js`) and renders the Suite's
current classes on theme roles inside a scope, and its own legacy classes,
byte for byte, outside one. Portal content (select, dialog, alert dialog,
dropdown menu, popover, tooltip) carries the scope attribute through
`usePortalThemeProps`, so its roles resolve in `document.body`. The input,
textarea and select trigger inside a scope are the Suite's current input
styling.

It is cheaper here than in the Suite. NextGen's kit is mostly stock shadcn
token classes (`bg-background`, `text-muted-foreground`), which the scoped
`theme.css` already re-points; only 21 pieces are in use, and only 13 files
held hard-coded colours. The pieces nobody imports (accordion, calendar,
carousel, command, drawer, menubar and 17 more) were left alone; the end
state deletes or adapts them.

The legacy branch is proven unchanged by `src/design/__tests__/legacyUi.test.jsx`:
the markup of every adapted piece (all variants, portals open) was captured
from main before any ui file changed (`fixtures/legacyUiMarkup.json`) and
must match exactly. Wave 7 deletes the legacy branches and that fixture.

## 8. The recipe for a batch

1. Worktree from `origin/main` (NextGen does not track `node_modules`;
   symlink it from the primary checkout, or hard-link a copy if you need to
   add a package). Never edit the primary checkout.
2. List your routes in your own `src/design/rollout/<batch>.js`. Do not
   edit `rollout/index.js`, `Layout` or `src/design/**`.
3. Migrate the screens' own classes to `pl-*` roles (`bg-pl-surface`,
   `text-pl-muted`, `border-pl-border` ...). Status colour only through the
   status roles and the `Badge` or `Alert` status variants. Lime
   `#BFFF00` maps to `primary` for actions and `accent` (gold) for
   highlights.
4. Shared files: section 4's rule. Use `useThemeClass` when an unmigrated
   screen still renders the file, and prove the other users unchanged.
5. Charts to the white standard with the 1B chart kit (`data-canvas="chart"`);
   deliberate dark plates `data-canvas="dark"`; documents
   `data-canvas="document"`.
6. Add the screen's theme test (section 9). Existing tests pass unchanged
   apart from pure class-string assertions, which you update with a note.
7. No behaviour, copy or calculation change. Copy you touch follows the
   family copy rule in the Suite's `docs/scope/DesignSystem.md`.
8. Look at your screens from a private dev server (own port, private vite
   cache in your scratch directory): light at 1440 and 390, one dark check
   each. `npm run build` passes (on Node 18 with
   `NODE_OPTIONS=--experimental-global-webcrypto`).
9. Pull request against `main`, merged with `--squash` by the lead.

## 9. Test strategy

NextGen runs `vitest` (`vitest.config.js`, `npm test`). Wave 0 adds `jsdom`
as a dev dependency so a test file can opt in to a DOM with
`// @vitest-environment jsdom` on its first line; every other suite keeps the
node environment it had.

| Test | What it proves |
|---|---|
| `src/design/__tests__/tokens.test.js` | every token value matches the Suite (a pinned sha256 of the Suite's `tokens.js` at `e7807a1da`, with a negative control); WCAG AA for every text role in both themes, also after HSL rounding; `theme.css` is the generator's output and every rule is scoped under `[data-pl-theme]`; the scope re-points every shadcn variable `index.css` defines; `tailwind.config.js` exposes every role |
| `src/design/__tests__/ThemeProvider.test.jsx` | the Suite storage key; light by default with the OS preference ignored; toggle round trip stored per user; another user gets light; the auth context user; the cold-load last theme; another tab's change; blocked storage; nested scopes; the toggle hidden outside a scope and in a fixed scope; `useThemeClass`; the route registry matcher and the cold-load theme |
| `src/design/__tests__/legacyUi.test.jsx` | the ui kit outside a scope renders the captured pre-wave-0 markup byte for byte |
| `src/design/__tests__/uiKitScope.test.jsx` | inside a scope, in both themes, every adapted piece renders roles only; portals carry the scope attribute; the root toaster follows the themed screen; the detector's negative control |
| `src/pages/__tests__/DashboardHome.theme.test.jsx` | the pilot, mounted as its route mounts it (Layout, header, DashboardPage): light by default, the header toggle to dark and back with the stored choice, no legacy chrome with a planted negative control, clean in dark, the user menu portal themed, the route registered, and an unregistered route left legacy |

Each batch adds one theme test per screen with
`describeScreenTheme({ name, route, renderScreen, ready, userId })` from
`src/design/testing/themeAssertions.js` (the Suite's four checks: light by
default, toggle round trip, no legacy chrome with a negative control, route
registered), and uses `expectNoLegacyChrome()` for further states (tabs,
dialogs, results). The pilot test is the worked example of a harness that
mounts `Layout` with a signed-in user and mocked services.

The detector (`LEGACY_CHROME_TOKEN`) flags any Tailwind palette colour on a
colour utility, white text, black or translucent white fills, gradients and
arbitrary hex classes, so NextGen's `bg-[#1E293B]` and `text-[#BFFF00]` are
caught. Regions marked `data-canvas` are skipped.

## 10. Decisions for the owner

1. **The sidebar rail.** Proposed: the Suite's dark ink rail in both themes
   (the Suite's lead decision 1). The alternative is a light rail in light.
2. **Lime retires from the signed-in screens.** NextGen's console accent is
   lime `#BFFF00`; the family's is petrol green (actions) and gold
   (highlights), which the regal homepage already uses. Proposed: lime goes
   everywhere the rollout reaches (it fails contrast on the light theme and
   on white charts). The pilot already shows the result.
3. **Printable pages and certificates stay as designed** (section 2),
   including the handbook's document body and the certificate sheet.
4. **The public verify page is always light** with the other public pages,
   while the certificate on it keeps its artwork.

## 11. End state (wave 7)

- `Layout` renders `SignedInScope` unconditionally; `src/design/rollout/`
  and the gate in `scopePaths.jsx` are deleted; the cold-load loader themes
  every signed-in route.
- The ui kit, header, frame and shared kits drop their legacy branches and
  render roles only; `legacyUi.test.jsx` and its fixture are deleted; the
  unused ui pieces are deleted or adapted.
- `index.css` `:root` keeps only what the public frame and the homepage
  need.

## 12. As built: wave 0

- `src/design/`: `tokens.js`, `themeCss.js`, generated `theme.css` (byte
  identical to the Suite's), `themeContext.js`, `activeTheme.js`,
  `themeClass.js`, `ThemeProvider.jsx` (`ThemedApp`, `ThemeProvider`,
  `FixedTheme`), `SignedInScope.jsx`, `scopePaths.jsx` (registry matcher,
  cold load, `ThemedLoadingScreen`), `rollout/` (one file per batch),
  `testing/themeAssertions.js`, `testing/domShims.js`, `index.js`.
  `scripts/design/build-theme-css.mjs` regenerates `theme.css`.
- `tailwind.config.js` gains the `pl-*` colours, fonts, shadows and the
  canvas radius, as in the Suite. `main.jsx` imports `theme.css` after
  `index.css`. `SupabaseAuthContext` exports `AuthContext` so the scope can
  read the user without a provider.
- ui kit: button, badge, card, input, textarea, select, tabs, dialog, alert
  dialog, dropdown menu, switch, checkbox, radio group, alert, table,
  progress, popover, tooltip and toast are scope-aware; `theme-toggle.jsx`
  is new. Label, separator, avatar and scroll area were left unchanged:
  their token classes already resolve to the right roles inside a scope.
- Frame: `Layout` gates the scope; `Header`, `NotificationBell` and
  `ViewAsSelector` are scope-aware; the header shows the toggle.
- Pilot: the four dashboard homes and the activation banner on roles, with
  page padding (`px-4 py-8 md:px-8`) the legacy page never had.
- Token values must match the Suite. Change the Suite's `tokens.js` first,
  copy it here, regenerate `theme.css`, and update `SUITE_TOKENS_DIGEST` in
  `tokens.test.js`.

## 13. As built: wave 7 (end state)

The rollout is finished. Every screen batch (wave 0, 1A to 6B) is merged and
this batch removes the scaffolding.

- **Gate off.** `Layout` renders `SignedInScope` on every route it serves
  (the framed return and the fullscreen return). `src/design/rollout/` is
  deleted. `scopePaths.jsx` keeps only what the cold load needs:
  `isSignedInPath` (any `/dashboard` path and `/search`), `isPublicLightPath`
  and `coldLoadTheme`, which now always returns a theme (the device's last
  theme on a signed-in path, light everywhere else). `App.jsx` has one
  loader, the themed one.
- **Legacy branches out.** Every `tc(legacy, themed)` call became its themed
  string (a codemod over 49 files) and `src/design/themeClass.js`
  (`useThemeClass`, `themeClassPicker`) is deleted. The ui kit keeps one
  variant set per primitive (`buttonVariants`, `badgeVariants`,
  `alertVariants`, `toastVariants`; the `themed*` exports are gone), and
  `ThemeToggle` is the only ui piece that reads the theme. The course kit,
  the 3C reservoir panels, the Well Correlation case inputs, the header, the
  notification bell and the view-as selector render roles only.
- **Route to scope map** (pinned by `src/design/__tests__/endState.test.js`):

  | Routes | Scope |
  |---|---|
  | `/search`, `/dashboard/analytics`, `/dashboard/compliance`, `/dashboard/reports`, `/dashboard/certificates`, `/dashboard/*` | `SignedInScope` (Layout) |
  | `/login`, `/register`, `/verify`, `/verify/:code`, `/forgot-password`, `/reset-password`, `/privacy-policy`, `/terms-of-service`, `/academic-integrity`, `*` (404) | `PublicPage`, always light |
  | `/` | the regal homepage's own look (`.ng-home`), no kit component |
  | the sidebar rail and its phone drawer | `FixedTheme` dark (ink) |
  | the toaster, the search modal, the device limit dialog (app root) | the theme of the scope on screen, light where none is mounted |
  | the loader (`ThemedLoadingScreen`) and the `ErrorBoundary` panel | a scope of their own (the device's last theme) |
  | the certificate viewer overlay | toolbar in `FixedTheme` dark; the sheet is `data-canvas="document"` |

  Two places rendered kit components outside a scope and were given one:
  the root `ErrorBoundary` panel (it was slate on slate) and the certificate
  viewer's toolbar (a lime Print button on the kit `Button`, in
  `document.body`). The certificate sheet itself is unchanged.
- **Dark defaults retired.** `Layout`'s outer `bg-[#0F172A]` is gone.
  `index.css` `:root` holds the light scope's shadcn values (pinned against
  `theme.css` by `tokens.test.js`); the dark console variables, the
  `#0F172A` body paint, the lime video variables and the unused video
  player classes are gone. The homepage keeps its own stylesheet.
- **Retired proofs.** `legacyUi.test.jsx` and `legacyUiMarkup.json`,
  `courseKitLegacy.test.jsx` and its fixture, `rc3cPanelsLegacy.test.jsx` and
  `rc3cLegacyClasses.json`, `frame1aLegacyMarkup.json`, the `useThemeClass`
  test and the ChartPanel outside-scope test. The `/legacy-probe` negatives
  now prove that a route no batch ever listed is scoped like every other.
- **Sweep and guard.** `endState.test.js` walks the import graph from
  `src/main.jsx` (621 code files) and fails on lime (`#BFFF00`, `#A8E600`,
  `lime-*`), a legacy console colour class or a console plate hex outside
  three named allowances: the homepage, the white chart kit
  (`ChartFrame`, `SvgChartFrame`, `chartTheme.js`) and the two document
  canvases (the certificate sheet, the printable handbook). `print:`
  variants are allowed. Each detector has a negative control. The sweep
  found nothing else once the items below were fixed.
- **Small fixes in this batch.** The last lime on a chart (the reservoircalc
  P-1 marker is the kit violet; two lesson sentences say violet, in their
  own commit). Phone navigation: the header menu button opens the ink rail
  in a modal drawer below md (starts closed; closes on navigation, Escape,
  the scrim and at md; focus is trapped and returns to the button). Copy:
  the set password page says "activate your account", the forgot password
  placeholder is `you@example.com`, the login title is "Petrolord NextGen".
  Dead links: Academic Integrity's `/support` and `/community` cards became
  one card to the academy email, and the legal footer's four `href="#"`
  social icons are removed. The panel tables key their header cells by
  index and text (44 files), which ends the duplicate-key warnings.
- **Still legacy, by decision or out of reach.** The regal homepage and its
  own lime token; the certificate sheet and the handbook document body;
  the chart kit's fixed light classes on white plates. 134 source files are
  not reachable from `src/main.jsx` (35 unused `components/ui` pieces among
  them, 18 files with legacy colour classes); nothing renders them, and
  this batch left them for a cleanup batch.

