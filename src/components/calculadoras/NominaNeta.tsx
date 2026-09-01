import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Cifras oficiales 2026 (orden PJC/297/2026) */
const BASE_MAXIMA_SS_ANUAL = 61214.4; // 5.101,20 €/mes × 12
const TIPO_SS_TRABAJADOR = 0.065; // 4,70 % CC + 1,55 % desempleo + 0,10 % FP + 0,15 % MEI
const MINIMO_PERSONAL = 5550;
/** Mínimo por descendientes, importe adicional por cada hijo (1º, 2º, 3º, 4º y siguientes) */
const MINIMOS_DESCENDIENTES = [2400, 2700, 4000, 4500];

const TRAMOS_IRPF = [
  { limite: 12450, tipo: 0.19 },
  { limite: 20200, tipo: 0.24 },
  { limite: 35200, tipo: 0.3 },
  { limite: 60000, tipo: 0.37 },
  { limite: 300000, tipo: 0.45 },
  { limite: Infinity, tipo: 0.47 },
];

function calcularCuotaIRPF(baseImponible: number) {
  let pendiente = baseImponible;
  let acumulado = 0;
  let cuota = 0;
  for (const tramo of TRAMOS_IRPF) {
    if (pendiente <= 0) break;
    const baseTramo = Math.min(pendiente, tramo.limite - acumulado);
    if (baseTramo > 0) {
      cuota += baseTramo * tramo.tipo;
      pendiente -= baseTramo;
      acumulado += baseTramo;
    }
  }
  return cuota;
}

function minimoDescendientes(hijos: number) {
  const n = clamp(hijos, 0, MINIMOS_DESCENDIENTES.length);
  let total = 0;
  for (let i = 0; i < n; i++) total += MINIMOS_DESCENDIENTES[i];
  return total;
}

const OPCIONES_PAGAS = [12, 14] as const;
const OPCIONES_HIJOS = [0, 1, 2, 3, 4] as const;

export default function NominaNeta() {
  const [salarioBruto, setSalarioBruto] = useState(30000);
  const [pagas, setPagas] = useState<(typeof OPCIONES_PAGAS)[number]>(14);
  const [hijos, setHijos] = useState<(typeof OPCIONES_HIJOS)[number]>(0);

  const interactedRef = useRef(false);
  const completedRef = useRef(false);

  const trackInteraction = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      window.gtag?.('event', 'calculator_interaction', { calculator_name: 'nomina_neta' });
    }
  }, []);

  const resultado = useMemo(() => {
    const bruto = Math.max(0, salarioBruto);
    const baseCotizacion = Math.min(bruto, BASE_MAXIMA_SS_ANUAL);
    const cotizacionSS = baseCotizacion * TIPO_SS_TRABAJADOR;
    const minDescendientes = minimoDescendientes(hijos);
    const baseImponible = Math.max(
      0,
      bruto - cotizacionSS - MINIMO_PERSONAL - minDescendientes
    );
    const cuotaIRPF = calcularCuotaIRPF(baseImponible);
    const netoAnual = bruto - cotizacionSS - cuotaIRPF;
    const netoPorPaga = netoAnual / pagas;

    return {
      bruto,
      cotizacionSS,
      baseImponible,
      cuotaIRPF,
      netoAnual,
      netoPorPaga,
      tipoEfectivoSS: bruto > 0 ? (cotizacionSS / bruto) * 100 : 0,
      tipoEfectivoIRPF: bruto > 0 ? (cuotaIRPF / bruto) * 100 : 0,
    };
  }, [salarioBruto, pagas, hijos]);

  useEffect(() => {
    if (interactedRef.current && !completedRef.current) {
      completedRef.current = true;
      window.gtag?.('event', 'calculator_completed', { calculator_name: 'nomina_neta' });
    }
  }, [resultado.netoAnual]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Salario bruto anual (€)
            </label>
            <input
              type="number"
              min={0}
              max={1000000}
              value={salarioBruto}
              onChange={(e) => { trackInteraction(); setSalarioBruto(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-texto/70 mb-1">
                Número de pagas
              </label>
              <select
                value={pagas}
                onChange={(e) => {
                  trackInteraction();
                  setPagas(Number(e.target.value) as (typeof OPCIONES_PAGAS)[number]);
                }}
                className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
              >
                {OPCIONES_PAGAS.map((p) => (
                  <option key={p} value={p}>
                    {p} pagas
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-texto/70 mb-1">
                Hijos a cargo
              </label>
              <select
                value={hijos}
                onChange={(e) => {
                  trackInteraction();
                  setHijos(Number(e.target.value) as (typeof OPCIONES_HIJOS)[number]);
                }}
                className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
              >
                {OPCIONES_HIJOS.map((h) => (
                  <option key={h} value={h}>
                    {h === 4 ? '4 o más' : h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700/70">Salario neto por paga</p>
            <p className="text-2xl font-bold text-green-700">{fmt(resultado.netoPorPaga)} €</p>
          </div>
          <div className="rounded-lg bg-fondo p-4">
            <p className="text-sm text-texto/60">Salario neto anual</p>
            <p className="text-xl font-bold text-texto">{fmt(resultado.netoAnual)} €</p>
          </div>

          <div className="rounded-lg border border-texto/10 p-4 space-y-2">
            <p className="text-sm font-semibold text-texto">Desglose</p>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Cotización Seguridad Social</span>
              <span className="font-medium text-texto">
                {fmt(resultado.cotizacionSS)} € ({resultado.tipoEfectivoSS.toFixed(2)} %)
              </span>
            </div>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Retención IRPF</span>
              <span className="font-medium text-texto">
                {fmt(resultado.cuotaIRPF)} € ({resultado.tipoEfectivoIRPF.toFixed(2)} %)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Aviso:</strong> Esta es una estimación orientativa basada en la escala estatal
        combinada de referencia. Tu comunidad autónoma tiene su propio tramo autonómico que puede
        variar el resultado real. No sustituye el cálculo oficial de tu nómina ni una consulta con
        un gestor.
      </div>
    </div>
  );
}
