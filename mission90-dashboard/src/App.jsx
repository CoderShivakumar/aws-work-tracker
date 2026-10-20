
import { useEffect, useState } from "react";
import "./App.css";

const START_DATE = "2026-10-20";

const motivations = [
  "You don't need to be perfect. You need to show up.",
  "Every problem you solve is an investment in your future.",
  "Discipline is choosing your future over your comfort.",
  "Build your skills in silence. Let your work speak.",
  "Small steps every day create extraordinary results.",
  "Compete with yesterday's version of yourself.",
  "Keep learning. Keep building. Keep becoming.",
];

const API_URL =
  "https://3xis3rh2pl.execute-api.ap-southeast-2.amazonaws.com";


function getDay() {
  const [year, month, day] = START_DATE.split("-").map(Number);
  const start = Date.UTC(year, month - 1, day);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const today = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day)
  );

  return Math.max(1, Math.min(90, Math.floor((today - start) / 86400000) + 1));
}

export default function App() {
  const [page, setPage] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadReports() {
      try {
        const response = await fetch(`${API_URL}/reports`);
        if (!response.ok) {
          throw new Error(`Reports request failed (${response.status})`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("The reports API did not return a list.");
        }

        if (isActive) {
          setReports(data);
          setReportsError("");
        }
      } catch (error) {
        console.error("Mission90 reports API error:", error);
        if (isActive) {
          setReportsError("Unable to load reports from AWS. Please try again.");
        }
      } finally {
        if (isActive) {
          setReportsLoading(false);
        }
      }
    }

    // Fetch immediately, then refresh reports every 30 seconds.
    loadReports();
    const refreshInterval = window.setInterval(loadReports, 30_000);

    return () => {
      isActive = false;
      window.clearInterval(refreshInterval);
    };
  }, []);

  const day = getDay();
  const progress = Math.round((day / 90) * 100);
  const motivation = motivations[(day - 1) % motivations.length];

  function navigate(nextPage) {
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const slides = [
    { first: "SHOW UP.", second: "LEVEL UP." },
    { first: "STAY.", second: "UNSTOPPABLE." },
  ];

  return (
    <div className="mission">
      <header className="header">
        <button className="logo" onClick={() => navigate("Home")} aria-label="Mission90 home">
          M<span>90</span><i>.</i>
        </button>

        <nav className={`navigation ${menuOpen ? "navigation-open" : ""}`}>
          {["Home", "Reports", "Journey"].map((item) => (
            <button
              key={item}
              className={page === item ? "nav-link nav-link-active" : "nav-link"}
              onClick={() => navigate(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {page === "Home" && (
        <>
          <main className="hero">
            <aside className="progress-panel">
              <p className="eyebrow">THE MISSION</p>

              <div className="metric">
                <strong>{String(day).padStart(2, "0")}<small>/90</small></strong>
                <span>DAYS IN</span>
              </div>

              <div className="metric">
                <strong>{progress}<small>%</small></strong>
                <span>CALENDAR PROGRESS</span>
              </div>

              <div className="metric">
                <strong>{90 - day}</strong>
                <span>DAYS REMAINING</span>
              </div>

              <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
              </div>

              <p className="panel-note">ONE DAY AT A TIME.</p>
            </aside>

            <section className="hero-content">
              <div className="hero-heading">
                <p className="hero-kicker">
                  <span className="live-dot" />
                  90 DAYS OF PERSONAL GROWTH
                </p>

                <h1 className="name">
                  SHIVAKUMAR R<span>.</span>
                </h1>

                <p className="role">FULL STACK DEVELOPER</p>
              </div>

              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=90"
                  alt="Developer workspace with laptop and coding setup"
                />

                <div className="image-shade" />

                <div className="image-slogan">
                  <span>LEARN.</span>
                  <span>BUILD.</span>
                  <span>REPEAT.</span>
                </div>

                <div className="day-bubble">
                  <span>MISSION</span>
                  <strong>{String(day).padStart(2, "0")}</strong>
                  <span>OF 90</span>
                </div>

                <div className="image-index">PERSONAL LOG / 2026</div>
              </div>
            </section>

            <span className="edge-caption">DISCIPLINE OVER MOTIVATION</span>
          </main>

          <div className="hero-controls">
            <div className="slide-buttons">
              <button
                aria-label="Previous headline"
                onClick={() => setSlide((slide + slides.length - 1) % slides.length)}
              >
                ←
              </button>
              <button
                aria-label="Next headline"
                onClick={() => setSlide((slide + 1) % slides.length)}
              >
                →
              </button>
            </div>

            <div className="slide-caption">
              <span>0{slide + 1}</span> / 02
              <strong>{slides[slide].first} {slides[slide].second}</strong>
            </div>

            <button className="view-button" onClick={() => navigate("Journey")}>
              EXPLORE THE JOURNEY <span>↗</span>
            </button>
          </div>

          <section className="motivation-section">
            <div className="motivation-index">
              <span>DAILY MINDSET</span>
              <strong>{String(day).padStart(2, "0")}</strong>
              <span>DAY / 90</span>
            </div>

            <div className="motivation-copy">
              <p className="eyebrow">TODAY'S REMINDER</p>
              <h2>{motivation}</h2>
              <p>
                Your future is built in ordinary moments. Keep your promises
                to yourself, even when nobody is watching.
              </p>
            </div>

            <div className="motivation-symbol" aria-hidden="true">✳</div>
          </section>

          <section className="mission-strip">
            <span>LEARN SOMETHING</span><i>✳</i>
            <span>BUILD SOMETHING</span><i>✳</i>
            <span>SHOW UP</span><i>✳</i>
          </section>

          <section className="about-section">
            <p className="eyebrow">001 — THE COMMITMENT</p>
            <h2>Less talking.<br />More <span>becoming.</span></h2>
            <p className="about-copy">
              Ninety days to become more disciplined, improve your skills,
              and move closer to your goals. Record the effort. Learn from
              the setbacks. Keep moving forward.
            </p>

            <div className="about-stats">
              <div><strong>90</strong><span>DAYS TO GROW</span></div>
              <div><strong>01</strong><span>DAY AT A TIME</span></div>
              <div><strong>∞</strong><span>ROOM TO IMPROVE</span></div>
            </div>
          </section>
        </>
      )}

      {page === "Reports" && (
        <main className="inner-page">
          <p className="eyebrow">YOUR EFFORT, DOCUMENTED</p>
          <h1 className="inner-title">DAILY<br /><span>REPORTS.</span></h1>
          <p className="inner-description">
            Every small win deserves a record.
          </p>

          {reportsLoading && (
            <p className="demo-note">LOADING YOUR REPORTS FROM AWS...</p>
          )}

          {!reportsLoading && reportsError && (
            <div>
              <p className="demo-note">{reportsError}</p>
              <button
                className="view-button"
                onClick={() => {
                  setReportsLoading(true);
                  setReportsError("");
                  fetch(`${API_URL}/reports`)
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(`Reports request failed (${response.status})`);
                      }
                      return response.json();
                    })
                    .then((data) => {
                      if (!Array.isArray(data)) {
                        throw new Error("The reports API did not return a list.");
                      }
                      setReports(data);
                    })
                    .catch((error) => {
                      console.error("Mission90 reports API error:", error);
                      setReportsError("Unable to load reports from AWS. Please try again.");
                    })
                    .finally(() => setReportsLoading(false));
                }}
              >
                RETRY <span>↻</span>
              </button>
            </div>
          )}

          {!reportsLoading && !reportsError && reports.length === 0 && (
            <p className="demo-note">
              NO REPORTS YET — SEND YOUR DAILY CHECK-IN TO YOUR TELEGRAM BOT.
            </p>
          )}

          {!reportsLoading && !reportsError && reports.map((report, index) => {
            const dateValue = report.date || report.createdAt || "Undated";
            const parsedDate = new Date(dateValue);
            const formattedDate = Number.isNaN(parsedDate.getTime())
              ? dateValue
              : parsedDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                }).toUpperCase();

            const dayNumber = report.date
              ? Math.max(
                  1,
                  Math.floor(
                    (new Date(`${report.date}T00:00:00+05:30`) -
                      new Date(`${START_DATE}T00:00:00+05:30`)) / 86400000
                  ) + 1
                )
              : index + 1;

            return (
              <article className="report-row" key={`${report.date || "report"}-${index}`}>
                <span className="report-date">{formattedDate}</span>
                <div>
                  <h3>Day {String(dayNumber).padStart(2, "0")} — Daily check-in</h3>
                  <p>{report.report || "No report text available."}</p>
                </div>
                <span className="report-arrow">↗</span>
              </article>
            );
          })}
        </main>
      )}

      {page === "Journey" && (
        <main className="inner-page">
          <p className="eyebrow">90 DAYS. ONE DIRECTION.</p>
          <h1 className="inner-title">YOUR<br /><span>JOURNEY.</span></h1>
          <p className="inner-description">
            Progress is not about perfect days. It's about continuing to show up.
          </p>

          <div className="journey-summary">
            <strong>{String(day).padStart(2, "0")}<small> / 90 DAYS</small></strong>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="journey-grid">
            {Array.from({ length: 90 }, (_, index) => (
              <div
                key={index}
                className={`journey-day ${index < day ? "completed" : ""}`}
                title={`Day ${index + 1}`}
              >
                {index < day ? "✓" : String(index + 1).padStart(2, "0")}
              </div>
            ))}
          </div>
        </main>
      )}

      <footer className="footer">
        <button className="logo" onClick={() => navigate("Home")}>M<span>90</span><i>.</i></button>
        <p>SHIVAKUMAR R. · FULL STACK DEVELOPER</p>
        <p>MAKE TODAY COUNT. © 2026</p>
      </footer>
    </div>
  );
}
