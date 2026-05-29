import { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  Trash2, 
  CheckCircle2, 
  RotateCcw,
  Equal,
  Minus,
  Plus as PlusIcon,
  Divide,
  X
} from 'lucide-react';

export default function CommissionCalculator() {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Commission State
  const [amount, setAmount] = useState('');
  const [commissionPct, setCommissionPct] = useState(3);
  const [commissionResult, setCommissionResult] = useState(null);

  // Standard Calculator Logic
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevValue == null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = evaluate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const evaluate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return b;
    }
  };

  const handleEqual = () => {
    const inputValue = parseFloat(display);
    if (!operator || prevValue === null) return;

    const newValue = evaluate(prevValue, inputValue, operator);
    setDisplay(String(newValue));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Commission logic
  const calculateCommission = () => {
    const val = parseFloat(amount);
    if (!isNaN(val)) {
      setCommissionResult((val * commissionPct) / 100);
    }
  };

  const formatCOP = (val) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Calculator className="text-orange-400" size={20} />
            </div>
            <h2 className="text-2xl font-black text-paradise-50 uppercase tracking-tighter">Calculadora Pro</h2>
          </div>
          <p className="text-paradise-400 text-sm">Cálculos rápidos y estimación de comisiones de venta/renta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Basic Calculator */}
        <div className="glass-card rounded-[40px] p-8 border-paradise-800/50 shadow-2xl relative overflow-hidden">
          <h3 className="text-[10px] font-black text-paradise-500 uppercase tracking-widest mb-10">Cálculo Estándar</h3>
          
          <div className="bg-paradise-950/80 rounded-3xl p-8 mb-8 border border-white/5 text-right flex flex-col justify-end min-h-[120px] shadow-inner">
             <div className="text-[10px] text-paradise-500 uppercase tracking-widest font-bold mb-2">Pantalla</div>
             <div className="text-4xl font-bold text-white truncate font-mono tracking-normal pr-2">
               {display}
             </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
             {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+'].map(key => (
               <button 
                 key={key}
                 onClick={() => {
                   if (/[0-9]/.test(key)) inputDigit(parseInt(key));
                   if (key === '.') setDisplay(display.includes('.') ? display : display + '.');
                   if (key === 'C') clear();
                   if (['/','*','-','+'].includes(key)) performOperation(key);
                 }}
                 className={`h-14 rounded-2xl text-lg font-black transition-all active:scale-90 ${
                   ['/','*','-','+'].includes(key) 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20 hover:bg-orange-500'
                    : key === 'C' ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500'
                    : 'bg-paradise-900/60 text-paradise-100 hover:bg-paradise-800'
                 }`}
               >
                 {key}
               </button>
             ))}
             <button 
               onClick={handleEqual}
               className="col-span-4 h-14 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white rounded-2xl text-xl font-black shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
             >
               <Equal size={24} />
             </button>
          </div>
        </div>

        {/* Commission Calculator */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-[40px] p-8 border-accent-500/20 bg-accent-500/5 relative overflow-hidden">
            <h3 className="text-[10px] font-black text-accent-400 uppercase tracking-widest mb-10">Calculadora de Comisiones</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-paradise-500 font-bold uppercase tracking-wider ml-1">Monto de la Transacción (COP)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-500" />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ej: 50.000.000"
                    className="w-full bg-paradise-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-black text-white outline-none focus:border-accent-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] text-paradise-500 font-bold uppercase tracking-wider">Porcentaje %</label>
                  <span className="text-sm font-black text-accent-400">{commissionPct}%</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="0.5" 
                  value={commissionPct} 
                  onChange={(e) => setCommissionPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-paradise-800 rounded-lg appearance-none cursor-pointer accent-accent-500"
                />
                <div className="flex justify-between text-[8px] text-paradise-600 font-bold uppercase tracking-tighter pt-1 px-1">
                  <span>1%</span>
                  <span>3% (Stand.)</span>
                  <span>5%</span>
                  <span>10%</span>
                </div>
              </div>

              <button 
                onClick={calculateCommission}
                className="w-full py-5 bg-accent-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                Calcular Comisión
              </button>
            </div>
          </div>

          {commissionResult !== null && (
            <div className="animate-in slide-in-from-bottom-5 duration-700 glass-card rounded-[40px] p-8 border-emerald-500/20 bg-emerald-500/10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-md transform rotate-6 hover:rotate-0 transition-transform">
                <CheckCircle2 className="text-white" size={32} />
              </div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Comisión Estimada</p>
              <h4 className="text-4xl font-black text-white tracking-tighter mb-4">{formatCOP(commissionResult)}</h4>
              <div className="px-5 py-2 bg-white/5 rounded-2xl text-[10px] text-paradise-400 border border-white/5 font-bold uppercase tracking-widest">
                {amount ? formatCOP(amount) : '---'} x {commissionPct}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
