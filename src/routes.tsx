import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { App } from "./App";
import { BuyerApp } from "./buyerComponents/BuyerApp";
import { BuyerHistory } from "./buyerComponents/BuyerHistory";
import { BuyerPickup } from "./buyerComponents/BuyerPickup";
import { BuyerFeedback } from "./buyerComponents/BuyerFeedback";
import { BuyerProductDetails } from "./buyerComponents/BuyerProductDetails";

const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            { index: true, Component: BuyerApp },                 
            { path: "buyer/history", Component: BuyerHistory },   
            { path: "buyer/pickup", Component: BuyerPickup},
            { path: "buyer/feedback", Component: BuyerFeedback },
            { path: "buyer/productdetails", Component: BuyerProductDetails }
        ],
}]);


export default function AppRouter() {
    return <RouterProvider router={router} />
}