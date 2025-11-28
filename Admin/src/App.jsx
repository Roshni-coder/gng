import React, { useState, createContext } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Slide } from '@mui/material';


// Pages & Components
import Header from './Components/Header/Header.jsx';
import SideBar from './Components/Sidebar/SideBar.jsx';
import DashBoard from './Pages/DashBoard/DashBoard.jsx';
import ProductList from './Pages/Product Pages/ProductList.jsx';
import OrdersList from './Pages/Orders Pages/OrdersList.jsx';
import CategoryList from './Pages/Category/CategoryList.jsx';
import SubCategoryList from './Pages/Category/SubCategoryList.jsx';
import UsersList from './Pages/Users Page/UsersList.jsx';
import Login from './Pages/Login/Login.jsx';
import ProtectedRoute from './Pages/ProtectedRoute.jsx';
import SellersList from './Pages/sellers/sellers.jsx';
// import MonthlyOrdersReport from './Pages/Reports/MonthlyOrdersReport.jsx';
import AdminReport from './Pages/Reports/AdminReport.jsx';

export const MyContext = createContext();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Layout wrapper
function Layout({ children }) {
  return (
    <section className="main h-screen w-full flex flex-col">
      <ToastContainer position="top-start" />
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <aside className="overflow-y-auto">
          <SideBar />
        </aside>
        <main className="!w-full py-2 overflow-y-auto px-3">
          {children}
        </main>
      </div>
    </section>
  );
}

function App() {
  const [isOpenAddProductPanel, setIsOpenAddProductPanel] = useState({
    open: false,
    model: ''
  });

  const values = {
    isOpenAddProductPanel,
    setIsOpenAddProductPanel
  };

  const router = createBrowserRouter([
    { path: '/', element: <ProtectedRoute><Layout><DashBoard /></Layout></ProtectedRoute> },
    { path: '/login', element: <Login /> },
    { path: '/products', element: <ProtectedRoute><Layout><ProductList /></Layout></ProtectedRoute> },
    { path: '/orders', element: <ProtectedRoute><Layout><OrdersList /></Layout></ProtectedRoute> },
    { path: '/categorylist', element: <ProtectedRoute><Layout><CategoryList /></Layout></ProtectedRoute> },
    { path: '/subcategorylist', element: <ProtectedRoute><Layout><SubCategoryList /></Layout></ProtectedRoute> },
    { path: '/users', element: <ProtectedRoute><Layout><UsersList /></Layout></ProtectedRoute> },
    { path: '/sellers', element: <ProtectedRoute><Layout><SellersList /></Layout></ProtectedRoute> },
    { path: '/report', element: <ProtectedRoute><Layout><AdminReport/></Layout></ProtectedRoute> },
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />
    </MyContext.Provider>
  );
}

export default App;