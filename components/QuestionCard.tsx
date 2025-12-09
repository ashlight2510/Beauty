'use client';

interface QuestionCardProps {
  question: string;
  choices: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export default function QuestionCard({
  question,
  choices,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
        {question}
      </h2>
      <div className="space-y-3">
        {choices.map((choice, index) => {
          const isSelected = selectedValue === choice;
          return (
            <button
              key={index}
              onClick={() => onSelect(choice)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-pink-50 hover:shadow-md'
              }`}
            >
              <span className="font-medium">{choice}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

