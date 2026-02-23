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
    <div className="rounded-xl border border-border overflow-hidden">
      <h3 className="bg-gray-50 px-4 py-3 font-medium text-sm">מפרט בסיסי</h3>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <td className="px-4 py-2.5 font-medium text-muted w-1/3">{spec.label}</td>
              <td className="px-4 py-2.5">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
