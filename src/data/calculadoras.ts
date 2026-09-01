export interface Calculadora {
  id: string;
  /** Nombre corto: breadcrumb, tarjetas, navegación */
  label: string;
  /** Título largo: H1 y <title> de la página individual */
  pageTitle: string;
  /** Descripción: tarjeta de /calculadoras y meta description */
  description: string;
  relatedUrl: string;
  relatedLabel: string;
  /** Path SVG (viewBox 24x24) para el icono de la tarjeta */
  icon: string;
  /** Fecha de la última actualización de la calculadora (ISO, YYYY-MM-DD) */
  updatedDate: string;
}

export const calculadoras: Calculadora[] = [
  {
    id: 'interes-compuesto',
    label: 'Interés compuesto',
    pageTitle: 'Calculadora de interés compuesto',
    description: 'Descubre cuánto puede crecer tu inversión a lo largo del tiempo.',
    relatedUrl: '/blog/como-empezar-a-invertir-desde-cero/',
    relatedLabel: 'Cómo empezar a invertir desde cero',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    updatedDate: '2026-09-01',
  },
  {
    id: 'fondo-emergencia',
    label: 'Fondo de emergencia',
    pageTitle: 'Calculadora de fondo de emergencia',
    description: 'Calcula cuánto deberías tener ahorrado antes de empezar a invertir.',
    relatedUrl: '/blog/fondo-de-emergencia-cuanto-necesitas/',
    relatedLabel: 'Fondo de emergencia: cuánto necesitas realmente',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    updatedDate: '2026-09-01',
  },
  {
    id: 'irpf',
    label: 'IRPF sobre ganancias',
    pageTitle: 'Calculadora de IRPF sobre ganancias',
    description: 'Calcula cuánto pagarás a Hacienda por la venta de tus inversiones.',
    relatedUrl: '/blog/como-declarar-etfs-renta-espana/',
    relatedLabel: 'Cómo declarar ETFs en la renta',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    updatedDate: '2026-09-01',
  },
  {
    id: 'hipoteca-vs-alquiler',
    label: 'Hipoteca vs alquiler',
    pageTitle: 'Calculadora de hipoteca vs alquiler',
    description: 'Compara el patrimonio neto que generan comprar o alquilar a largo plazo.',
    relatedUrl: '/blog/ahorrar-entrada-piso-espana/',
    relatedLabel: 'Cómo ahorrar la entrada de un piso en España',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    updatedDate: '2026-09-01',
  },
  {
    id: 'fondo-vs-etf',
    label: 'Fondo indexado vs ETF',
    pageTitle: 'Comparador: fondo indexado vs ETF',
    description: 'Compara el resultado final teniendo en cuenta TER y comisiones.',
    relatedUrl: '/blog/fondos-indexados-vs-etfs-diferencias/',
    relatedLabel: 'Diferencias entre fondos indexados y ETFs',
    icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
    updatedDate: '2026-09-01',
  },
  {
    id: 'nomina-neta',
    label: 'Nómina neta',
    pageTitle: 'Calculadora de nómina neta',
    description: 'Calcula tu salario neto real a partir del bruto, con SS e IRPF.',
    relatedUrl: '/blog/declaracion-renta-2025-inversiones/',
    relatedLabel: 'Si tienes inversiones, aquí tienes cómo declararlas en la Renta',
    icon: 'M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z',
    updatedDate: '2026-09-01',
  },
  {
    id: 'jubilacion',
    label: 'Jubilación',
    pageTitle: 'Calculadora de jubilación',
    description: 'Proyecta tu patrimonio y la renta mensual que podrías sostener al jubilarte.',
    relatedUrl: '/blog/planificar-jubilacion-espana/',
    relatedLabel: 'Guía completa para planificar tu jubilación en España',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    updatedDate: '2026-09-01',
  },
];
