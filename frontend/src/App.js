import { Outlet } from "react-router-dom"
import { useAuthContext } from "./hooks/useAuthContext";
import Nav from './components/Nav'

export default function App() {
  const { user } = useAuthContext()
  return (
    <>
      {user && (
        <Nav />
      )}
      <main className="py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:items-center md:justify-between lg:max-w-7xl lg:px-8">
          <Outlet />
        </div>
      </main>
    </>
  );
}