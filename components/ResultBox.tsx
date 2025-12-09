'use client';

interface ResultBoxProps {
  title: string;
  value: string | number;
  description?: string;
  color?: string;
}

export default function ResultBox({
  title,
  value,
  description,
  color = 'text-gray-800',
}: ResultBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-up">
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

