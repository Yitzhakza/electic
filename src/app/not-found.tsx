import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">הדף לא נמצא</h2>
      <p className="text-muted mb-8">
        מצטערים, הדף שחיפשתם לא קיים. ייתכן שהוא הוסר או שהכתובת שגויה.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
      >
        חזרה לדף הראשי
      </Link>
    </div>
  );
}
