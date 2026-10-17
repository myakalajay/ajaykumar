import { SectionHeading } from './fx';

/** Cross-referenced skills that the CV lists as non-negotiable for the lead role. */
export const requiredSkillRows = [
  'Service Designer',
  'Customer Experience (CX) Enhancement',
  'Digital Transformation',
  'blueprinting tools',
  'Figma',
  'Bizagi',
  'Dubai Services Framework',
  'Digital Readiness Assessment',
  'Stakeholder Engagement & Validation',
] as const;

/**
 * Required-skills checklist — the skills the CV lists as non-negotiable for the
 * lead consulting role.
 *
 * The section is plain by design: a two-row table reads as a document rather
 * than a widget, with amber indicating which row is a category rather than a
 * single skill. No colours, no pills, no interaction to discover.
 */
export default function RequiredSkills() {
  return (
    <section className="gutter mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white" aria-label="Required skills">
      {/* subtle shadow below the whole check — the table is the document */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-white/60" />

      <div className="p-6 sm:p-8">
        <SectionHeading
          kicker="Tools"
          title="Required Skills"
          script="what the job asks for"
        />

        <div className="mt-6 overflow-x-auto border border-slate-200 rounded-xl bg-slate-50/40">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="bg-blue-800/90 text-slate-100">
                <th
                  scope="col"
                  className="w-48 px-4 py-3.5 text-left font-semibold tracking-wide sm:w-56"
                  aria-label="Skill"
                >
                  Skill
                </th>
                <th scope="col" className="px-4 py-3.5 text-right font-semibold tracking-wide">
                  — 9 of 9
                </th>
              </tr>
            </thead>
            <tbody>
              {requiredSkillRows.map((skill) => (
                <tr
                  key={skill}
                  className="border-t border-slate-200 last:border-0"
                >
                  <td className="px-4 py-3.5 text-slate-700">{skill}</td>
                  <td className="px-4 py-3.5 text-right text-slate-400">
                    {skill.startsWith('blueprinting') ? (
                      <span
                        aria-label="blueprinting tools is a category, not a single skill"
                        className="inline-flex items-center gap-1.5 text-slate-400"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        blueprinting tools
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        meets requirement
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            9 skills on the required list
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            individual skills — one row per item
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            category row — listed once, under the category name
          </span>
        </div>
      </div>
    </section>
  );
}
