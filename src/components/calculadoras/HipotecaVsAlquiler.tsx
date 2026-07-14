import { useState, useMemo, useRef, useEffect, useCallback } from 'react';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const OPCIONES_PLAZO = [15, 20, 25, 30] as const;

export default function HipotecaVsAlquiler() {
  const [precioVivienda, setPrecioVivienda] = useState(300000);
  const [entrada, setEntrada] = useState(60000);
  const [tipoInteres, setTipoInteres] = useState(3.5);
  const [plazoAnos, setPlazoAnos] = useState<(typeof OPCIONES_PLAZO)[number]>(30);
  const [alquilerMensual, setAlquilerMensual] = useState(1000);
  const [rentabilidadInversion, setRentabilidadInversion] = useState(7);

  const interactedRef = useRef(false);
  const completedRef = useRef(false);

  const trackInteraction = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      window.gtag?.('event', 'calculator_interaction', { calculator_name: 'hipoteca_vs_alquiler' });
    }
  }, []);

  const resultado = useMemo(() => {
    const precio = Math.max(0, precioVivienda);
    const ent = clamp(entrada, 0, precio);
    const tipo = clamp(tipoInteres, 0, 20) / 100;
    const plazo = plazoAnos;
    const alquiler = Math.max(0, alquilerMensual);
    const rentabilidad = clamp(rentabilidadInversion, 0, 100) / 100;

    const principal = precio - ent;
    const r = tipo / 12;
    const n = plazo * 12;

    const cuotaMensual =
      r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const costeTotalCompra = cuotaMensual * n + ent;
    const costeTotalAlquiler = alquiler * n;
    const valorEntradaInvertida = ent * Math.pow(1 + rentabilidad, plazo);

    // Con revalorización 0%, al final del plazo la hipoteca está amortizada
    // y el equity coincide con el precio de compra de la vivienda.
    const equityComprando = precio;
    const patrimonioComprando = equityComprando;
    const patrimonioAlquilando = valorEntradaInvertida;

    const ganaComprar = patrimonioComprando >= patrimonioAlquilando;
    const diferencia = Math.abs(patrimonioComprando - patrimonioAlquilando);

    return {
      cuotaMensual,
      costeTotalCompra,
      costeTotalAlquiler,
      valorEntradaInvertida,
      equityComprando,
      patrimonioComprando,
      patrimonioAlquilando,
      ganaComprar,
      diferencia,
      entradaPct: precio > 0 ? (ent / precio) * 100 : 0,
      plazo,
    };
  }, [precioVivienda, entrada, tipoInteres, plazoAnos, alquilerMensual, rentabilidadInversion]);

  useEffect(() => {
    if (interactedRef.current && !completedRef.current) {
      completedRef.current = true;
      window.gtag?.('event', 'calculator_completed', { calculator_name: 'hipoteca_vs_alquiler' });
    }
  }, [resultado.cuotaMensual]);

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Precio de la vivienda (€)
            </label>
            <input
              type="number"
              min={0}
              max={10000000}
              value={precioVivienda}
              onChange={(e) => { trackInteraction(); setPrecioVivienda(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Entrada disponible (€)
            </label>
            <input
              type="number"
              min={0}
              max={precioVivienda}
              value={entrada}
              onChange={(e) => { trackInteraction(); setEntrada(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
            <p className="text-xs text-texto/50 mt-1">
              {resultado.entradaPct.toFixed(1)} % del precio de la vivienda
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-texto/70 mb-1">
                Tipo de interés (%)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.05}
                value={tipoInteres}
                onChange={(e) => {
                  trackInteraction();
                  setTipoInteres(clamp(Number(e.target.value), 0, 20));
                }}
                className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-texto/70 mb-1">
                Plazo (años)
              </label>
              <select
                value={plazoAnos}
                onChange={(e) => {
                  trackInteraction();
                  setPlazoAnos(Number(e.target.value) as (typeof OPCIONES_PLAZO)[number]);
                }}
                className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
              >
                {OPCIONES_PLAZO.map((p) => (
                  <option key={p} value={p}>
                    {p} años
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Alquiler mensual equivalente (€)
            </label>
            <p className="text-xs text-texto/50 mb-1.5">
              Lo que pagarías de alquiler por una vivienda similar.
            </p>
            <input
              type="number"
              min={0}
              max={100000}
              value={alquilerMensual}
              onChange={(e) => { trackInteraction(); setAlquilerMensual(Math.max(0, Number(e.target.value))); }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texto/70 mb-1">
              Rentabilidad anual estimada si inviertes la entrada (%)
            </label>
            <p className="text-xs text-texto/50 mb-1.5">
              Referencia: MSCI World histórico ≈ 7 %.
            </p>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={rentabilidadInversion}
              onChange={(e) => {
                trackInteraction();
                setRentabilidadInversion(clamp(Number(e.target.value), 0, 100));
              }}
              className="w-full rounded-lg border border-texto/10 bg-white px-4 py-2.5 text-texto focus:border-verde focus:ring-1 focus:ring-verde outline-none transition"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-fondo p-4">
            <p className="text-sm text-texto/60">Cuota hipotecaria mensual estimada</p>
            <p className="text-2xl font-bold text-texto">{fmt(resultado.cuotaMensual)} €</p>
          </div>

          <div className="rounded-lg border border-texto/10 p-4 space-y-2">
            <p className="text-sm font-semibold text-texto">
              Comprando, al cabo de {resultado.plazo} años
            </p>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Coste total pagado</span>
              <span className="font-medium text-texto">{fmt(resultado.costeTotalCompra)} €</span>
            </div>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Equity acumulado (0 % revalorización)</span>
              <span className="font-medium text-texto">{fmt(resultado.equityComprando)} €</span>
            </div>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Patrimonio neto</span>
              <span className="font-medium text-texto">{fmt(resultado.patrimonioComprando)} €</span>
            </div>
          </div>

          <div className="rounded-lg border border-texto/10 p-4 space-y-2">
            <p className="text-sm font-semibold text-texto">
              Alquilando, al cabo de {resultado.plazo} años
            </p>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Coste total pagado en alquiler</span>
              <span className="font-medium text-texto">{fmt(resultado.costeTotalAlquiler)} €</span>
            </div>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Valor de la entrada invertida</span>
              <span className="font-medium text-texto">{fmt(resultado.valorEntradaInvertida)} €</span>
            </div>
            <div className="flex justify-between text-sm text-texto/70">
              <span>Patrimonio neto</span>
              <span className="font-medium text-texto">{fmt(resultado.patrimonioAlquilando)} €</span>
            </div>
          </div>

          <div
            className={`rounded-lg p-4 border ${
              resultado.ganaComprar
                ? 'bg-green-50 border-green-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <p
              className={`text-sm ${
                resultado.ganaComprar ? 'text-green-700/70' : 'text-amber-700/70'
              }`}
            >
              {resultado.ganaComprar
                ? 'Comprar genera más patrimonio neto en este plazo'
                : 'Alquilar e invertir la entrada genera más patrimonio neto en este plazo'}
            </p>
            <p
              className={`text-2xl font-bold ${
                resultado.ganaComprar ? 'text-green-700' : 'text-amber-700'
              }`}
            >
              {fmt(resultado.diferencia)} € de diferencia
            </p>
            <p
              className={`text-xs mt-1 ${
                resultado.ganaComprar ? 'text-green-700/70' : 'text-amber-700/70'
              }`}
            >
              No incluye gastos de compraventa ni revalorización de la vivienda.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Nota:</strong> Esta calculadora es orientativa. No incluye gastos de
        compraventa (notaría, impuestos, registro), derramas ni posibles cambios en el
        mercado inmobiliario. Consulta con un profesional antes de tomar una decisión.
      </div>
    </div>
  );
}
