interface Spec {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs: Spec[];
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <h3 className="bg-surface-alt px-5 py-3.5 font-semibold text-sm text-text border-b border-border/40">מפרט בסיסי</h3>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr key={i} className={`border-b border-border/30 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-surface-alt/50'}`}>
              <td className="px-5 py-3 font-medium text-muted w-1/3">{spec.label}</td>
              <td className="px-5 py-3 text-text">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
