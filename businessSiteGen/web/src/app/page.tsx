import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
              SF
            </div>
            <span className="text-lg font-semibold text-gray-900">
              SiteFoundry
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Build your business website
            <span className="block text-brand-600">in minutes.</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-brand-600 tracking-wide uppercase">
            Powered by SiteFoundry
          </p>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Walk through a simple step-by-step wizard to create a professional,
            ready-to-host website for your restaurant, contracting company,
            real estate agency, or service business.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/editor" className="btn-primary text-base px-8 py-3">
              Start Building
            </Link>
            <div className="relative">
              <button
                disabled
                className="btn-secondary text-base px-8 py-3 opacity-60 cursor-not-allowed"
              >
                Import JSON
              </button>
              <span className="absolute -top-2.5 -right-2.5 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Soon
              </span>
            </div>
          </div>

          {/* Template previews */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Restaurant", color: "bg-emerald-100 text-emerald-700" },
              { name: "Contractor", color: "bg-orange-100 text-orange-700" },
              { name: "Real Estate", color: "bg-blue-100 text-blue-700" },
              { name: "Service", color: "bg-purple-100 text-purple-700" },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-gray-200 bg-white p-4 text-center"
              >
                <div
                  className={`mx-auto mb-2 h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold ${t.color}`}
                >
                  {t.name[0]}
                </div>
                <p className="text-sm font-medium text-gray-700">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        SiteFoundry &mdash; A Foundry Project
      </footer>
    </div>
  );
}
