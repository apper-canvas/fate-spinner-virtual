import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-full">
      {/* Header */}
      <header className="flex-shrink-0 bg-background border-b border-surface">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary glow-effect">
              🎡 Fate Spinner
            </h1>
          </div>
          <p className="text-center text-gray-400 mt-2 text-sm md:text-base">
            Let destiny decide your fate with magical animations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;