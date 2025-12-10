import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
type ViewType = 'home' | 'fakty' | 'inwestycje' | 'lifestyle' | 'budzet' | 'kontakt';

// --- Mock Data (CMS Structure Preparation) ---

const FACTS_DATA = [
    { id: 1, title: "Czy basen będzie płatny dla seniorów?", status: "truth", date: "12 Paź 2024", summary: "Seniorzy 65+ wchodzą za darmo w godzinach 10-12.", icon: "fa-check" },
    { id: 2, title: "Zamykają główną bibliotekę?", status: "fake", date: "10 Paź 2024", summary: "To tylko plotka. Biblioteka przechodzi remont elewacji, działa normalnie.", icon: "fa-times" },
    { id: 3, title: "Podwyżka cen biletów komunikacji", status: "verify", date: "08 Paź 2024", summary: "Rada miasta debatuje nad projektem. Decyzja zapadnie w listopadzie.", icon: "fa-search" },
    { id: 4, title: "Nowa ścieżka rowerowa na ul. Polnej", status: "truth", date: "05 Paź 2024", summary: "Przetarg rozstrzygnięty. Prace ruszają wiosną.", icon: "fa-check" }
];

const INVESTMENTS_DATA = [
    { id: 1, title: "Hala Sportowa", status: "Opóźniony", progress: 75, badge: "warning", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop", desc: "Montaż instalacji wewnętrznych. Termin oddania: Q1 2025." },
    { id: 2, title: "Rewitalizacja Parku", status: "W trakcie", progress: 40, badge: "success", img: "https://images.unsplash.com/photo-1496347312910-c081831d054d?q=80&w=800&auto=format&fit=crop", desc: "Nasadzenia drzew i budowa alejek." },
    { id: 3, title: "Bulwary nad rzeką", status: "Planowanie", progress: 10, badge: "info", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop", desc: "Konsultacje społeczne i pozyskiwanie zgód środowiskowych." },
    { id: 4, title: "Remont Rynku", status: "Zakończony", progress: 100, badge: "success", img: "https://images.unsplash.com/photo-1514525253440-b393452e8220?q=80&w=800&auto=format&fit=crop", desc: "Inwestycja odebrana. Fontanna działa." }
];

const LIFESTYLE_ITEMS = [
    { id: 1, title: "Dni Ostrowi", category: "Kultura", size: "wide", img: "https://images.unsplash.com/photo-1459749411177-0473ef716175?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Nowa Kawiarnia 'Aromat'", category: "Gastronomia", size: "tall", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Nocne Bieganie", category: "Sport", size: "", img: "https://images.unsplash.com/photo-1520095972714-909e91b038e5?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Wystawa Fotografii", category: "Sztuka", size: "", img: "https://images.unsplash.com/photo-1514525253440-b393452e8220?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Jarmark Świąteczny", category: "Wydarzenia", size: "wide", img: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=800&auto=format&fit=crop" }
];

const NEWS_DATA = [
    {
        id: 1,
        title: "Nowy harmonogram wywozu odpadów",
        date: "14 Paź 2024",
        category: "Komunikaty",
        img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
        excerpt: "Urząd Miasta opublikował zaktualizowany kalendarz odbioru odpadów wielkogabarytowych na IV kwartał tego roku."
    },
    {
        id: 2,
        title: "Sukces KS Ostrów! Mamy finał",
        date: "12 Paź 2024",
        category: "Sport",
        img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
        excerpt: "Nasi siatkarze pokonali lidera tabeli 3:0. Decydujący mecz o awans do wyższej ligi odbędzie się już w sobotę."
    },
    {
        id: 3,
        title: "Remont ulicy Długiej zakończony",
        date: "10 Paź 2024",
        category: "Inwestycje",
        img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
        excerpt: "Kierowcy mogą już korzystać z nowej nawierzchni. Wzdłuż drogi powstała też bezpieczna ścieżka rowerowa."
    }
];


// --- Shared Components ---

// 3D Tilt Card
const TiltCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };
    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };
    return (
        <div ref={cardRef} className={`tilt-card-inner ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {children}
        </div>
    );
};

// Animated Counter
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { setIsVisible(true); observer.disconnect(); }
        });
        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (!isVisible) return;
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(ease * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);
    return <span ref={countRef}>{count}{suffix}</span>;
};

// Page Header Shared Component
const PageHeader = ({ title, subtitle, note }: { title: string, subtitle: string, note: string }) => (
    <div className="container page-header fade-in-up">
        <span className="human-note">{note}</span>
        <h1>{title}</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.8, fontSize: '1.1rem' }}>{subtitle}</p>
    </div>
);


// --- Page Views ---

const HomePage = ({ setView }: { setView: (view: ViewType) => void }) => (
    <div className="view-content">
        <section className="hero">
            <div className="container">
                <div className="hero-split">
                    <div className="hero-content fade-in-up">
                        <span className="human-note">Blisko Ludzi.</span>
                        <h1>Nasza Ostrów, <br/><span>Nasze Sprawy.</span></h1>
                        <p className="hero-lead">
                            Niezależny portal mieszkańców. Sprawdzamy inwestycje, 
                            monitorujemy wydatki i promujemy to, co w naszym mieście najlepsze. 
                            Bo Ostrów to nasz wspólny dom.
                        </p>
                        <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                            <button onClick={() => setView('inwestycje')} className="btn btn-primary">Raport Inwestycji</button>
                            <button onClick={() => setView('lifestyle')} className="btn btn-secondary">Życie Miasta</button>
                        </div>
                    </div>
                    <div className="hero-visual fade-in-up">
                        <TiltCard>
                            <div className="glass-card card-main">
                                <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop" alt="City Aerial" />
                                <h3>Puls Miasta</h3>
                                <p style={{fontSize: '0.9rem', opacity: 0.7}}>Codzienny monitoring</p>
                            </div>
                            <div className="glass-card card-float-1">
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <div style={{width: '10px', height: '10px', background: 'var(--secondary)', borderRadius: '50%', boxShadow: '0 0 10px var(--secondary)'}}></div>
                                    <span style={{fontWeight: 600, fontSize: '0.9rem'}}>12 Aktywnych budów</span>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </div>
            </div>
        </section>

        <section id="stats">
            <div className="container">
                <div className="grid-4">
                    <div className="stat-card fade-in-up">
                        <i className="fas fa-tree" style={{fontSize: '2rem', color: 'var(--secondary)'}}></i>
                        <div className="stat-val"><AnimatedCounter end={1450} /></div>
                        <p>Nowych nasadzeń</p>
                    </div>
                    <div className="stat-card fade-in-up" style={{transitionDelay: '0.1s'}}>
                        <i className="fas fa-coins" style={{fontSize: '2rem', color: 'var(--accent)'}}></i>
                        <div className="stat-val"><AnimatedCounter end={42} suffix="m" /></div>
                        <p>Pozyskanych dotacji</p>
                    </div>
                    <div className="stat-card fade-in-up" style={{transitionDelay: '0.2s'}}>
                        <i className="fas fa-hard-hat" style={{fontSize: '2rem', color: 'var(--primary)'}}></i>
                        <div className="stat-val"><AnimatedCounter end={12} /></div>
                        <p>Realizowanych projektów</p>
                    </div>
                    <div className="stat-card fade-in-up" style={{transitionDelay: '0.3s'}}>
                        <i className="fas fa-users" style={{fontSize: '2rem', color: '#f59e0b'}}></i>
                        <div className="stat-val"><AnimatedCounter end={85} suffix="%" /></div>
                        <p>Budżetu obywatelskiego</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- NEWS SECTION --- */}
        <section id="news" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
            <div className="container">
                <div className="section-header fade-in-up">
                    <span className="sub-header">CO SŁYCHAĆ W MIEŚCIE?</span>
                    <h2>Aktualności Lokalne</h2>
                </div>
                <div className="grid-3">
                    {NEWS_DATA.map((news, index) => (
                        <article className="card fade-in-up" key={news.id} style={{ transitionDelay: `${index * 0.1}s`, cursor: 'pointer' }} onClick={() => alert('Wkrótce pełny artykuł!')}>
                            <div className="card-image-container" style={{ height: '200px' }}>
                                <span className="status-badge info" style={{ borderRadius: '8px', right: 'auto', left: '20px' }}>{news.category}</span>
                                <img src={news.img} alt={news.title} />
                            </div>
                            <div className="card-body">
                                <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '5px' }}>{news.date}</span>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', lineHeight: '1.4' }}>{news.title}</h3>
                                <p style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '20px' }}>{news.excerpt}</p>
                                <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Czytaj więcej <i className="fas fa-arrow-right" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}></i>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="fade-in-up" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <button className="btn btn-secondary" onClick={() => setView('fakty')}>Zobacz wszystkie wpisy</button>
                </div>
            </div>
        </section>
    </div>
);

const FactsPage = () => (
    <div className="view-content">
        <PageHeader 
            title="Liczby nie kłamią" 
            subtitle="Weryfikujemy plotki, sprawdzamy dane i dostarczamy rzetelne informacje prosto z ratusza i ulic miasta."
            note="Fact-Checking"
        />
        <div className="container">
            <div className="grid-1" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {FACTS_DATA.map((fact, index) => (
                    <div className="fact-item fade-in-up" key={fact.id} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <div className={`fact-icon ${fact.status === 'truth' ? 'fact-true' : fact.status === 'fake' ? 'fact-false' : 'fact-verify'}`}>
                            <i className={`fas ${fact.icon}`}></i>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{fact.date}</span>
                                <span style={{ 
                                    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                                    color: fact.status === 'truth' ? 'var(--secondary)' : fact.status === 'fake' ? 'var(--danger)' : 'var(--warning)'
                                }}>
                                    {fact.status === 'truth' ? 'Potwierdzone' : fact.status === 'fake' ? 'Fake News' : 'W trakcie weryfikacji'}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{fact.title}</h3>
                            <p style={{ opacity: 0.8 }}>{fact.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const InvestmentsPage = () => (
    <div className="view-content">
        <PageHeader 
            title="Mapa Inwestycji" 
            subtitle="Śledzimy postępy prac na terenie całego miasta. Od projektów po odbiory końcowe."
            note="Raport z terenu"
        />
        <div className="container">
            <div className="grid-2">
                {INVESTMENTS_DATA.map((item, index) => (
                    <div className="card fade-in-up" key={item.id} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <div className="card-image-container">
                            <span className={`status-badge ${item.badge}`}>{item.status}</span>
                            <img src={item.img} alt={item.title} />
                        </div>
                        <div className="card-body">
                            <h3>{item.title}</h3>
                            <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '15px' }}>{item.desc}</p>
                            
                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                                    <span>Postęp prac</span>
                                    <span>{item.progress}%</span>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${item.progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const LifestylePage = () => (
    <div className="view-content">
        <PageHeader 
            title="Ostrów Żyje" 
            subtitle="Kultura, sport, gastronomia i ludzie. Zobacz pozytywną stronę naszego miasta."
            note="Po godzinach"
        />
        <div className="container">
            <div className="gallery-grid">
                {LIFESTYLE_ITEMS.map((item, index) => (
                    <div className={`gallery-item ${item.size} fade-in-up`} key={item.id} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <img src={item.img} alt={item.title} />
                        <div className="overlay">
                            <div>
                                <span style={{ 
                                    background: 'var(--primary)', color: '#fff', padding: '4px 10px', 
                                    borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '8px', display: 'inline-block' 
                                }}>
                                    {item.category}
                                </span>
                                <h4 style={{ color: 'white', margin: 0 }}>{item.title}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const BudgetPage = () => (
    <div className="view-content">
        <PageHeader 
            title="Analiza Wydatków" 
            subtitle="Przejrzystość finansowa to podstawa. Sprawdzamy na co idą Twoje podatki."
            note="Budżet 2024"
        />
        <div className="container">
            <div className="chart-box fade-in-up">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <h3>Wydatki Miasta</h3>
                    <span className="human-note" style={{transform: 'rotate(2deg)'}}>Gdzie płyną pieniądze?</span>
                </div>
                <div className="bar-chart">
                    <div className="bar active" data-height="80%" style={{height: 0}}>
                        <span><AnimatedCounter end={85} suffix="m" /></span>
                        <div className="bar-label">Edukacja</div>
                    </div>
                    <div className="bar" data-height="45%" style={{height: 0}}>
                        <span><AnimatedCounter end={40} suffix="m" /></span>
                        <div className="bar-label">Infrastruktura</div>
                    </div>
                    <div className="bar warning" data-height="35%" style={{height: 0, background: 'var(--accent)'}}>
                        <span><AnimatedCounter end={30} suffix="m" /></span>
                        <div className="bar-label">Administracja</div>
                    </div>
                    <div className="bar" data-height="20%" style={{height: 0}}>
                        <span><AnimatedCounter end={15} suffix="m" /></span>
                        <div className="bar-label">Kultura</div>
                    </div>
                </div>
            </div>
            
            <div className="grid-2" style={{ marginTop: '40px' }}>
                <div className="card fade-in-up" style={{ padding: '30px' }}>
                    <h3><i className="fas fa-arrow-up" style={{color: 'var(--secondary)'}}></i> Przychody</h3>
                    <ul style={{ listStyle: 'none', marginTop: '20px', padding: 0 }}>
                        <li style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>
                            <span>PIT/CIT</span>
                            <strong>45 mln PLN</strong>
                        </li>
                        <li style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px'}}>
                            <span>Dotacje UE</span>
                            <strong>22 mln PLN</strong>
                        </li>
                        <li style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Podatki lokalne</span>
                            <strong>15 mln PLN</strong>
                        </li>
                    </ul>
                </div>
                <div className="card fade-in-up" style={{ padding: '30px' }}>
                    <h3><i className="fas fa-arrow-down" style={{color: 'var(--danger)'}}></i> Deficyt</h3>
                    <p style={{ marginTop: '10px', opacity: 0.8 }}>
                        Planowany deficyt na rok 2024 wynosi 12 mln PLN i zostanie pokryty z emisji obligacji komunalnych.
                    </p>
                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <small>Zadłużenie całkowite:</small>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-heading)' }}>28% budżetu</div>
                        <small style={{ color: 'var(--secondary)' }}>Bezpieczny poziom</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ContactPage = () => (
    <div className="view-content">
        <PageHeader 
            title="Zgłoś Temat" 
            subtitle="Widzisz coś niepokojącego? A może chcesz pochwalić inicjatywę sąsiada? Napisz do nas."
            note="Kontakt"
        />
        <div className="container">
            <div className="grid-2" style={{ gap: '50px' }}>
                <div className="fade-in-up">
                    <div className="card" style={{ padding: '40px', background: 'var(--bg-secondary)' }}>
                        <h3 style={{ marginBottom: '20px' }}>Formularz Zgłoszeniowy</h3>
                        <form className="modern-form" onSubmit={(e) => {e.preventDefault(); alert("Dziękujemy za zgłoszenie! Zweryfikujemy ten temat.");}}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Kategoria</label>
                            <select>
                                <option>Interwencja</option>
                                <option>Wydarzenie</option>
                                <option>Pytanie do redakcji</option>
                                <option>Współpraca</option>
                            </select>
                            
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Temat</label>
                            <input type="text" placeholder="Krótki tytuł sprawy" required />
                            
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Opis</label>
                            <textarea rows={5} placeholder="Opisz szczegóły, lokalizację, datę..." required></textarea>
                            
                            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Wyślij Zgłoszenie</button>
                        </form>
                    </div>
                </div>
                
                <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <TiltCard>
                        <div className="glass-card" style={{ width: '100%', padding: '40px', textAlign: 'center' }}>
                            <i className="fas fa-paper-plane" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '20px' }}></i>
                            <h3>Jesteśmy niezależni</h3>
                            <p style={{ margin: '20px 0', opacity: 0.8 }}>
                                Portal "Nasza Ostrów" powstaje oddolnie. Nie jesteśmy powiązani z Urzędem Miasta ani żadną partią polityczną.
                            </p>
                            <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                <a href="#" style={{ fontSize: '1.5rem', opacity: 0.7 }}><i className="fab fa-facebook"></i></a>
                                <a href="#" style={{ fontSize: '1.5rem', opacity: 0.7 }}><i className="fab fa-instagram"></i></a>
                                <a href="#" style={{ fontSize: '1.5rem', opacity: 0.7 }}><i className="fab fa-twitter"></i></a>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </div>
    </div>
);


// --- Main App Logic ---

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [activeView, setActiveView] = useState<ViewType>('home');

    // Scroll to top when view changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeView]);

    // Intersection Observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Animate charts when visible
                    const charts = entry.target.querySelectorAll('.bar') as NodeListOf<HTMLElement>;
                    charts.forEach(bar => {
                        const height = bar.getAttribute('data-height');
                        if (height) bar.style.height = height;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe elements in the current view (needs a timeout to wait for render)
        setTimeout(() => {
            const elements = document.querySelectorAll('.fade-in-up');
            elements.forEach(el => observer.observe(el));
        }, 100);

        return () => observer.disconnect();
    }, [activeView]); // Re-run when view changes

    useEffect(() => {
        if (!darkMode) document.body.classList.add('light-mode');
        else document.body.classList.remove('light-mode');
    }, [darkMode]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleTheme = () => setDarkMode(!darkMode);

    const handleNavClick = (view: ViewType) => {
        setActiveView(view);
        setIsMenuOpen(false);
    };

    return (
        <>
            <div className="bg-container">
                <div className="hero-bg-image"></div>
                <div className="hero-overlay"></div>
            </div>

            <header className={scrolled ? 'scrolled' : ''}>
                <div className="container nav-container">
                    <button onClick={() => handleNavClick('home')} className="modern-logo">
                        <div className="logo-badge">
                            <i className="fas fa-heart"></i>
                        </div>
                        <div className="logo-text-container">
                            <span className="logo-prefix">Nasza</span>
                            <span className="logo-main">Ostrów</span>
                        </div>
                    </button>
                    <nav className="desktop-nav">
                        <button className={activeView === 'fakty' ? 'active' : ''} onClick={() => handleNavClick('fakty')}>Fakty</button>
                        <button className={activeView === 'inwestycje' ? 'active' : ''} onClick={() => handleNavClick('inwestycje')}>Inwestycje</button>
                        <button className={activeView === 'lifestyle' ? 'active' : ''} onClick={() => handleNavClick('lifestyle')}>Styl Życia</button>
                        <button className={activeView === 'budzet' ? 'active' : ''} onClick={() => handleNavClick('budzet')}>Budżet</button>
                        <button className={activeView === 'kontakt' ? 'active' : ''} onClick={() => handleNavClick('kontakt')}>Zgłoś Temat</button>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
                        </button>
                    </nav>
                    <div className="hamburger" onClick={toggleMenu}><i className="fas fa-bars"></i></div>
                </div>
            </header>

            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <div className="close-menu" onClick={toggleMenu}>&times;</div>
                <button onClick={() => handleNavClick('home')}>Start</button>
                <button onClick={() => handleNavClick('fakty')}>Fakty</button>
                <button onClick={() => handleNavClick('inwestycje')}>Inwestycje</button>
                <button onClick={() => handleNavClick('lifestyle')}>Styl Życia</button>
                <button onClick={() => handleNavClick('budzet')}>Budżet</button>
                <button onClick={() => handleNavClick('kontakt')}>Kontakt</button>
            </div>

            {/* View Router */}
            <main style={{ minHeight: '80vh' }}>
                {activeView === 'home' && <HomePage setView={handleNavClick} />}
                {activeView === 'fakty' && <FactsPage />}
                {activeView === 'inwestycje' && <InvestmentsPage />}
                {activeView === 'lifestyle' && <LifestylePage />}
                {activeView === 'budzet' && <BudgetPage />}
                {activeView === 'kontakt' && <ContactPage />}
            </main>

            <footer>
                <div className="container" style={{textAlign: 'center'}}>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <button onClick={() => handleNavClick('fakty')} style={{ fontSize: '0.9rem', opacity: 0.6 }}>Redakcja</button>
                        <button onClick={() => handleNavClick('kontakt')} style={{ fontSize: '0.9rem', opacity: 0.6 }}>Polityka Prywatności</button>
                        <button onClick={() => handleNavClick('kontakt')} style={{ fontSize: '0.9rem', opacity: 0.6 }}>Reklama</button>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Nasza Ostrów. Portal mieszkańców.</p>
                </div>
            </footer>
        </>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
