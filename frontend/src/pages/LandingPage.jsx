import { CloudArrowUpIcon, CheckCircleIcon, ArrowsRightLeftIcon, CodeBracketIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const cards = [
    {
      title: "Data Ingestion",
      description: "Automate data ingestion from multiple sources seamlessly into your data lake or warehouse.",
      icon: <CloudArrowUpIcon className="h-12 w-12 text-blue-600" />,
    },
    {
      title: "Data Quality",
      description: "Ensure your data is accurate, complete, and consistent with advanced validation checks.",
      icon: <CheckCircleIcon className="h-12 w-12 text-green-600" />,
    },
    {
      title: "Data Transformation",
      description: "Transform raw data into analytics-ready formats with automated pipelines.",
      icon: <ArrowsRightLeftIcon className="h-12 w-12 text-purple-600" />,
    },
    {
      title: "LLM Generated Code",
      description: "Automatically generate production-ready code using AI-powered language models for various tasks.",
      icon: <CodeBracketIcon className="h-12 w-12 text-indigo-600" />,
    },
    {
      title: "PDF Report Generation",
      description: "Create comprehensive PDF reports from your data pipelines and analytics with a single click.",
      icon: <DocumentTextIcon className="h-12 w-12 text-red-600" />,
    },
    {
      title: "Github Integration",
      description: "Connect your projects to GitHub for automatic commits, version control, and collaborative workflows.",
      icon: <DocumentTextIcon className="h-12 w-12 text-red-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
        IDEA 2.0 Agentic AI Ingestion
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition">
            <div className="mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
