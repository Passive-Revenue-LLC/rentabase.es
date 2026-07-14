import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const OPCIONES_MESES = [3, 6, 12] as const;

export default function FondoEmergencia() {
  const [gastosFijos, setGastosFijos] = useState(800);
  const [gastosVariables, setGastosVariables] = useState(400);
  const [meses, setMeses] = useState<(typeof OPCIONES_MESES)[number]>(6);

  const interactedRef = useRef(false);
  const completedRef = useRef(false);

  const trackInteraction = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      window.gtag?.('event', 'calculator_interaction', { calculator_name: 'fondo_emergencia' });
    }
  }, []);

  const { gastoMensualTotal, objetivo } = useMemo(() => {
    const fijos = Math.max(0, gastosFijos);
    const variables = Math.max(0, gastosVariables);
    const gastoMensualTotal = fijos + variables;
    const objetivo = gastoMensualTotal * meses;

    return { gastoMensualTotal, objetivo };
  }, [gastosFijos, gastosVariables, meses]);

  useEffect(() => {
    if (interactedRef.current && !completedRef.current) {
      completedRef.current = true;
      window.gtag?.('event', 'calculator_completed', { calculator_name: 'fondo_emergencia' });
    }
  }, [objetivo]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-texto/70 mb-1">
            Gastos fijos mensuales (€)
          </label>
          <p className="text-xs text-texto/50 mb-1.5">
            Alquiler/hipoteca, suministros, seguros, etc.
          </p>
          <input
            type="number"
            min={0}
            max={100000}
            value={gastosFijos}
            onChange={(e) => { trackInteraction(); setGastosFijos(Math.max(0, Number(e.target.value))); }}
            className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-texto/70 mb-1">
            Gastos variables mensuales (€)
          </label>
          <p className="text-xs text-texto/50 mb-1.5">
            Alimentación, transporte, ocio, etc.
          </p>
          <input
            type="number"
            min={0}
            max={100000}
            value={gastosVariables}
            onChange={(e) => { trackInteraction(); setGastosVariables(Math.max(0, Number(e.target.value))); }}
            className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-texto/70 mb-1">
            Meses de cobertura deseados
          </label>
          <select
            value={meses}
            onChange={(e) => {
              trackInteraction();
              setMeses(Number(e.target.value) as (typeof OPCIONES_MESES)[number]);
            }}
            className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
          >
            {OPCIONES_MESES.map((m) => (
              <option key={m} value={m}>
                {m} meses
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-lg bg-fondo p-4">
            <p className="text-sm text-texto/60">Gasto mensual total</p>
            <p className="text-xl font-bold text-texto">{fmt(gastoMensualTotal)} €</p>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700/70">Objetivo del fondo de emergencia</p>
            <p className="text-2xl font-bold text-green-700">{fmt(objetivo)} €</p>
            <p className="text-sm text-green-700/70 mt-1">
              {meses} meses × {fmt(gastoMensualTotal)} €/mes = {fmt(objetivo)} €
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-fondo p-4 text-sm text-texto/70">
          ¿Dónde guardar este dinero? Una{' '}
          <a
            href="/blog/cuentas-remuneradas-depositos-mejores-opciones/"
            className="text-verde hover:underline font-medium"
          >
            cuenta remunerada
          </a>{' '}
          te permite tenerlo accesible y ganar algo mientras tanto.
        </div>
      </div>
    </div>
  );
}
