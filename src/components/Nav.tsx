import logo from "../img/logo.jpg";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 xl:px-0 max-w-6xl mx-auto py-4">
      <img src={logo} className="w-20" alt="" />
      <ul className="flex space-x-12">
        <li>Garage</li>
        <li>Winners</li>
      </ul>
    </nav>
  );
}
