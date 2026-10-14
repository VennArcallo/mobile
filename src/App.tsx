import { Outlet } from "react-router"
import { BuyerNavigation } from "./buyerComponents/BuyerNavigation"

export function App() {
  return (
    <div className="flex justify-center min-h-screen bg-slate-50">
      <div className="z-50 top-0 fixed h-24 bg-[#FFD400] w-full py-2 flex items-center justify-between rounded-b-3xl h-20 px-4 shadow-sm">
        <input type="text" placeholder="Search product" className="w-48 h-8 text-slate-500  text-sm flex justify-center rounded-full bg-white inset-shadow-sm outline-none px-4">
        </input>
        <div className="flex justify-cente items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <div className="mx-2 w-6 h-6 rounded-full bg-white text-black" />
        </div>
      </div>

      <main className="mt-32">
        <Outlet />
      </main>

      <div className="fixed bottom-0 inset-x-0 z-50 h-20 bg-linear-to-b from-transparent to-white to-white flex items-center justify-center">
        <nav className="z-50 fixed bottom-4 bg-white left-1/2 -translate-x-1/2 my-4 h-12 w-90 px-4 max-w-md px-8 rounded-full flex justify-between items-center shadow-lg">
          <BuyerNavigation />
        </nav>
      </div>
    </div>
  )
}
