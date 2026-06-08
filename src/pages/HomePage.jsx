import { Link } from "react-router-dom";

// ── Icons ──────────────────────────────────────────────────────────────────
const ArrowForwardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const NorthEastIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7v10"/>
  </svg>
);
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
);
const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const BOOKS = [
  {
    id: 1,
    category: "Programming",
    title: "The Algorithmic Mind",
    author: "Dr. Elena Sterling",
    price: "₹5,586",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_HxUnQTcnDZ-ntckx34jbDatOV4Jhcr2lEeju6h6OzwrZxKcahaaL7hUrde_BPnZUY6eLPoXicGoAlkeIDoRbKXqAZxZ1Rf01RFw4ltaleHA3QGUMmvbFyCbNgSCauLX4fxFxDKNmMgJRX9OlUZAeycDuVt9exsax3_tHXC7W5_txP1sotW4T0xkQrTao2nhRaqWh2xHeHaxEihwZ0SizwkvwJtJ1zcCW3N1R-7DRFS-sfG0345Qx7X6HVAve1AiZ5AgpsfLc7g",
  },
  {
    id: 2,
    category: "Fiction",
    title: "Quiet Peaks",
    author: "Julian M. Thorne",
    price: "₹2,900",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbLNtLO7T_yvJ4Ge0C2_HJcRQFlgq3ssvo1vtcI9_OqjXFtwq9-HL-uJEodYHGW5T-SdBPi1zpkHQCiRzLwpyOGABoq4_hUvQJXeRR1bp1xRUqMvl5alth6nGjyVR57g23jUMJj0Fd0005dv9i60Qf70y3vSAXvatq7SM7GozzcCIYYiEGEGpdS1hSH1h-ohCK5hbk3AiUGj0uTHZGRvOLlFmDT1Nug09fWH0Fj83QR_DjtkQDQ0G4-tXgsHyw-vOyxj0Zrm80RQ",
  },
  {
    id: 3,
    category: "Philosophy",
    title: "Modern Ethics",
    author: "Sarah Jean Collins",
    price: "₹2,052",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6bPQfs8-ZH9gkW8m5rtKAa8YczvnnLFy8UucLoMgrc8Ic-iCswvEsawok2KVVBx2nijH84iWSFbj-0c7xZfKNjSc6U1oLandIk1-oEIDHE7uvmBQudXhs9uaDIpUDBaUqJwkOc0vVC7M8pnPJWJDhYqMYWPHbROEJ2hAieTmURsI_MXYMXSIKc2xovVn8cVINiZYgmP5RwjcICm1pqsski7mOTxUXF6cbg3s7rwMqkhOI8W2K1AWPw7hur-ylrognF7vcYSve9w",
  },
  {
    id: 4,
    category: "Technology",
    title: "The Nature of Technology",
    author: "W. Brian Arthur",
    price: "₹3000",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkw3aY6__XId_Bmi-rr-J-Y6huBhlLAS343vPR7gvcuiTya2-F3YjpeFnrIgKNbkD4hEEf1sIvf3BsfVNQFs_SCw-qu6ChsuT-64IItMvqONLdkgurWOds-ucOCiJnAM3I3TjMinpDSg2twHCzUDniqBaRUaP8DPhDjz3QfY4YeQZDq8Rdqjnd4qyV3UXFpNUCdHWL5V_FTYp13PSQkzWKvQkUOBlRSpph4C-Q5vIcy1xjIZU2DgPLjdcIEO-lZJTw3yQofbDZOg",
    img:"https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781439165782/the-nature-of-technology-9781439165782_hr.jpg"
  },
];

const CATEGORIES = [
  {
    id: 1,
    title: "Fiction & Prose",
    desc: "Journey into worlds of imagination and masterful storytelling.",
    cta: "View Category",
    span: "md:col-span-2 md:row-span-2",
    titleSize: "text-2xl",
    showDesc: true,
    overlay: "from-[#002629]/80",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA3ecqLdKTybXlahKXvNgMdmZ-o4OJbhcmEWB9mL4IwFhI14mo2YiVqd7IB9I-DZsvfw2A3qq_nkffWsCnfmXjiwrMF1-MEbAHv5szCzVqALSKf7a11ktYUPFqMkpXonL46FOUD54H4rWw0l8YEfWIRXIZs3gAterEn76lFM-6gbEcc6-S5Okn_P2yYL4yM7UPNDp5jK5G1vlF2j7WhkRV7Kte4EfNscA5sPBkQNNCTkUa0bfM9EIPbyzX8IlkigQc-i5bfpm7Ig",
  },
  {
    id: 2,
    title: "Academic",
    desc: "",
    cta: "Explore Journals",
    span: "",
    titleSize: "text-xl",
    showDesc: false,
    overlay: "from-[#381905]/80",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAh_DDB9a_t6zcsFAPGLuJqbSkENU4LKtyMTDmlTzAh6I8IEkzHzFQW9Kxcq7cA6nq911jn4BZw9aYzM64ABV-jVQ4C9erPUAxjYDrZ-rmjvkY2pLl0xtELHleVcFjk3-uKarDMXJEokcRrETreaX4C5QIMnIGG1UhvmHGTPS0NF1EFsUXwX98T_uKfy9CwjcBH16NleAhEIJ3TfAQSV_KLrCj8LKcFFQDN7kjDGmnTf_P1Or0yOKS535EYILnvWjI_sLgIr6A1Sg",
  },
  {
    id: 3,
    title: "Programming",
    desc: "",
    cta: "Technical Guides",
    span: "",
    titleSize: "text-xl",
    showDesc: false,
    overlay: "from-black/80",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjkaG8giLeg1dJhkFoC4UMLd9sRtvs7x5nS89x_3jsva1SXQjhg8xUpWXC8iyTGbgdeG6LbF6Rn39hnVlB2FWcXD8ra2bruvbNOz3WE0N9qbl49MGK_-t66XZWRUaulHAOYR2LBme9bwNqgY4TRV2N5zqmbPw_1mr-mQpSYDDqz-zE3ll66Eok7WQgmBGb67Bb7G4iUIqHLbgWgsTUoDjaWBiMVRYACo02KIsT-bEulnA8k4oG4WaNv58Gw13qdLlMTXQlUxfREw",
  },
  {
    id: 4,
    title: "Philosophy & Ethics",
    desc: "Profound wisdom for the modern thinker.",
    cta: "",
    span: "md:col-span-2",
    titleSize: "text-xl",
    showDesc: true,
    overlay: "from-[#002629]/80",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa9vRg6jLYcT0TApT3O8Ltgbf_wYXte3Ig2BdGJw-qpNECPHCtxgcxF5HGmCjkSxvly3w2yg3hqnlJ7u28F-oE2ep4fygMQD1pUdE4El3MDr-XXLyMejbHJW8YLDN8MVFYoyJBZjlFHctAQtjV0F99hCQUDHuSg75Amvgnz6c70uaOKqWgSEv1cmZrd-s-u8i4uD7k6hLJ8BYe8036wrjkMAawvC4hPmCRyFF4oCIfaoGg8jfVoE74NjLLBrYqDnJzgJm00TJ0aA",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function BookCard({ book }) {
  return (
    <div className="group bg-white p-6 rounded-xl hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-2">
      <div className="aspect-[3/4] rounded-lg overflow-hidden mb-6 shadow-md bg-[#ebeef4]">
        <img
          src={book.img}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#083d41]">
          {book.category}
        </span>
        <h3 className="text-lg font-bold text-[#181c20] leading-tight">{book.title}</h3>
        <p className="text-sm text-[#404849] font-medium">{book.author}</p>
        <div className="pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#002629]">{book.price}</span>
          <button className="w-10 h-10 rounded-full bg-[#002629] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CartIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ cat }) {
  return (
    <div className={`group relative overflow-hidden rounded-xl bg-white ${cat.span}`}>
      <img
        src={cat.img}
        alt={cat.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${cat.overlay} to-transparent`} />
      <div className="absolute bottom-0 p-6 md:p-8">
        <h3 className={`${cat.titleSize} font-bold text-white mb-1 md:mb-2`}>{cat.title}</h3>
        {cat.showDesc && cat.desc && (
          <p className="text-white/80 text-sm mb-4">{cat.desc}</p>
        )}
        {cat.cta && (
          <button className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:underline">
            {cat.cta} <NorthEastIcon />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Presenter ─────────────────────────────────────────────────────────
export default function HomePresenter({ newsletterEmail, setNewsletterEmail, handleNewsletterSubmit }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        .hp-headline { font-family: 'Manrope', sans-serif; }
        .hp-body     { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="hp-body bg-[#f7f9ff] text-[#181c20]">

        {/* ── Hero ── */}
        <section className="relative min-h-[820px] flex items-center px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20 lg:py-0">

            {/* Left */}
            <div className="z-10 space-y-8">
              <span className="text-[#c99577] font-semibold tracking-widest text-xs uppercase hp-headline">
                The Digital Curator
              </span>
              <h1 className="hp-headline text-6xl xl:text-7xl font-extrabold tracking-tight text-[#002629] leading-[1.08]">
                Read, Discover,<br />
                <span className="bg-gradient-to-r from-[#002629] to-[#083d41] bg-clip-text text-transparent">
                  Learn Every Day.
                </span>
              </h1>
              <p className="text-xl text-[#404849] leading-relaxed max-w-lg font-light">
                Experience literature through a sophisticated lens. ePustakalay curates the world's most influential texts into a focused digital environment.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <Link
                  to="/books"
                  className="px-8 py-4 bg-gradient-to-br from-[#002629] to-[#083d41] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#002629]/20 transition-all active:scale-95 no-underline"
                >
                  Explore Books
                </Link>
                <button className="flex items-center gap-2 text-[#002629] font-bold group/btn hover:gap-3 transition-all">
                  Our Library Philosophy
                  <span className="group-hover/btn:translate-x-1 transition-transform">
                    <ArrowForwardIcon />
                  </span>
                </button>
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative  xl:h-[600px] hidden lg:block">
              <div className="absolute inset-0 bg-[#e5e8ee] rounded-4xl rotate-3"></div>
            <img
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiJXHShr7dXIMwT7fsFt_Jjl_WeG7yXhzSS-KTx3HtHe4391t2IFMgxFDbIkgn2B-p_w1a22wTGxSQMPRK8kxaGJQzzLYs4IllU65e_ULFtnCX06WTioDPQdqaihReDlEsG0CB0ZwmzzR11Z7I4jnLq4k5DS9xfQu-7Fj45y5lX3EXjpznhyYvkHwgxrewIYm_ZsVEtRemyHpxK2hVSwb98acNxjkVcsChZdZcijRvxPWlHKyi93sT0LLpsw8l413jWClh5K3Mdg"
              className="relative rounded-4xl h-150 w-full object-cover shadow-2xl"
            />
              {/* Floating card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl shadow-black/5 flex gap-4 max-w-xs items-center">
                <div className="w-12 h-12 bg-[#ffdbc9] rounded-full flex items-center justify-center text-[#381905] flex-shrink-0">
                  <BookIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#181c20]">Daily Reading Goal</p>
                  <p className="text-xs text-[#404849]">You've completed 75% of today's target.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Browse Collections (Bento Grid) ── */}
        <section className="bg-[#f1f4fa] py-24 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="hp-headline text-4xl font-bold tracking-tight text-[#002629]">
                  Browse Collections
                </h2>
                <p className="text-[#404849] mt-2">Curated categories for every intellectual pursuit.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">
              {CATEGORIES.map(cat => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Arrivals ── */}
        <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="hp-headline text-4xl font-bold tracking-tight text-[#002629]">
              Featured Arrivals
            </h2>
            <div className="flex gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e5e8ee] text-[#404849] hover:bg-[#002629] hover:text-white transition-colors">
                <ChevronLeftIcon />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e5e8ee] text-[#404849] hover:bg-[#002629] hover:text-white transition-colors">
                <ChevronRightIcon />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BOOKS.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="py-12 px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="bg-[#002629] rounded-[2.5rem] p-10 lg:p-20 relative overflow-hidden">
            {/* decorative svg */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="hp-headline text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
                Refine Your Reading Experience
              </h2>
              <p className="text-[#7aa8ac] text-xl mb-10 font-light">
                Join 50,000+ readers who receive our curated weekend reading digest and early access to rare digital collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your academic email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="flex-grow bg-white/10 border-none rounded-xl px-6 py-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#7aa8ac] outline-none backdrop-blur-md"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="px-8 py-4 bg-white text-[#002629] font-bold rounded-xl hover:bg-[#7aa8ac] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}