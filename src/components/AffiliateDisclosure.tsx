import Link from 'next/link';

interface AffiliateDisclosureProps {
  variant?: 'inline' | 'banner';
}

export default function AffiliateDisclosure({ variant = 'inline' }: AffiliateDisclosureProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-blue-50 border border-blue-200/50 rounded-lg px-4 py-2.5 text-xs text-blue-700">
        <strong>גילוי נאות:</strong> אתר זה מכיל קישורי אפילייט. רכישה דרך הקישורים שלנו תומכת באתר ללא עלות נוספת מצדכם.{' '}
        <Link href="/disclosure" className="underline">פרטים נוספים</Link>
      </div>
    );
  }
  return (
    <p className="text-xs text-muted">
      * קישור אפילייט.{' '}
      <Link href="/disclosure" className="underline hover:text-primary">גילוי נאות</Link>
    </p>
  );
}
