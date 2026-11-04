import type { CSSProperties } from "react";
import Experience from "@/components/Experience";
import SoundToggle from "@/components/SoundToggle";
import { CONTACT, FIELDS, METRICS, PROFILE, PROJECTS, ROLES, STACK, type Work } from "@/data/content";

const NAV = [
  ["fields", "Fields"],
  ["journey", "Journey"],
  ["work", "Work"],
  ["contact", "Contact"],
];

function Entry({ work }: { work: Work }) {
  return (
    <article className="entry" data-company={work.company} data-r style={{ "--c": `var(--c-${work.company})` } as CSSProperties}>
      <header>
        <h3>{work.name}</h3>
        <a href={work.link.href} target="_blank" rel="noreferrer">
          {work.link.label}
        </a>
      </header>
      <p className="meta">
        {work.role}, {work.period}
        {work.location ? `, ${work.location}` : ""}
      </p>
      <ul>
        {work.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <p className="meta">{work.stack}</p>
    </article>
  );
}

/** Interaction hint, worded for mouse or touch. */
function Hint({ lead, mouse, touch }: { lead: string; mouse: string; touch: string }) {
  return (
    <p className="hint" data-r>
      {lead} <span className="mouse">{mouse}</span>
      <span className="touch">{touch}</span>
    </p>
  );
}

export default function Home() {
  return (
    <>
      <Experience />
      <header className="nav">
        <a href="#hero" className="brand">
          {PROFILE.name}
        </a>
        <nav aria-label="Sections">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <SoundToggle />
      </header>

      <main>
        <section id="hero" className="sec">
          <div className="copy">
            <h1 data-r>
              <span className="nowrap">Rishabh Varshney</span> builds software that answers.
            </h1>
            <p className="lede" data-r>
              Software engineer shipping real-time calling, cloud and AI systems from Hyderabad.
            </p>
            <div className="actions" data-r>
              <a className="btn" href={CONTACT.resume}>
                Resume
              </a>
              <a href="#contact">Get in touch</a>
            </div>
            <Hint lead="Sixty-four pendulums, one for every month since August 2021." mouse="Sweep across them to set them swinging." touch="Tap one to see its month." />
          </div>
        </section>

        <section id="fields" className="sec">
          <div className="copy">
            <h2 data-r>Ten-plus fields, one engineer.</h2>
            <dl className="metrics" data-r>
              {METRICS.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="fields" data-r>
              {FIELDS.map((f) => (
                <li key={f.name}>
                  {f.name} <span>{f.source}</span>
                </li>
              ))}
            </ul>
            <Hint lead="The pendulums are now a harp." mouse="Run your cursor across the strings, with sound on." touch="Drag sideways across the strings, with sound on." />
          </div>
        </section>

        <section id="journey" className="sec">
          <div className="copy">
            <h2 data-r>Five years, month by month.</h2>
            <Hint lead="Each block is a month, coloured by where I worked." mouse="Hover a role to light up its months." touch="Tap a block to see its month." />
            {ROLES.map((r) => (
              <Entry key={r.name} work={r} />
            ))}
          </div>
        </section>

        <section id="work" className="sec">
          <div className="copy">
            <h2 data-r>Freelance work.</h2>
            <Hint lead="Every month is now a card; the two raised cards are these projects." mouse="Hover a card to pull it out." touch="Tap a card to see its month." />
            {PROJECTS.map((p) => (
              <Entry key={p.name} work={p} />
            ))}
            <h3 className="toolbox" data-r>
              Toolbox
            </h3>
            <dl className="stack" data-r>
              {STACK.map((s) => (
                <div key={s.group}>
                  <dt>{s.group}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="contact" className="sec">
          <div className="copy">
            <h2 data-r>Let’s talk.</h2>
            <p className="lede" data-r>
              Open to the next team and the next hard problem.
            </p>
            <div className="actions" data-r>
              <a className="btn" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              <a href={CONTACT.resume}>Resume</a>
              <a href={CONTACT.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <Hint lead="All sixty-four months, woven into one ribbon." mouse="Move near it and it follows." touch="Tap it to see a month." />
            <p className="foot">
              © 2026 {PROFILE.name}, {PROFILE.location}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
