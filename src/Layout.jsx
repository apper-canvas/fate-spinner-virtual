import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;