import '@fontsource/geist-mono/latin-600.css'
import '@fontsource/geist-mono/latin-400.css'
import '@fontsource/geist-sans/latin-400.css'
import '@fontsource/geist-sans/latin-500.css'
import '@fontsource/geist-sans/latin-700.css'
import '@fontsource/anton/latin-400.css'
import './style.css'

const antonFontReady = document.fonts?.load('400 5.25rem Anton')

if (antonFontReady) {
  antonFontReady
    .then(() => document.documentElement.classList.add('anton-ready'))
    .catch(() => document.documentElement.classList.add('anton-ready'))
} else {
  document.documentElement.classList.add('anton-ready')
}

document.querySelector('#app').innerHTML = `
  <main>
  <section class="hero" id="top" data-node-id="2197:785">
    <video
      class="hero__video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/assets/render%203.mp4" type="video/mp4">
    </video>

    <header class="hero__header" data-node-id="2197:787">
      <a class="hero__brand" href="#top" aria-label="ByteCorp Studio home">
        <img src="/assets/brand-mark.svg" alt="" width="21" height="29">
      </a>

      <button
        class="hero__menu-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        aria-controls="site-menu"
      >
        <span class="hero__menu-line"></span>
        <span class="hero__menu-line"></span>
        <span class="hero__menu-line"></span>
      </button>

      <div
        class="site-menu"
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden="true"
        inert
      >
        <nav class="site-menu__nav" aria-label="Main navigation">
          <a class="site-menu__link" href="#work" style="--menu-index: 0">work</a>
          <a class="site-menu__link" href="#services" style="--menu-index: 1">services</a>
          <a class="site-menu__link" href="#team" style="--menu-index: 2">team</a>
          <a class="site-menu__link" href="#contact" style="--menu-index: 3">contact</a>
        </nav>
      </div>
    </header>

    <div class="hero__content" data-node-id="2201:801">
      <h1 data-node-id="2235:484">We find where tech brands lose revenue</h1>

      <a class="hero__cta" href="#contact" data-node-id="2201:803">
        <span>Get your brand audited</span>
        <img src="/assets/arrow-right.svg" alt="" width="24" height="24">
      </a>
    </div>

    <p class="hero__affiliation" data-node-id="2235:476">
      Part of ByteCorp.io. Focused on experience.
    </p>
  </section>

  <section class="intro-reveal" data-node-id="2239:5321" aria-labelledby="intro-reveal-copy">
    <div class="intro-reveal__sticky">
      <p
        class="intro-reveal__copy"
        id="intro-reveal-copy"
        data-node-id="2239:5322"
        aria-label="We help tech brands find what's holding growth back and fix it through brand strategy, identity systems, high-converting websites, and scalable product design. 20+ brands in, the impact has been beyond impressive."
      >
        <span class="intro-reveal__word" aria-hidden="true">We</span>
        <span class="intro-reveal__word" aria-hidden="true">help</span>
        <span class="intro-reveal__word" aria-hidden="true">tech</span>
        <span class="intro-reveal__word" aria-hidden="true">brands</span>
        <span class="intro-reveal__shape intro-reveal__shape--arch" aria-hidden="true" data-node-id="2239:5352">
          <img src="/assets/intro-reveal-arch.svg" alt="" width="109.174" height="54">
        </span>
        <span class="intro-reveal__word" aria-hidden="true">find</span>
        <span class="intro-reveal__word" aria-hidden="true">what's</span>
        <span class="intro-reveal__word" aria-hidden="true">holding</span>
        <br aria-hidden="true">
        <span class="intro-reveal__word" aria-hidden="true">growth</span>
        <span class="intro-reveal__shape" aria-hidden="true" data-node-id="2239:5357">
          <img src="/assets/intro-reveal-arrows.svg" alt="" width="54.0001" height="54.0001">
        </span>
        <span class="intro-reveal__word" aria-hidden="true">back</span>
        <span class="intro-reveal__word" aria-hidden="true">and</span>
        <span class="intro-reveal__word" aria-hidden="true">fix</span>
        <span class="intro-reveal__word" aria-hidden="true">it</span>
        <span class="intro-reveal__word" aria-hidden="true">through</span>
        <span class="intro-reveal__word" aria-hidden="true">brand</span>
        <span class="intro-reveal__word" aria-hidden="true">strategy,</span>
        <span class="intro-reveal__word" aria-hidden="true">identity</span>
        <span class="intro-reveal__word" aria-hidden="true">systems,</span>
        <span class="intro-reveal__word" aria-hidden="true">high-converting</span>
        <span class="intro-reveal__word" aria-hidden="true">websites,</span>
        <span class="intro-reveal__word" aria-hidden="true">and</span>
        <span class="intro-reveal__word" aria-hidden="true">scalable</span>
        <span class="intro-reveal__word" aria-hidden="true">product</span>
        <span class="intro-reveal__word" aria-hidden="true">design.</span>
        <span class="intro-reveal__word" aria-hidden="true">20+</span>
        <span class="intro-reveal__word" aria-hidden="true">brands</span>
        <span class="intro-reveal__word" aria-hidden="true">in</span>
        <span class="intro-reveal__shape" aria-hidden="true" data-node-id="2239:5327">
          <img src="/assets/intro-reveal-dots.svg" alt="" width="128.864" height="54">
        </span>
        <span class="intro-reveal__word" aria-hidden="true">,</span>
        <span class="intro-reveal__word" aria-hidden="true">the</span>
        <span class="intro-reveal__word" aria-hidden="true">impact</span>
        <span class="intro-reveal__word" aria-hidden="true">has</span>
        <span class="intro-reveal__word" aria-hidden="true">been</span>
        <span class="intro-reveal__word" aria-hidden="true">beyond</span>
        <span class="intro-reveal__word" aria-hidden="true">impressive.</span>
      </p>
    </div>
  </section>

  <section class="selected-work" id="work" data-node-id="2203:824" aria-label="Selected work">
    <div class="selected-work__list">
      <article class="work-card work-card--featured" data-node-id="2203:827">
        <div class="work-card__media work-card__media--wide" data-node-id="2203:828">
          <img src="/assets/work/shukar-hai.png" alt="Shukar Hai website showcasing the causes the organization supports" width="5376" height="3648">
        </div>
        <div class="work-card__details work-card__details--with-quote">
          <div>
            <h3>Shukar Hai</h3>
            <p>Social Enterprise</p>
          </div>
          <blockquote class="text-measure">“It never felt like we were simply getting a website developed, it felt like we had a partner equally invested in building something meaningful. ByteCorp took the time to deeply understand our mission, and every strategy call reflected clarity and genuine involvement.”</blockquote>
        </div>
      </article>

      <div class="work-grid">
        <article class="work-card" data-node-id="2203:850">
          <div class="work-card__media work-card__media--square" data-node-id="2203:851">
            <img src="/assets/work/nxtstim.png" alt="NXTSTIM healthcare mobile application shown on two phones" width="2624" height="2248" loading="lazy" decoding="async">
          </div>
          <div class="work-card__details">
            <div>
              <h3>NXTSTIM</h3>
              <p>Healthcare</p>
            </div>
          </div>
        </article>

        <article class="work-card" data-node-id="2203:869">
          <div class="work-card__media work-card__media--square" data-node-id="2203:870">
            <img src="/assets/work/talent-forge.png" alt="Talent Forge learning dashboard interface" width="2624" height="2248" loading="lazy" decoding="async">
          </div>
          <div class="work-card__details">
            <div>
              <h3>Talent Forge</h3>
              <p>Ed-Tech</p>
            </div>
          </div>
        </article>
      </div>

      <article class="work-card work-card--featured" data-node-id="2203:838">
        <div class="work-card__media work-card__media--wide" data-node-id="2203:839">
          <img src="/assets/work/autilent.png" alt="Autilent driver safety platform displayed inside a vehicle" width="5376" height="3648" loading="lazy" decoding="async">
        </div>
        <div class="work-card__details work-card__details--with-quote">
          <div>
            <h3>Autilent</h3>
            <p>Automotive</p>
          </div>
          <blockquote class="text-measure">“It never felt like we were simply getting a website developed, it felt like we had a partner equally invested in building something meaningful. ByteCorp took the time to deeply understand our mission, and every strategy call reflected clarity and genuine involvement.”</blockquote>
        </div>
      </article>

      <div class="work-grid">
        <article class="work-card" data-node-id="2203:913">
          <div class="work-card__media work-card__media--square" data-node-id="2203:914">
            <img src="/assets/work/mazik-care.png" alt="Mazik Care appointment scheduling interface on a laptop" width="2624" height="2248" loading="lazy" decoding="async">
          </div>
          <div class="work-card__details">
            <div>
              <h3>Mazik Care</h3>
              <p>Healthcare</p>
            </div>
          </div>
        </article>

        <article class="work-card" data-node-id="2203:927">
          <div class="work-card__media work-card__media--square" data-node-id="2203:928">
            <img src="/assets/work/frctn.png" alt="FRCTN brand campaign displayed on a building exterior" width="2624" height="2248" loading="lazy" decoding="async">
          </div>
          <div class="work-card__details">
            <div>
              <h3>FRCTN</h3>
              <p>AI-Tech</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="art-motion" id="services" data-node-id="2206:9080" aria-labelledby="art-motion-title">
    <div class="art-motion__sticky-panel" data-node-id="2240:5409">
      <h2 class="art-motion__lockup" id="art-motion-title" data-node-id="2240:5410">
        <span class="art-motion__lockup-line" data-node-id="2240:5411">
          <span data-node-id="2240:5412">Our art</span>
          <img src="/assets/motion/art-motion-loops.svg" alt="" width="113" height="44" data-node-id="2240:5413">
        </span>
        <span class="art-motion__lockup-line art-motion__lockup-line--second" data-node-id="2240:5414">
          <img src="/assets/motion/art-motion-zigzag.svg" alt="" width="96.564" height="38.318" data-node-id="2240:5415">
          <span data-node-id="2240:5420">In motion</span>
        </span>
      </h2>
    </div>

    <div class="art-motion__story">
      <div class="art-motion__showcase" data-node-id="2206:8736">
        <div class="art-motion__canvas">
          <img class="art-motion__room" src="/assets/motion/room-showcase.png" alt="A minimal white gallery displaying a sequence of digital brand work" width="1440" height="887" loading="lazy" decoding="async">
          <div class="art-motion__top-fade" aria-hidden="true" data-node-id="2062:29440"></div>

          <div class="art-motion__zoom-layer">
            <div class="motion-card" data-node-id="2206:8739">
              <div class="motion-card__scene" data-node-id="2206:8740">
                <div class="motion-card__project is-active" data-project="0" aria-hidden="true">
                  <img class="motion-card__layer motion-card__static motion-card__static--one" src="/assets/motion/layer-static-1.png" alt="" width="469" height="264" data-node-id="2206:8741">
                  <img class="motion-card__layer motion-card__static motion-card__static--two" src="/assets/motion/layer-static-2.png" alt="" width="428" height="241" data-node-id="2206:8742">
                  <img class="motion-card__layer motion-card__static motion-card__static--three" src="/assets/motion/layer-static-3.png" alt="" width="385" height="241" data-node-id="2206:8743">
                  <img class="motion-card__layer motion-card__static motion-card__static--four" src="/assets/motion/layer-static-4.png" alt="" width="469" height="264" data-node-id="2206:8744">
                  <img class="motion-card__layer motion-card__cycle motion-card__cycle--one" src="/assets/motion/layer-cycle-1.png" alt="" width="469" height="264" data-node-id="2206:8745">
                  <img class="motion-card__layer motion-card__cycle motion-card__cycle--two" src="/assets/motion/layer-cycle-2.png" alt="" width="469" height="264" data-node-id="2206:8746">
                  <img class="motion-card__layer motion-card__cycle motion-card__cycle--three" src="/assets/motion/layer-cycle-3.png" alt="" width="469" height="264" data-node-id="2206:8747">
                  <img class="motion-card__logo" src="/assets/motion/frctn-logo.svg" alt="" width="186" height="62" data-node-id="2206:8748">
                </div>
                <video class="motion-card__project" data-project="1" src="/assets/motion/shukar-hai-screen.mp4" width="603" height="340" autoplay muted loop playsinline preload="auto" aria-hidden="true" data-node-id="2206:8940"></video>
                <video class="motion-card__project" data-project="2" src="/assets/motion/autilent-screen.mp4" width="736" height="414" autoplay muted loop playsinline preload="auto" aria-hidden="true" data-node-id="2206:8975"></video>
              </div>
            </div>
          </div>

          <div class="art-motion__copy" aria-live="polite">
            <article class="art-motion__project-copy is-active" data-project="0">
              <h3>FRCTN</h3>
              <p class="text-measure">We shaped FRCTN’s brand identity, visual language, and motion system to turn complex AI thinking into a bold, clear, and cohesive digital experience.</p>
            </article>
            <article class="art-motion__project-copy" data-project="1">
              <h3>Shukar Hai</h3>
              <p class="text-measure">Shukar Hai turns gratitude into meaningful acts of sharing. We redesigned the platform around clearer product journeys, stronger trust, and a warmer digital experience across Aqeeqah and Dawat in a Box.</p>
            </article>
            <article class="art-motion__project-copy" data-project="2">
              <h3>Autilent</h3>
              <p class="text-measure">We shaped Autilent’s brand and digital experience around clarity, trust, and intelligent automation — turning a complex technology proposition into a focused and approachable visual system.</p>
            </article>
          </div>
        </div>

        <div class="art-motion__pagination" aria-label="Choose featured project">
          <button class="is-active" type="button" data-project="0" aria-label="Show FRCTN project" aria-current="true"></button>
          <button type="button" data-project="1" aria-label="Show Shukar Hai project"></button>
          <button type="button" data-project="2" aria-label="Show Autilent project"></button>
        </div>
      </div>
    </div>
    <div class="art-motion__exit" aria-hidden="true"></div>
  </section>

  <section class="coherence" id="coherence" data-node-id="2241:5422" aria-labelledby="coherence-title">
    <div class="coherence__sticky">
      <div class="coherence__content" data-node-id="2242:10241">
        <h2 class="coherence__headline" id="coherence-title" data-node-id="2242:10239">
          <span class="coherence__line">
            <span class="coherence__reveal">Tech</span>
            <span class="coherence__reveal">brands</span>
            <span class="coherence__asset coherence__reveal" aria-hidden="true" data-node-id="2241:10227"><img src="/assets/coherence-rings.svg" alt="" width="114.697" height="44"></span>
            <span class="coherence__reveal">don’t</span>
            <span class="coherence__reveal">have</span>
            <span class="coherence__reveal">a</span>
            <span class="coherence__reveal">design</span>
            <span class="coherence__reveal">problem.</span>
          </span>
          <span class="coherence__line">
            <span class="coherence__reveal">They</span>
            <span class="coherence__reveal">have</span>
            <span class="coherence__reveal">a</span>
            <span class="coherence__asset coherence__reveal" aria-hidden="true" data-node-id="2242:10238"><img src="/assets/coherence-diamond.svg" alt="" width="56.891" height="45"></span>
            <span class="coherence__reveal">coherence</span>
            <span class="coherence__reveal">problem.</span>
          </span>
        </h2>

        <p class="coherence__copy text-measure" data-node-id="2241:10229">
          <span class="coherence__copy-line">One team designs your product. Another writes your pitch. A third runs your ads.</span>
          <span class="coherence__copy-line">When they don't agree, customers notice before you do and doubt becomes 'no.'</span>
          <span class="coherence__copy-line">That's a coherence problem. It's exactly what an audit is built to find.</span>
        </p>

        <a class="coherence__cta" href="#contact" data-node-id="2241:10230">
          <span>GET YOUR BRAND AUDITED</span>
          <img src="/assets/coherence-arrow-right.svg" alt="" width="24" height="24">
        </a>
      </div>
    </div>
  </section>

  <section class="disciplines" id="disciplines" data-node-id="2113:582" aria-labelledby="disciplines-title">
    <header class="disciplines__intro" data-node-id="2243:10259">
      <h2 id="disciplines-title" data-node-id="2245:10264">
        <span data-node-id="2243:10260">Everything a tech brand needs. Nothing it doesn't</span>
        <img src="/assets/disciplines/intro-mark.svg" alt="" width="54" height="54" data-node-id="2245:10262">
      </h2>
    </header>

    <article class="discipline-card discipline-card--experience" id="experience-design" style="--card-index: 1" data-node-id="2113:585">
      <div class="discipline-card__meta" data-node-id="2113:5788">
        <div class="discipline-card__number">01</div>
        <p class="text-measure">Design without research is guessing. We figure out what's worth building in your product before anyone opens a design file. Then we make it real, while measuring everything.</p>
        <ul class="discipline-card__tags" aria-label="Experience design services">
          <li>UX Research</li><li>Service Design</li><li>Product</li><li>UX/UI</li><li>Design Systems</li><li>Usability</li>
        </ul>
      </div>
      <img class="discipline-card__art" src="/assets/disciplines/experience-design.png" alt="" width="460" height="395" loading="lazy" decoding="async" data-node-id="2113:587">
      <h3 class="discipline-card__title" data-node-id="2113:586"><span>Experience</span><span>Design</span></h3>
      <a class="discipline-card__cta" href="#contact" data-node-id="2113:5808">
        <span>Start your project</span><img src="/assets/disciplines/arrow-right.svg" alt="" width="24" height="24">
      </a>
    </article>

    <article class="discipline-card discipline-card--brand" id="brand-creative" style="--card-index: 2" data-node-id="2113:5811">
      <div class="discipline-card__meta" data-node-id="2113:5813">
        <div class="discipline-card__number">02</div>
        <p class="text-measure">Brand that sticks. Identity that travels. Voice that holds up whether it's a pitch deck, a product screen, or a press release.</p>
        <ul class="discipline-card__tags" aria-label="Brand and creative services">
          <li>Strategy</li><li>Visual Identity</li><li>Naming</li><li>Art Direction</li><li>Bilingual Copy</li><li>Editorial</li>
        </ul>
      </div>
      <img class="discipline-card__art" src="/assets/disciplines/brand-creative.png" alt="" width="352" height="466" loading="lazy" decoding="async" data-node-id="2113:5833">
      <h3 class="discipline-card__title" data-node-id="2113:5812"><span>Brand &amp;</span><span>Creative</span></h3>
      <a class="discipline-card__cta" href="#contact" data-node-id="2113:8834">
        <span>Start your project</span><img src="/assets/disciplines/arrow-right.svg" alt="" width="24" height="24">
      </a>
    </article>

    <article class="discipline-card discipline-card--content" id="content-production" style="--card-index: 3" data-node-id="2113:8837">
      <div class="discipline-card__meta" data-node-id="2113:8839">
        <div class="discipline-card__number">03</div>
        <p class="text-measure">An in-house studio, not a brief sent to vendors. Product demos, launch videos, social, and motion produced on the same floor as strategy and design.</p>
        <ul class="discipline-card__tags" aria-label="Content and production services">
          <li>Brand Film</li><li>Social</li><li>Photography</li><li>Motion</li><li>Post</li><li>Always-on Systems</li>
        </ul>
      </div>
      <img class="discipline-card__art" src="/assets/disciplines/content-production.png" alt="" width="442" height="390" loading="lazy" decoding="async" data-node-id="2113:8859">
      <h3 class="discipline-card__title" data-node-id="2113:8838"><span>Content &amp;</span><span>Production</span></h3>
      <a class="discipline-card__cta" href="#contact" data-node-id="2113:11860">
        <span>Start your project</span><img src="/assets/disciplines/arrow-right.svg" alt="" width="24" height="24">
      </a>
    </article>

    <article class="discipline-card discipline-card--growth" id="growth-media" style="--card-index: 4" data-node-id="2113:11863">
      <div class="discipline-card__meta" data-node-id="2113:11865">
        <div class="discipline-card__number">04</div>
        <p class="text-measure">The engine. Media buying and performance, proven on accounts scaling fast. Built into tech brands and products, not bolted on after.</p>
        <ul class="discipline-card__tags" aria-label="Growth and media services">
          <li>Media Strategy</li><li>Performance</li><li>Paid</li><li>SEO</li><li>Automation</li><li>Measurement</li>
        </ul>
      </div>
      <img class="discipline-card__art" src="/assets/disciplines/growth-media.png" alt="" width="406" height="406" loading="lazy" decoding="async" data-node-id="2113:11888">
      <h3 class="discipline-card__title" data-node-id="2113:11864"><span>Growth &amp;</span><span>Media</span></h3>
      <a class="discipline-card__cta" href="#contact" data-node-id="2113:11885">
        <span>Start your project</span><img src="/assets/disciplines/arrow-right.svg" alt="" width="24" height="24">
      </a>
    </article>
  </section>
  </main>

  <footer class="site-footer" id="contact" data-node-id="2117:15020">
    <section class="footer-pitch" aria-labelledby="footer-pitch-title" data-node-id="2117:15021">
      <img class="footer-pitch__grid" src="/assets/footer/grid.png" alt="" width="1440" height="632" aria-hidden="true" data-node-id="2117:15022">
      <h2 class="footer-pitch__headline" id="footer-pitch-title" data-node-id="2117:15822">
        <span class="footer-pitch__line footer-pitch__line--one">
          <span>Let’s build</span>
          <img class="footer-pitch__red-mark" src="/assets/footer/red-mark.svg" alt="" width="224" height="129" aria-hidden="true" data-node-id="2117:15823">
        </span>
        <span class="footer-pitch__line footer-pitch__line--two">
          <span>Something</span>
          <span class="footer-pitch__blue-mark" aria-hidden="true"><img src="/assets/footer/blue-mark.svg" alt="" width="131" height="153" data-node-id="2117:15827"></span>
          <span class="footer-pitch__big">Big.</span>
        </span>
      </h2>

      <a class="footer-pitch__cta" href="#contact" data-node-id="2117:15828">
        <span>Start a conversation</span>
        <img src="/assets/footer/arrow-right.svg" alt="" width="24" height="24" data-node-id="2117:15830">
      </a>
    </section>

    <div class="footer-info" data-node-id="2117:15831">
      <nav class="footer-links footer-links--studio" aria-label="Studio links" data-node-id="2117:15832">
        <p>Studio</p>
        <a href="#work">Work</a>
        <a href="#disciplines">Services</a>
        <a href="#team">Team</a>
        <a href="#podcast">The podcast</a>
      </nav>

      <nav class="footer-links footer-links--connect" aria-label="Connect links" data-node-id="2117:15839">
        <p>Connect</p>
        <a href="#contact">LinkedIn</a>
        <a href="#contact">Instagram</a>
        <a href="#contact">Contact</a>
      </nav>

      <div class="footer-location" data-node-id="2117:15844">
        <p>Location</p>
        <address>
          <img src="/assets/footer/uk-flag.svg" alt="United Kingdom" width="48" height="48" data-node-id="2117:15848">
          <span>184 Cambridge Science Park, Milton, England GB</span>
        </address>
      </div>

      <a class="footer-brand" href="#top" aria-label="ByteCorp Studio home" data-node-id="2117:15853">
        <span>ByteCorp</span>
        <img src="/assets/footer/brand-symbol.svg" alt="" width="72" height="100" data-node-id="2117:15855">
        <span>Studio®</span>
      </a>

      <p class="footer-copyright" data-node-id="2117:15838">© 2026 bytecorp studio</p>
    </div>
  </footer>
`

if (window.location.hash) {
  const initialSection = document.querySelector(window.location.hash)
  if (initialSection) requestAnimationFrame(() => initialSection.scrollIntoView())
}

const menuToggle = document.querySelector('.hero__menu-toggle')
const siteMenu = document.querySelector('.site-menu')
const siteMenuLinks = [...siteMenu.querySelectorAll('a[href]')]
let isMenuOpen = false

const setMenuState = (open) => {
  isMenuOpen = open
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  siteMenu.setAttribute('aria-hidden', String(!open))
  siteMenu.inert = !open
  siteMenu.classList.toggle('is-open', open)
  document.documentElement.classList.toggle('menu-open', open)

  if (open) {
    window.requestAnimationFrame(() => {
      if (isMenuOpen) siteMenuLinks[0]?.focus()
    })
  } else {
    menuToggle.focus()
  }
}

menuToggle.addEventListener('click', () => setMenuState(!isMenuOpen))

siteMenuLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuState(false))
})

document.addEventListener('keydown', (event) => {
  if (!isMenuOpen) return

  if (event.key === 'Escape') {
    event.preventDefault()
    setMenuState(false)
    return
  }

  if (event.key !== 'Tab') return

  const focusLoop = [menuToggle, ...siteMenuLinks]
  const currentIndex = focusLoop.indexOf(document.activeElement)
  const nextIndex = event.shiftKey
    ? (currentIndex <= 0 ? focusLoop.length - 1 : currentIndex - 1)
    : (currentIndex === -1 || currentIndex === focusLoop.length - 1 ? 0 : currentIndex + 1)

  event.preventDefault()
  focusLoop[nextIndex].focus()
})

const heroVideo = document.querySelector('.hero__video')

const artMotion = document.querySelector('.art-motion')
const artStory = document.querySelector('.art-motion__story')
const artCanvas = document.querySelector('.art-motion__canvas')
const artProjects = [...document.querySelectorAll('.motion-card__project')]
const artProjectCopies = [...document.querySelectorAll('.art-motion__project-copy')]
const artPaginationDots = [...document.querySelectorAll('.art-motion__pagination button')]
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
let artMotionFrame = 0
let activeArtProject = -1

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value))

const interpolateStops = (progress, stops) => {
  for (let index = 1; index < stops.length; index += 1) {
    const [endProgress, endValue] = stops[index]
    const [startProgress, startValue] = stops[index - 1]

    if (progress <= endProgress) {
      const segmentProgress = clamp((progress - startProgress) / (endProgress - startProgress))
      return startValue + ((endValue - startValue) * segmentProgress)
    }
  }

  return stops.at(-1)[1]
}

const updateArtStory = () => {
  artMotionFrame = 0
  const storyRect = artStory.getBoundingClientRect()
  const scrollRange = Math.max(1, artStory.offsetHeight - window.innerHeight)
  const progress = clamp(-storyRect.top / scrollRange)
  const isCompact = window.innerWidth <= 900
  const zoomStops = isCompact
    ? [[0, 1], [.3, 1.08], [.62, 1.16], [.86, 1.26], [1, 1.26]]
    : [[0, 1], [.3, 1.17361], [.62, 1.28635], [.86, 1.56851], [1, 1.56851]]
  const zoom = reducedMotionQuery.matches ? 1 : interpolateStops(progress, zoomStops)
  const copyOpacity = reducedMotionQuery.matches
    ? Number(progress >= .12)
    : clamp((progress - .1) / .14)
  const projectIndex = progress < .42 ? 0 : progress < .7 ? 1 : 2
  const canvasHeight = artCanvas.clientHeight
  const stageShift = -50 - (canvasHeight * .0275 * zoom)
  const copyTop = (canvasHeight * (.5 + (.14873 * zoom))) - 10
  const copyScale = reducedMotionQuery.matches || isCompact
    ? 1
    : zoom * .9594

  artMotion.style.setProperty('--art-zoom', zoom.toFixed(5))
  artMotion.style.setProperty('--art-stage-shift', `${stageShift.toFixed(3)}px`)
  artMotion.style.setProperty('--art-copy-opacity', copyOpacity.toFixed(3))
  artMotion.style.setProperty('--art-copy-scale', copyScale.toFixed(5))
  artMotion.style.setProperty('--art-copy-top', `${copyTop.toFixed(3)}px`)
  artMotion.classList.toggle('is-story-active', storyRect.top <= 0)

  if (projectIndex !== activeArtProject) {
    activeArtProject = projectIndex
    const projectCollections = [artProjects, artProjectCopies, artPaginationDots]
    projectCollections.forEach((collection) => {
      collection.forEach((element, index) => element.classList.toggle('is-active', index === projectIndex))
    })
    artPaginationDots.forEach((dot, index) => {
      if (index === projectIndex) dot.setAttribute('aria-current', 'true')
      else dot.removeAttribute('aria-current')
    })
  }
}

const requestArtStoryUpdate = () => {
  if (artMotionFrame) return
  artMotionFrame = window.requestAnimationFrame(updateArtStory)
}

const artProjectScrollTargets = [.24, .56, .82]

artPaginationDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    const storyTop = window.scrollY + artStory.getBoundingClientRect().top
    const scrollRange = Math.max(1, artStory.offsetHeight - window.innerHeight)
    window.scrollTo({
      top: storyTop + (scrollRange * artProjectScrollTargets[index]),
      behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
    })
  })
})

window.addEventListener('scroll', requestArtStoryUpdate, { passive: true })
window.addEventListener('resize', requestArtStoryUpdate)
reducedMotionQuery.addEventListener('change', requestArtStoryUpdate)
requestArtStoryUpdate()

const introRevealSection = document.querySelector('.intro-reveal')
const introRevealItems = [...document.querySelectorAll('.intro-reveal__word, .intro-reveal__shape')]
let introRevealFrame = 0

const updateIntroReveal = () => {
  introRevealFrame = 0
  const sectionRect = introRevealSection.getBoundingClientRect()
  const scrollRange = Math.max(1, sectionRect.height - window.innerHeight)
  const progress = reducedMotionQuery.matches ? 1 : clamp(-sectionRect.top / scrollRange)
  const revealCursor = progress * introRevealItems.length

  introRevealItems.forEach((item, index) => {
    item.style.setProperty('--reveal', clamp(revealCursor - index).toFixed(3))
  })
}

const requestIntroRevealUpdate = () => {
  if (introRevealFrame) return
  introRevealFrame = window.requestAnimationFrame(updateIntroReveal)
}

window.addEventListener('scroll', requestIntroRevealUpdate, { passive: true })
window.addEventListener('resize', requestIntroRevealUpdate)
reducedMotionQuery.addEventListener('change', requestIntroRevealUpdate)
requestIntroRevealUpdate()

const coherenceSection = document.querySelector('.coherence')
const coherenceWords = [...document.querySelectorAll('.coherence__reveal')]
const coherenceCopy = document.querySelector('.coherence__copy')
const coherenceCta = document.querySelector('.coherence__cta')
let coherenceFrame = 0

const updateCoherence = () => {
  coherenceFrame = 0
  const sectionRect = coherenceSection.getBoundingClientRect()
  const scrollRange = Math.max(1, sectionRect.height - window.innerHeight)
  const progress = reducedMotionQuery.matches ? 1 : clamp(-sectionRect.top / scrollRange)
  const headlineProgress = clamp(progress / .78)
  const revealCursor = headlineProgress * coherenceWords.length

  coherenceWords.forEach((word, index) => {
    word.style.setProperty('--reveal', clamp(revealCursor - index).toFixed(3))
  })

  const copyProgress = reducedMotionQuery.matches ? 1 : clamp((progress - .74) / .14)
  const ctaProgress = reducedMotionQuery.matches ? 1 : clamp((progress - .86) / .12)
  coherenceCopy.style.setProperty('--reveal', copyProgress.toFixed(3))
  coherenceCta.style.setProperty('--reveal', ctaProgress.toFixed(3))
  coherenceCta.classList.toggle('is-ready', ctaProgress >= .98)
}

const requestCoherenceUpdate = () => {
  if (coherenceFrame) return
  coherenceFrame = window.requestAnimationFrame(updateCoherence)
}

window.addEventListener('scroll', requestCoherenceUpdate, { passive: true })
window.addEventListener('resize', requestCoherenceUpdate)
reducedMotionQuery.addEventListener('change', requestCoherenceUpdate)
requestCoherenceUpdate()

heroVideo.play().catch(() => {
  const resumeVideo = () => {
    heroVideo.play().catch(() => {})
    window.removeEventListener('pointerdown', resumeVideo)
    window.removeEventListener('keydown', resumeVideo)
  }

  window.addEventListener('pointerdown', resumeVideo, { once: true })
  window.addEventListener('keydown', resumeVideo, { once: true })
})
