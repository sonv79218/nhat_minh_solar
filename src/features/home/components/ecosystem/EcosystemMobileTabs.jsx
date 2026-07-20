// ============================================
// ECOSYSTEM MOBILE TABS - TAILWIND CSS
// ============================================
import { useState } from "react";
import { Link } from "react-router-dom";

const EcosystemMobileTabs = ({ ecosystems }) => {
  const [activeTab, setActiveTab] = useState(ecosystems[0]?.id || "");

  const activeEcosystem = ecosystems.find((e) => e.id === activeTab) || ecosystems[0];

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
        {ecosystems.map((ecosystem) => {
          const isActive = activeTab === ecosystem.id;

          return (
            <button
              key={ecosystem.id}
              onClick={() => setActiveTab(ecosystem.id)}
              className={`
                flex-1 py-3 px-4
                text-sm font-semibold
                rounded-xl
                transition-all duration-300
                border-2
                flex items-center justify-center gap-2
                ${isActive
                  ? "shadow-md text-white"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }
              `}
              style={isActive ? { backgroundColor: ecosystem.color, borderColor: ecosystem.color } : undefined}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-80" />
              {ecosystem.name}
            </button>
          );
        })}
      </div>

      {/* Active Content Card */}
      {activeEcosystem && (
        <div
          // className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300"
          key={activeEcosystem.id}
        >
          {/* <Link to={activeEcosystem.link}> */}
          {/* Image */}
          <div className="relative aspect-[1/1] overflow-hidden">
            <img
              src={activeEcosystem.image}
              alt={activeEcosystem.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* </Link> */}
          {/* Content */}
   
        </div>
      )}
    </div>
  );
};

export default EcosystemMobileTabs;
