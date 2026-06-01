import { Navigation } from './Navigation';

export function Header({ cartCount, user, onLogout, onSearch }) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <Navigation 
        cartCount={cartCount}
        user={user}
        onLogout={onLogout}
        onSearch={onSearch}
      />
    </header>
  );
}
