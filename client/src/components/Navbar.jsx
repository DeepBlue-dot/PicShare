import { HomeIcon, PlusIcon, UserIcon } from "@heroicons/react/16/solid";

export default function Navbar() {
    return (
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-red-500 text-2xl font-bold">PinClone</h1>
            </div>
            <div className="flex gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HomeIcon className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <PlusIcon className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }