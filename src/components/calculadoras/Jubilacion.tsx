import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const REGLA_4_POR_CIENTO = 0.04;

export default function Jubilacion() {
  const [edadActual, setEdadActual] = useState(30);
  const [edadJubilacion, setEdadJubilacion] = useState(67);
  const [ahorroActual, setAhorroActual] = useState(10000);
  const [aportacionMensual, setAportacionMensual] = useState(300);
  const [rentabilidad, setRentabilidad] = useState(7);
  const [gastoDeseado, setGastoDeseado] = useState(2000);

  const interactedRef = useRef(false);
  const completedRef = useRef(false);

  const trackInteraction = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      window.gtag?.('event', 'calculator_interaction', { calculator_name: 'jubilacion' });
    }
  }, []);

  const resultado = useMemo(() => {
    const edad = clamp(edadActual, 16, 90);
    const edadJub = clamp(edadJubilacion, edad, 90);
    const ahorro = Math.max(0, ahorroActual);
    const aportacion = Math.max(0, aportacionMensual);
    const rAnual = clamp(rentabilidad, 0, 100) / 100;
    const gasto = Math.max(0, gastoDeseado);

    const anos = edadJub - edad;
    const meses = anos * 12;
    // Capitalización mensual equivalente a la rentabilidad anual: (1+r)^12 = 1+rAnual
    const r = Math.pow(1 + rAnual, 1 / 12) - 1;
    const factor = meses > 0 ? Math.pow(1 + r, meses) : 1;

    const patrimonio =
      meses <= 0
        ? ahorro
        : r === 0
          ? ahorro + aportacion * meses
          : ahorro * factor + aportacion * ((factor - 1) / r);

    const rentaAnualSostenible = patrimonio * REGLA_4_POR_CIENTO;
    const rentaMensualSostenible = rentaAnualSostenible / 12;
    const cubreObjetivo = rentaMensualSostenible >= gasto;
    const faltante = Math.max(0, gasto - rentaMensualSostenible);

    // Aportación mensual necesaria para que el patrimonio proyectado sostenga
    // el gasto deseado (regla del 4%): patrimonio objetivo = gasto anual / 4%.
    let aportacionNecesaria: number | null = null;
    if (!cubreObjetivo && meses > 0) {
      const patrimonioObjetivo = (gasto * 12) / REGLA_4_POR_CIENTO;
      const necesaria =
        r === 0
          ? (patrimonioObjetivo - ahorro) / meses
          : (patrimonioObjetivo - ahorro * factor) / ((factor - 1) / r);
      aportacionNecesaria = Math.max(aportacion, necesaria);
    }

    return {
      anos,
      patrimonio,
      rentaMensualSostenible,
      cubreObjetivo,
      faltante,
      aportacionNecesaria,
      edadInvalida: anos <= 0,
    };
  }, [edadActual, edadJubilacion, ahorroActual, aportacionMensual, rentabilidad, gastoDeseado]);

  useEffect(() => {
    if (interactedRef.current && !completedRef.current) {
      completedRef.current = true;
      window.gtag?.('event', 'calculator_completed', { calculator_name: 'jubilacion' });
    }
  }, [resultado.patrimonio]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-texto/70 mb-1">
                Edad actual
              </label>
              <input
                type="number"
                min={16}
                max={90}
                value={edadActual}
                onChange={(e) => { trackInteraction(); setEdadActual(Number(e.target.value)); }}
                className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-texto/70 mb-1">
                Edad de jubilación
              </label>
              <input
                type="number"
                min={16}
                max={90}
                value={edadJubilacion}
                onChange={(e) => { trackInteraction(); setEdadJubilacion(Number(e.target.value)); }}
                className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Ahorro/inversión actual (€)
            </label>
            <input
              type="number"
              min={0}
              max={10000000}
              value={ahorroActual}
              onChange={(e) => { trackInteraction(); setAhorroActual(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Aportación mensual (€)
            </label>
            <input
              type="number"
              min={0}
              max={100000}
              value={aportacionMensual}
              onChange={(e) => { trackInteraction(); setAportacionMensual(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Rentabilidad anual estimada (%)
            </label>
            <p className="text-xs text-texto/50 mb-1.5">
              Referencia: MSCI World histórico ≈ 7 %.
            </p>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={rentabilidad}
              onChange={(e) => {
                trackInteraction();
                setRentabilidad(clamp(Number(e.target.value), 0, 100));
              }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Gasto mensual deseado en la jubilación (€, en euros de hoy)
            </label>
            <input
              type="number"
              min={0}
              max={100000}
              value={gastoDeseado}
              onChange={(e) => { trackInteraction(); setGastoDeseado(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
        </div>

        <div className="space-y-3">
          {resultado.edadInvalida ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              La edad de jubilación debe ser posterior a tu edad actual.
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-fondo p-4">
                <p className="text-sm text-texto/60">
                  Patrimonio proyectado a los {edadJubilacion} años
                </p>
                <p className="text-2xl font-bold text-texto">{fmt(resultado.patrimonio)} €</p>
              </div>

              <div
                className={`rounded-lg p-4 border ${
                  resultado.cubreObjetivo
                    ? 'bg-green-50 border-green-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    resultado.cubreObjetivo ? 'text-green-700/70' : 'text-amber-700/70'
                  }`}
                >
                  Renta mensual sostenible (regla del 4 %)
                </p>
                <p
                  className={`text-2xl font-bold ${
                    resultado.cubreObjetivo ? 'text-green-700' : 'text-amber-700'
                  }`}
                >
                  {fmt(resultado.rentaMensualSostenible)} €
                </p>
              </div>

              {!resultado.cubreObjetivo && resultado.aportacionNecesaria !== null && (
                <div className="rounded-lg border border-texto/10 p-4 text-sm text-texto/70">
                  Con tu plan actual, te faltarían{' '}
                  <span className="font-semibold text-texto">{fmt(resultado.faltante)} €/mes</span>{' '}
                  para cubrir el gasto deseado. Aumentando tu aportación a{' '}
                  <span className="font-semibold text-texto">
                    {fmt(resultado.aportacionNecesaria)} €/mes
                  </span>{' '}
                  lo cubrirías.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Aviso:</strong> La regla del 4 % es una heurística de planificación, no una
        garantía. La rentabilidad pasada no garantiza rentabilidad futura.
      </div>
    </div>
  );
}
