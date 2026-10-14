import { useNavigate } from "react-router"

const listProducts = [1,2,3,4,5,6,7,8,9,10]

export function BuyerApp() {
    const navigate = useNavigate()

    return (
        <>
            <p className="font-display mb-4">Shop for your needs</p>
            <div className="grid grid-cols-2 gap-4">
                {
                    listProducts.map(() => {
                        return <div className="rounded-lg h-72 mb-4 w-44 shadow-sm flex flex-col py-4 justify-between bg-white" onClick={() => navigate("/buyer/productdetails")}>
                                    <div className="w-full items-center ml-4">
                                        <div className="rounded-sm h-40 w-36 border border-slate-200 mb-2"></div>
                                        <p className="text-sm font-bold tracking-tighter text-pretty leading-tight">Regular Milled Rice</p>
                                        <div className="bg-[#FFF6CC] px-[4px] w-12 rounded-sm">
                                            <p className="text-xs tracking-tighter text-[#FFB700] ">in stock</p>
                                        </div>
                                    </div>
                                    <div className="items-l ml-4">
                                        <p className="self-start text-sm tracking-tighter font-bold">P100.00/kg</p>
                                    </div>
                                </div>
                    })
                }
            </div>
        </>
    )
}