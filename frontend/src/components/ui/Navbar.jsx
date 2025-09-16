import { Dumbbell } from 'lucide-react';
function Navbar() {
    return (
        <nav className="w-full bg-[#cfb498] flex md:fixed justify-between items-center  md:flex-row">
                <span className="md:m-4 flex p-2 text-white   md:text-left text-3xl">
                    <Dumbbell className="inline mr-2 " size={35} color="white" />
                    <p>FORM AI
                    </p>

                </span>
                <div>
                    <ul className="flex items-right md:flex-row gap-3 p-2 md:gap-6 md:p-6 text-2xl hover:cursor-pointer">
                        <li>
                            Home
                        </li>
                        <li>
                            About
                        </li>
                        <div className="flex visibility: hidden md:visible items-right gap-2 justify-end">

                        <li>
                            Sign Up
                        </li>
                        <li>
                            Log in
                        </li>
                        </div>
                    </ul>
                </div>
            </nav>
    )
}
export default Navbar;