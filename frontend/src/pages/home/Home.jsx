import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  MessageCircle,
  Users,
  FileText,
  Clock,
  CircleCheck,
  Sparkles,
  School,
  ChevronRight,
  Menu,
  X,
  BarChart3,
  Calendar,
  UserPlus,
  Upload,
  MessageSquare,
  Eye,
  Globe,
  CheckCircle2
} from 'lucide-react';
import './Home.css';
import logo from '../../assets/minha-logo.png';
import logoUnb from '../../assets/logo-unb.png';
import logoGif from '../../assets/logo-animation.gif';

const FEATURES = [
  {
    icon: BookOpen,
    titulo: 'Conteúdos organizados',
    descricao: 'Materiais separados por disciplina e conteúdo, tudo em um só lugar.',
  },
  {
    icon: FileText,
    titulo: 'Materiais de estudo',
    descricao: 'PDFs, vídeos, links e documentos disponíveis para download.',
  },
  {
    icon: MessageCircle,
    titulo: 'Fórum de dúvidas',
    descricao: 'Espaço para interação entre alunos e professores.',
  },
  {
    icon: Users,
    titulo: 'Professores',
    descricao: 'Publique conteúdos e materiais de forma simples e rápida.',
  },
  {
    icon: Clock,
    titulo: 'Organização dos estudos',
    descricao: 'Estruture seus estudos com cronogramas e planejamento.',
  },
  {
    icon: CircleCheck,
    titulo: 'Acompanhamento do progresso',
    descricao: 'Visualize seu desempenho e evolução acadêmica.',
  },
];

const STEPS = [
  {
    numero: '01',
    titulo: 'Crie sua conta',
    descricao: 'Cadastre-se gratuitamente em poucos minutos.',
    icon: UserPlus
  },
  {
    numero: '02',
    titulo: 'Explore os conteúdos',
    descricao: 'Navegue pelas disciplinas e encontre os materiais ideais para você.',
    icon: BookOpen
  },
  {
    numero: '03',
    titulo: 'Acesse os materiais',
    descricao: 'Estude com PDFs, vídeos e links compartilhados pelos professores.',
    icon: FileText
  },
  {
    numero: '04',
    titulo: 'Interaja e evolua',
    descricao: 'Participe do fórum, tire dúvidas e acompanhe seu progresso.',
    icon: Sparkles
  },
];

const TEACHER_STEPS = [
  {
    icon: UserPlus,
    titulo: 'Cadastro',
    descricao: 'Crie sua conta como professor na plataforma.',
  },
  {
    icon: Upload,
    titulo: 'Envio de currículo',
    descricao: 'Envie seu currículo para análise da nossa equipe.',
  },
  {
    icon: CheckCircle2,
    titulo: 'Aprovação',
    descricao: 'Após análise, você passa a fazer parte da plataforma.',
  },
  {
    icon: BookOpen,
    titulo: 'Criação de conteúdos',
    descricao: 'Publique conteúdos, materiais e organize suas disciplinas.',
  },
  {
    icon: MessageSquare,
    titulo: 'Interação',
    descricao: 'Responda dúvidas dos alunos e acompanhe suas publicações.',
  },
];

export function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sections = useRef([]);
  const statsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gs-home-section--visible');
            
            if (entry.target.classList.contains('gs-home-stats')) {
              animateStats();
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    window.addEventListener('scroll', handleScroll);
    sections.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const animateStats = () => {
    const statElements = document.querySelectorAll('.gs-home-stat__number');
    statElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="gs-home">

      <header className={`gs-home-nav ${isScrolled ? 'gs-home-nav--scrolled' : ''}`}>
        <div className="gs-home-nav__inner">
          <Link to="/" className="gs-home-nav__logo">
            <img src={logo} alt="GoStudy" className="gs-home-nav__logo-img" />
            <span className="gs-home-nav__logo-text">GoStudy</span>
          </Link>

          <button 
            className="gs-home-nav__hamburger"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`gs-home-nav__links ${isMenuOpen ? 'gs-home-nav__links--open' : ''}`}>
            <a href="#sobre" className="gs-home-nav__link" onClick={() => setIsMenuOpen(false)}>Sobre</a>
            <a href="#funcionalidades" className="gs-home-nav__link" onClick={() => setIsMenuOpen(false)}>Funcionalidades</a>
            <a href="#como-funciona" className="gs-home-nav__link" onClick={() => setIsMenuOpen(false)}>Para alunos</a>
            <a href="#professores" className="gs-home-nav__link" onClick={() => setIsMenuOpen(false)}>Para professores</a>
          </nav>

          <div className="gs-home-nav__actions">
            <Link to="/login" className="gs-home-btn gs-home-btn--ghost">Entrar</Link>
            <Link to="/register" className="gs-home-btn gs-home-btn--primary">Cadastrar</Link>
          </div>
        </div>
      </header>

      <section className="gs-home-hero">
        <div className="gs-home-hero__inner">
          <div className="gs-home-hero__content">
            <div className="gs-home-hero__badge">
              <Sparkles size={16} />
              <span>Plataforma educacional</span>
            </div>
            <h1 className="gs-home-hero__titulo">
              Aprenda de forma<br />
              <span className="gs-home-hero__destaque">organizada e interativa</span>
            </h1>
            <p className="gs-home-hero__sub">
              Conecte-se com professores, organize seus materiais e acompanhe seu progresso 
              em um único ambiente intuitivo e gratuito.
            </p>
            <div className="gs-home-hero__ctas">
              <Link to="/register" className="gs-home-btn gs-home-btn--primary gs-home-btn--lg">
                Começar agora
                <ChevronRight size={18} />
              </Link>
              <Link to="/login" className="gs-home-btn gs-home-btn--outline gs-home-btn--lg">
                Entrar
              </Link>
            </div>
          </div>

          <div className="gs-home-hero__visual">

            <div className="gs-home-hero__logo-container">
              <img 
                src={logoGif} 
                alt="GoStudy" 
                className="gs-home-hero__logo-gif"
              />
            </div>

            <div className="gs-home-float-card gs-home-float-card--main">
              <div className="gs-home-float-card__header">
                <div className="gs-home-float-card__dots">
                  <span className="gs-home-float-card__dot" style={{ background: '#ef4444' }} />
                  <span className="gs-home-float-card__dot" style={{ background: '#f59e0b' }} />
                  <span className="gs-home-float-card__dot" style={{ background: '#22c55e' }} />
                </div>
                <span className="gs-home-float-card__badge">
                  <BookOpen size={12} /> Matemática
                </span>
              </div>
              <div className="gs-home-float-card__body">
                <h4 className="gs-home-float-card__title">Equações do 2º grau</h4>
                <div className="gs-home-float-card__progress">
                  <div className="gs-home-float-card__progress-bar" style={{ width: '75%' }} />
                  <span className="gs-home-float-card__progress-label">75%</span>
                </div>
                <div className="gs-home-float-card__materials">
                  <span><FileText size={14} /> Apostila completa</span>
                  <span><GraduationCap size={14} /> Videoaula</span>
                </div>
              </div>
            </div>

            <div className="gs-home-float-card gs-home-float-card--small">
              <div className="gs-home-float-card__body">
                <span className="gs-home-float-card__badge gs-home-float-card__badge--green">
                  <CircleCheck size={14} /> Respondida
                </span>
                <p className="gs-home-float-card__question">Como resolver equações com frações?</p>
                <span className="gs-home-float-card__professor">
                  <Users size={14} /> Prof. Ana Oliveira
                </span>
              </div>
            </div>

            <div className="gs-home-hero__particles">
              <div className="gs-home-hero__particle" style={{ animationDelay: '0s' }} />
              <div className="gs-home-hero__particle" style={{ animationDelay: '1.5s' }} />
              <div className="gs-home-hero__particle" style={{ animationDelay: '3s' }} />
              <div className="gs-home-hero__particle" style={{ animationDelay: '4.5s' }} />
            </div>

            <div className="gs-home-hero__blob gs-home-hero__blob--1" />
            <div className="gs-home-hero__blob gs-home-hero__blob--2" />
            <div className="gs-home-hero__blob gs-home-hero__blob--3" />
          </div>
        </div>
      </section>

      <section className="gs-home-section" id="sobre" ref={(el) => sections.current[0] = el}>
        <div className="gs-home-section__inner gs-home-about">
          <div className="gs-home-about__content">
            <span className="gs-home-section__tag">Sobre o GoStudy</span>
            <h2 className="gs-home-section__titulo">
              Democratizando o acesso ao<br />
              ensino de qualidade
            </h2>
            <p className="gs-home-about__text">
              O <strong>GoStudy</strong> é uma plataforma desenvolvida por estudantes da 
              <strong> Universidade de Brasília</strong>, através do <strong>Grupo Turing</strong>, 
              durante a disciplina de Métodos de Desenvolvimento de Software.
            </p>
            <p className="gs-home-about__text">
              Nossa missão é democratizar o acesso à educação, conectando alunos e professores 
              em um único ambiente para compartilhamento de conteúdos, materiais e conhecimento.
            </p>
            <div className="gs-home-about__stats">
              <div className="gs-home-about__stat">
                <span className="gs-home-about__stat-value">100%</span>
                <span className="gs-home-about__stat-label">Gratuito</span>
              </div>
              <div className="gs-home-about__stat">
                <span className="gs-home-about__stat-value">∞</span>
                <span className="gs-home-about__stat-label">Conteúdos</span>
              </div>
              <div className="gs-home-about__stat">
                <span className="gs-home-about__stat-value">24/7</span>
                <span className="gs-home-about__stat-label">Disponível</span>
              </div>
            </div>
          </div>
          <div className="gs-home-about__visual">
            <div className="gs-home-about__logos">
              <img src={logo} alt="GoStudy" className="gs-home-about__logo--gostudy" />
              <div className="gs-home-about__logo-divider">
                <span>+</span>
              </div>
              <img src={logoUnb} alt="UnB" className="gs-home-about__logo--unb" />
            </div>
            <div className="gs-home-about__cards">
              <div className="gs-home-about__card">
                <GraduationCap size={32} className="gs-home-about__card-icon" />
                <h4>Missão</h4>
                <p>Transformar a educação através da tecnologia</p>
              </div>
              <div className="gs-home-about__card">
                <Users size={32} className="gs-home-about__card-icon" />
                <h4>Grupo Turing</h4>
                <p>Desenvolvimento colaborativo e inovador</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gs-home-section gs-home-section--alt" id="funcionalidades" ref={(el) => sections.current[1] = el}>
        <div className="gs-home-section__inner">
          <div className="gs-home-section__header">
            <span className="gs-home-section__tag">Funcionalidades</span>
            <h2 className="gs-home-section__titulo">Tudo que você precisa para aprender melhor</h2>
            <p className="gs-home-section__sub">
              Uma plataforma completa para alunos e professores.
            </p>
          </div>
          <div className="gs-home-features">
            {FEATURES.map((f, index) => {
              const Icon = f.icon;
              return (
                <div 
                  key={f.titulo} 
                  className="gs-home-feature" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="gs-home-feature__icon">
                    <Icon size={28} />
                  </div>
                  <h3 className="gs-home-feature__titulo">{f.titulo}</h3>
                  <p className="gs-home-feature__desc">{f.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="gs-home-section" id="como-funciona" ref={(el) => sections.current[2] = el}>
        <div className="gs-home-section__inner">
          <div className="gs-home-section__header">
            <span className="gs-home-section__tag">Para alunos</span>
            <h2 className="gs-home-section__titulo">Comece a estudar em 4 passos</h2>
            <p className="gs-home-section__sub">
              Uma jornada simples e intuitiva para transformar seu aprendizado.
            </p>
          </div>
          <div className="gs-home-timeline">
            <div className="gs-home-timeline__line" />
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              return (
                <div 
                  key={s.numero} 
                  className="gs-home-timeline__step"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="gs-home-timeline__step-number">
                    <span className="gs-home-timeline__step-icon">
                      <Icon size={20} />
                    </span>
                    <span className="gs-home-timeline__step-num">{s.numero}</span>
                  </div>
                  <div className="gs-home-timeline__step-content">
                    <h3 className="gs-home-timeline__step-title">{s.titulo}</h3>
                    <p className="gs-home-timeline__step-desc">{s.descricao}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="gs-home-section gs-home-section--alt" id="professores" ref={(el) => sections.current[3] = el}>
        <div className="gs-home-section__inner gs-home-teacher">
          <div className="gs-home-teacher__header">
            <span className="gs-home-section__tag">Para professores</span>
            <h2 className="gs-home-section__titulo">Compartilhe conhecimento de forma simples</h2>
            <p className="gs-home-section__sub">
              Uma plataforma completa para professores que desejam alcançar mais alunos.
            </p>
          </div>

          <div className="gs-home-teacher__grid">
            <div className="gs-home-teacher__flow">
              {TEACHER_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index} 
                    className="gs-home-teacher__step"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="gs-home-teacher__step-icon">
                      <Icon size={24} />
                    </div>
                    <div className="gs-home-teacher__step-content">
                      <h4>{step.titulo}</h4>
                      <p>{step.descricao}</p>
                    </div>
                    {index < TEACHER_STEPS.length - 1 && (
                      <div className="gs-home-teacher__step-arrow">
                        <ChevronRight size={20} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="gs-home-teacher__visual">
              <div className="gs-home-teacher__card">
                <div className="gs-home-teacher__card-header">
                  <School size={24} />
                  <span>Área do Professor</span>
                </div>
                <div className="gs-home-teacher__card-body">
                  <div className="gs-home-teacher__card-item">
                    <BookOpen size={18} />
                    <span>Criar conteúdos</span>
                  </div>
                  <div className="gs-home-teacher__card-item">
                    <FileText size={18} />
                    <span>Publicar materiais</span>
                  </div>
                  <div className="gs-home-teacher__card-item">
                    <MessageSquare size={18} />
                    <span>Responder dúvidas</span>
                  </div>
                  <div className="gs-home-teacher__card-item">
                    <Eye size={18} />
                    <span>Acompanhar alunos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gs-home-stats" ref={statsRef}>
        <div className="gs-home-stats__inner">
          <div className="gs-home-stat">
            <span className="gs-home-stat__number" data-value="100">0</span>
            <span className="gs-home-stat__label">Alunos ativos</span>
          </div>
          <div className="gs-home-stat">
            <span className="gs-home-stat__number" data-value="50">0</span>
            <span className="gs-home-stat__label">Professores</span>
          </div>
          <div className="gs-home-stat">
            <span className="gs-home-stat__number" data-value="200">0</span>
            <span className="gs-home-stat__label">Conteúdos</span>
          </div>
          <div className="gs-home-stat">
            <span className="gs-home-stat__number" data-value="500">0</span>
            <span className="gs-home-stat__label">Materiais</span>
          </div>
        </div>
      </section>

      <section className="gs-home-cta">
        <div className="gs-home-cta__inner">
          <div className="gs-home-cta__badge">
            <Globe size={16} />
            <span>Junte-se a nossa comunidade</span>
          </div>
          <h2 className="gs-home-cta__titulo">
            Pronto para transformar<br />sua forma de aprender?
          </h2>
          <p className="gs-home-cta__sub">
            Crie sua conta gratuitamente e comece a estudar ou compartilhar conhecimento hoje mesmo.
          </p>
          <Link to="/register" className="gs-home-btn gs-home-btn--white gs-home-btn--lg">
            Começar agora
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="gs-home-footer">
        <div className="gs-home-footer__inner">
          <div className="gs-home-footer__brand">
            <Link to="/" className="gs-home-footer__logo">
              <img src={logo} alt="GoStudy" className="gs-home-footer__logo-img" />
              <span>GoStudy</span>
            </Link>
            <p className="gs-home-footer__desc">
              Transformando a maneira como alunos e professores compartilham conhecimento.
            </p>
            <div className="gs-home-footer__logos">
              <img src={logoUnb} alt="UnB" className="gs-home-footer__logo-unb" />
              <span>Universidade de Brasília</span>
            </div>
          </div>

          <div className="gs-home-footer__links">
            <div className="gs-home-footer__group">
              <h4>Navegação</h4>
              <a href="#sobre">Sobre</a>
              <a href="#funcionalidades">Funcionalidades</a>
              <a href="#como-funciona">Para alunos</a>
              <a href="#professores">Para professores</a>
            </div>
            <div className="gs-home-footer__group">
              <h4>Desenvolvimento</h4>
              <span>Grupo Turing</span>
              <span>MDS - UnB</span>
              <span>Metodologias Ágeis</span>
              <span>React / Django</span>
            </div>
            <div className="gs-home-footer__group">
              <h4>Links úteis</h4>
              <a href="/login">Entrar</a>
              <a href="/register">Cadastrar</a>
              <a href="https://github.com/grupo-turing" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>

        <div className="gs-home-footer__bottom">
          <div className="gs-home-footer__bottom-inner">
            <p className="gs-home-footer__copy">© 2026 GoStudy. Todos os direitos reservados.</p>
            <p className="gs-home-footer__copy">Desenvolvido pelo Grupo Turing - UnB</p>
          </div>
        </div>
      </footer>

    </div>
  );
}