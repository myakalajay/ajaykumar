import type { ReactNode } from "react";
import type { MockVariant, WfVariant } from "./data";

/* -------------------------------- chrome ----------------------------------- */

export function BrowserFrame({ image, alt, accent, eager = false }: { image: string; alt: string; accent: string; eager?: boolean }) {
  return (
    <div className="browser-frame">
      <div className="frame-bar">
        <span className="dot" style={{ background: accent }}/><span className="dot"/><span className="dot"/>
        <span className="frame-url">{alt}</span>
      </div>
      <div className="frame-body"><img src={image} alt={`${alt} product visual`} loading={eager ? "eager" : "lazy"} decoding={eager ? "sync" : "async"}/></div>
    </div>
  );
}

/* ------------------------------- wireframes -------------------------------- */

function WfTag({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <span className="wf-tag" style={style}>{children}</span>;
}

export function Wireframe({ variant, caption }: { variant: WfVariant; caption: string }) {
  const mobile = variant.startsWith("mobile");
  return (
    <figure className={`wf-figure ${mobile ? "wf-mobile-fig" : ""}`}>
      <div className={`wf ${mobile ? "wf-mobile" : ""}`} aria-hidden="true">
        {variant === "web-hero" && (
          <>
            <div className="wf-nav">
              <span className="wf-logo"/><span className="wf-links"><i/><i/><i/><i/></span><span className="wf-cta">Sign up</span>
              <WfTag style={{ right: 8, top: -7 }}>NAV</WfTag>
            </div>
            <div className="wf-hero">
              <div className="wf-hero-copy">
                <WfTag style={{ left: -8, top: -7 }}>HEADLINE</WfTag>
                <span className="wf-line w90"/><span className="wf-line w70"/>
                <div className="wf-pills"><span>Primary CTA</span><span>Secondary</span></div>
                <WfTag style={{ left: 16, bottom: -7 }}>CTA PAIR</WfTag>
              </div>
              <div className="wf-img-ph"><span>IMAGE</span></div>
            </div>
            <div className="wf-cards"><span/><span/><span/><WfTag style={{ left: 8, top: -7 }}>VALUE CARDS ×3</WfTag></div>
            <span className="wf-line w40"/>
          </>
        )}
        {variant === "web-dash" && (
          <>
            <div className="wf-app">
              <div className="wf-side">
                <span className="wf-logo"/><i className="on"/><i/><i/><i/>
                <WfTag style={{ left: 8, bottom: -7 }}>NAV RAIL</WfTag>
              </div>
              <div className="wf-main">
                <div className="wf-stats"><span/><span/><span/><WfTag style={{ left: 8, top: -7 }}>KPI CARDS</WfTag></div>
                <div className="wf-chart">
                  <i style={{ height: "34%" }}/><i style={{ height: "58%" }}/><i style={{ height: "44%" }}/><i style={{ height: "72%" }}/><i style={{ height: "52%" }}/><i style={{ height: "86%" }}/>
                  <WfTag style={{ right: 8, top: -7 }}>TREND</WfTag>
                </div>
                <div className="wf-rows"><span className="w90"/><span className="w75"/><span className="w80"/></div>
              </div>
            </div>
          </>
        )}
        {variant === "web-table" && (
          <>
            <div className="wf-toolbar">
              <span className="wf-search">Search…</span><span className="wf-cta">+ Add supplier</span>
              <WfTag style={{ right: 8, top: -7 }}>TOOLBAR</WfTag>
            </div>
            <div className="wf-thead"><i className="w12"/><i className="w30"/><i className="w20"/><i className="w16"/><i className="w12"/></div>
            {[82, 70, 88, 64, 76].map((w, i) => (
              <div className="wf-trow" key={i}><i className="w12"/><i style={{ width: `${w * 0.4}%` }}/><i style={{ width: `${w * 0.24}%` }}/><i style={{ width: `${w * 0.18}%` }}/><i style={{ width: `${w * 0.14}%` }}/></div>
            ))}
            <WfTag style={{ left: 8, bottom: -7 }}>DATA TABLE — SORT + STATUS</WfTag>
          </>
        )}
        {variant === "mobile-feed" && (
          <>
            <div className="wf-status"/>
            <div className="wf-m-head"><span className="wf-logo"/> <span className="wf-line w30"/></div>
            {[0, 1].map(i => (
              <div className="wf-m-card" key={i}>
                <div className="wf-img-ph sm"><span>MEDIA</span></div>
                <span className="wf-line w80"/><span className="wf-line w55"/>
              </div>
            ))}
            <div className="wf-tabs"><i className="on"/><i/><i/><i/><WfTag style={{ right: 8, top: -7 }}>TAB BAR</WfTag></div>
          </>
        )}
        {variant === "mobile-checkout" && (
          <>
            <div className="wf-status"/>
            <div className="wf-steps"><i className="on"/><i className="on"/><i/><WfTag style={{ right: 8, top: -7 }}>STEPPER</WfTag></div>
            <span className="wf-line w60"/><span className="wf-line w40"/>
            <div className="wf-m-card"><span className="wf-line w85"/><span className="wf-line w50"/><WfTag style={{ left: 8, bottom: -7 }}>ORDER SUMMARY</WfTag></div>
            <div className="wf-fields"><span/><span/><WfTag style={{ left: 8, bottom: -7 }}>PAYMENT FIELDS</WfTag></div>
            <span className="wf-pay">Pay securely</span>
          </>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/* --------------------------- hi-fi product mocks ---------------------------- */

function MsNav({ name, accent }: { name: string; accent: string }) {
  return (
    <div className="ms-top">
      <span className="ms-logo" style={{ background: accent }}/>
      <b>{name}</b>
      <span className="ms-links"><i/><i/><i/></span>
      <span className="ms-av">A</span>
    </div>
  );
}

function MsBars({ vals, accent }: { vals: number[]; accent: string }) {
  return <div className="ms-bars">{vals.map((h, i) => <i key={i} style={{ height: `${h}%`, background: accent, opacity: 0.35 + (i % 3) * 0.2 }}/>)}</div>;
}

export function MockScreen({ v, accent }: { v: MockVariant; accent: string }) {
  const status = <div className="ms-status"><span>9:41</span><span className="ms-sig"><i/><i/><i/></span></div>;
  const tabs = <div className="ms-tabs"><i className="on"/><i/><i/><i/></div>;
  switch (v) {
    case "rates": return (
      <div className="ms">
        <MsNav name="HomeRatesYard" accent={accent}/>
        <div className="ms-body">
          <div className="ms-hero">
            <div>
              <b className="ms-h1">Compare today's mortgage rates</b>
              <span className="ms-line" style={{ width: "72%" }}/>
              <span className="ms-line" style={{ width: "48%" }}/>
              <div className="ms-pillrow"><span className="ms-chip on">30-yr fixed</span><span className="ms-chip">15-yr</span><span className="ms-chip">ARM</span></div>
            </div>
            <div className="ms-cards3">
              <div className="ms-rate hot"><small>30-Yr Fixed</small><b>6.42%</b><em>5.98% APR</em><span className="ms-btn">Get started</span></div>
              <div className="ms-rate"><small>15-Yr Fixed</small><b>5.71%</b><em>5.32% APR</em><span className="ms-btn ghost">Compare</span></div>
              <div className="ms-rate"><small>5/1 ARM</small><b>5.98%</b><em>6.11% APR</em><span className="ms-btn ghost">Compare</span></div>
            </div>
          </div>
          <div className="ms-strip"><span>✓ No hidden fees</span><span>✓ Lock your rate in 60s</span><span>✓ Licensed lender network</span></div>
        </div>
      </div>
    );
    case "dash": return (
      <div className="ms">
        <div className="ms-app">
          <div className="ms-side"><span className="ms-logo" style={{ background: accent }}/><i className="on"/><i/><i/><i/></div>
          <div className="ms-main">
            <div className="ms-topline"><b>Good morning, Jordan</b><span className="ms-av">J</span></div>
            <div className="ms-kpis">
              <div><small>Loan progress</small><b>68%</b><div className="ms-prog"><i style={{ width: "68%", background: accent }}/></div></div>
              <div><small>Next payment</small><b>$1,842</b><em>Due in 12 days</em></div>
              <div><small>Locked rate</small><b>6.42%</b><em>30-yr fixed</em></div>
            </div>
            <div className="ms-steps"><span className="done">Application</span><span className="now">Underwriting</span><span>Closing</span></div>
            <div className="ms-docs">
              <div className="ms-doc"><b>Income verification</b><span className="ms-tag ok">Verified</span></div>
              <div className="ms-doc"><b>Appraisal</b><span className="ms-tag warn">In review</span></div>
              <div className="ms-doc"><b>Title search</b><span className="ms-tag">Pending</span></div>
            </div>
          </div>
        </div>
      </div>
    );
    case "supplier": return (
      <div className="ms">
        <MsNav name="Supplier Network" accent={accent}/>
        <div className="ms-body">
          <div className="ms-kpis">
            <div><small>Annual spend</small><b>$42.5K</b></div>
            <div><small>Active suppliers</small><b>120</b></div>
            <div><small>On-time delivery</small><b>94%</b></div>
          </div>
          <div className="ms-panel"><MsBars vals={[38, 55, 42, 68, 50, 74, 60, 82]} accent={accent}/></div>
          <div className="ms-docs">
            <div className="ms-doc"><b>Northwind Parts</b><span className="ms-tag ok">Active</span></div>
            <div className="ms-doc"><b>Acme Services</b><span className="ms-tag ok">Active</span></div>
            <div className="ms-doc"><b>Globex Logistics</b><span className="ms-tag warn">Review</span></div>
          </div>
        </div>
      </div>
    );
    case "spend": return (
      <div className="ms">
        <MsNav name="Spend Visibility" accent={accent}/>
        <div className="ms-body ms-split">
          <div className="ms-donut-card">
            <svg viewBox="0 0 42 42" className="ms-donut">
              <circle r="15.9" cx="21" cy="21" fill="none" stroke="#eef0f4" strokeWidth="6"/>
              <circle r="15.9" cx="21" cy="21" fill="none" stroke={accent} strokeWidth="6" strokeDasharray="55 45" strokeDashoffset="25"/>
              <circle r="15.9" cx="21" cy="21" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="70"/>
            </svg>
            <div className="ms-legend"><span><i style={{ background: accent }}/>Direct · 55%</span><span><i style={{ background: "#cbd5e1" }}/>Indirect · 25%</span><span><i style={{ background: "#e5e7eb" }}/>Other · 20%</span></div>
          </div>
          <div className="ms-cat">
            <b>Top categories</b>
            <div className="ms-catrow"><span>IT services</span><div className="ms-prog"><i style={{ width: "78%", background: accent }}/></div></div>
            <div className="ms-catrow"><span>Logistics</span><div className="ms-prog"><i style={{ width: "62%", background: accent }}/></div></div>
            <div className="ms-catrow"><span>Facilities</span><div className="ms-prog"><i style={{ width: "41%", background: accent }}/></div></div>
          </div>
        </div>
      </div>
    );
    case "segments": return (
      <div className="ms">
        <MsNav name="AudiencePlay" accent={accent}/>
        <div className="ms-body ms-split">
          <div className="ms-cat">
            <b>Filters</b>
            <div className="ms-pillrow col"><span className="ms-chip on">Age 18–34</span><span className="ms-chip on">Telugu</span><span className="ms-chip">Sports</span><span className="ms-chip">Business</span></div>
            <span className="ms-btn wide">Apply filters</span>
          </div>
          <div className="ms-cat">
            <b>Segments</b>
            <div className="ms-catrow"><span>Weekend readers<em>8.2M</em></span><div className="ms-prog"><i style={{ width: "88%", background: accent }}/></div></div>
            <div className="ms-catrow"><span>Sports followers<em>5.1M</em></span><div className="ms-prog"><i style={{ width: "62%", background: accent }}/></div></div>
            <div className="ms-catrow"><span>Regional news<em>3.7M</em></span><div className="ms-prog"><i style={{ width: "48%", background: accent }}/></div></div>
          </div>
        </div>
      </div>
    );
    case "feed": return (
      <div className="ms ms--phone">
        {status}
        <div className="ms-mhead"><span className="ms-logo" style={{ background: accent }}/><b>Today</b><span className="ms-chip on">हिंदी</span></div>
        <div className="ms-news"><span className="ms-img"/><b>Markets steady as spending holds</b><em>Business · 2 min read</em></div>
        <div className="ms-news"><span className="ms-img" style={{ filter: "hue-rotate(18deg)" }}/><b>City wins green transit grant</b><em>City · 3 min read</em></div>
        {tabs}
      </div>
    );
    case "shop": return (
      <div className="ms ms--phone">
        {status}
        <div className="ms-mhead"><b>Shop</b><span className="ms-search"/></div>
        <div className="ms-grid">
          <div className="ms-prod"><span className="ms-img"/><b>Runner Pro</b><em>$129</em><small>★ 4.8</small></div>
          <div className="ms-prod"><span className="ms-img" style={{ filter: "hue-rotate(30deg)" }}/><b>Desk Lamp</b><em>$46</em><small>★ 4.6</small></div>
          <div className="ms-prod"><span className="ms-img" style={{ filter: "hue-rotate(-25deg)" }}/><b>Backpack</b><em>$88</em><small>★ 4.7</small></div>
          <div className="ms-prod"><span className="ms-img" style={{ filter: "hue-rotate(60deg)" }}/><b>Earbuds</b><em>$59</em><small>★ 4.9</small></div>
        </div>
        {tabs}
      </div>
    );
    case "checkout": return (
      <div className="ms ms--phone">
        {status}
        <div className="ms-steps2"><span className="done">Cart</span><span className="now">Payment</span><span>Done</span></div>
        <div className="ms-order">
          <div className="ms-doc"><b>Runner Pro × 1</b><em>$129.00</em></div>
          <div className="ms-doc"><b>Desk Lamp × 1</b><em>$46.00</em></div>
          <div className="ms-doc total"><b>Total</b><em>$175.00</em></div>
        </div>
        <div className="ms-field">Card number ···· 4242</div>
        <div className="ms-fieldrow"><div className="ms-field">12 / 28</div><div className="ms-field">CVC</div></div>
        <div className="ms-paybtn" style={{ background: accent }}>Pay $175.00</div>
      </div>
    );
  }
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return <div className="pf"><span className="pf-notch"/><div className="pf-screen">{children}</div></div>;
}

export function DesktopMock({ v, cap, accent }: { v: MockVariant; cap: string; accent: string }) {
  return (
    <div className="browser-frame">
      <div className="frame-bar">
        <span className="dot" style={{ background: accent }}/><span className="dot"/><span className="dot"/>
        <span className="frame-url">{cap}</span>
      </div>
      <div className="frame-body ms-host"><MockScreen v={v} accent={accent}/></div>
    </div>
  );
}
