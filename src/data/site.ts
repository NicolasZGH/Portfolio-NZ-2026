// Central content source (Spanish). Single place to edit copy.

export const site = {
  name: 'Nicolás Zorrilla',
  role: 'Diseñador gráfico · UI/UX · Front-end',
  tagline: 'Diseñador gráfico, UI/UX Designer y Desarrollador Front-end',
  location: 'Argentina',
  year: 2026,
  url: 'https://dgonzalez211.github.io/Portfolio-NZ',
  description:
    'Portafolio de Nicolás Zorrilla, diseñador gráfico y desarrollador front-end. Logotipos, identidad de marca y proyectos web responsive.',
  email: 'nicolas.zorrilla.439@gmail.com',
  phone: '+54 9 123 456-7890',
  phoneHref: 'tel:+5491234567890',
  github: 'https://github.com/NicolasZGH',
  githubLabel: 'github.com/NicolasZGH',
} as const;

export const nav = [
  { index: '01', label: 'Inicio', href: '#inicio' },
  { index: '02', label: 'Logotipos', href: '#logos' },
  { index: '03', label: 'Proyectos', href: '#proyectos' },
  { index: '04', label: 'Contacto', href: '#contacto' },
] as const;

export const stats = [
  { value: '20+', label: 'Logotipos' },
  { value: '4+', label: 'Proyectos' },
  { value: '100%', label: 'Responsive' },
  { value: '5+', label: 'Tecnologías' },
] as const;

export type Logo = {
  slug: string;
  title: string;
  index: string;
  tags: string[];
  gradient: string; // css gradient for tag chips
};

// Order matches ID / 01..08 in the original.
export const logos: Logo[] = [
  { slug: 'gabinete', title: 'Gabinete Astral', index: 'ID / 01', tags: ['Monograma', 'Precisión', 'Corporativo', 'Abstracción'], gradient: 'linear-gradient(135deg,#586493,#7380b3)' },
  { slug: 'naturalistic', title: 'NaturalisticPhotos', index: 'ID / 02', tags: ['Biomórfico', 'Fusión', 'Natural', 'Fluidez'], gradient: 'linear-gradient(135deg,#2f9e44,#4cb95e)' },
  { slug: 'chm', title: 'CHM Producciones', index: 'ID / 03', tags: ['Auditivo', 'Rítmico', 'Contemporáneo', 'Integrado'], gradient: 'linear-gradient(135deg,#00a2d3,#12c6f3)' },
  { slug: 'fatal', title: 'Fatal Blow', index: 'ID / 04', tags: ['Bio-urbano', 'Experimental', 'Resiliencia', 'Transgresor'], gradient: 'linear-gradient(135deg,#9e3f2e,#d63b3b)' },
  { slug: 'nz', title: 'NZ', index: 'ID / 05', tags: ['Marca Personal', 'Esencial', 'Versátil', 'Estructurado'], gradient: 'linear-gradient(135deg,#6e56cf,#9683e8)' },
  { slug: 'reddish', title: 'Reddish', index: 'ID / 06', tags: ['Intenso', 'Rebelde', 'Dramático', 'Juguetón'], gradient: 'linear-gradient(135deg,#d6336c,#ff5c8a)' },
  { slug: 'ondipuri', title: 'OndiPuri', index: 'ID / 07', tags: ['Alegre', 'Tierno', 'Creativo', 'Divertido'], gradient: 'linear-gradient(135deg,#da0a94,#4fd1e8)' },
  { slug: 'crackheadkatz', title: 'CrackheadKatz', index: 'ID / 08', tags: ['Urbano', 'Rebelde', 'Gamer', 'Llamativo'], gradient: 'linear-gradient(135deg,#37c92a,#13e80c)' },
];

export type Project = {
  number: string;
  title: string;
  description: string;
  tech: string[];
  href: string;
};

export const projects: Project[] = [
  {
    number: '01',
    title: 'Página para Rotisería 🍔',
    description:
      'Plataforma de administración de rotisería: lista y sistema de pedidos, ganancias categorizadas y panel de productos y clientes. Diseño responsivo y experiencia optimizada.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://nicolaszgh.github.io/BuitreDelivery-Preview/',
  },
  {
    number: '02',
    title: 'Portfolio de Dibujos 🖌️',
    description:
      'Galería interactiva para mostrar dibujos digitales, con filtros por categoría y animaciones suaves. Optimizada para imágenes de alta calidad.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://nicolaszgh.github.io/Smufful-Web/',
  },
  {
    number: '03',
    title: 'Marca de café ☕',
    description:
      'Landing para una cafetería que presenta sus servicios e información a los usuarios de forma clara y directa.',
    tech: ['HTML5', 'CSS3', 'Responsive'],
    href: 'https://nicolaszgh.github.io/HTML5-CSS5-Page/',
  },
  {
    number: '04',
    title: 'Marca de mates 🧉',
    description:
      'Sitio para una empresa de mates que muestra sus servicios, productos e información con una experiencia cuidada.',
    tech: ['HTML5', 'CSS3', 'Responsive', 'JavaScript', 'Bootstrap'],
    href: 'https://nicolaszgh.github.io/Boostrap-page/',
  },
];
