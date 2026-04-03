import React from 'react';

interface SplitScreenLayoutProps {
  leftModule: React.ReactNode;
  rightModule: React.ReactNode;
}

export function SplitScreenLayout({ leftModule, rightModule }: SplitScreenLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 print:block print:h-auto print:bg-white print:overflow-visible">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto border-r border-slate-200 bg-white shadow-sm z-10 transition-all duration-300 print:hidden">
        <div className="max-w-3xl mx-auto p-6 md:p-10 pb-24">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoice Generator</h1>
              <p className="text-slate-500 mt-1">Create professional invoices in seconds.</p>
            </div>
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-600/20">
              IV
            </div>
          </header>
          {leftModule}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full lg:w-1/2 bg-slate-100 lg:h-screen lg:overflow-y-auto p-6 md:p-10 flex justify-center custom-scrollbar print:w-full print:h-auto print:overflow-visible print:bg-white print:p-0 print:block">
        <div className="w-full sticky top-10 h-max max-w-full lg:max-w-4xl transition-all duration-500 print:static print:max-w-none print:w-full">
          {rightModule}
        </div>
      </div>
    </div>
  );
}
