import logo from "../img/logo.jpg";
import { Link } from 'react-router-dom';


export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 xl:px-0 max-w-6xl mx-auto py-4">
      <img src={logo} className="w-20" alt="" />
      <ul className="flex space-x-12 text-white text-xl">
        <Link to={'/Garage'}><li>Garage</li></Link>
        <Link to={'/Winners'}><li>Winners</li></Link>
      </ul>
    </nav>
  );
}
