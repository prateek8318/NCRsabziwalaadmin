import React from "react";
import AdminLayout from "./layout/adminLayout";
import { Route, Routes } from "react-router";
// landing page
import LandingPage from "./pages/web/Home/Home";
import Cms from "./pages/web/Cms/Cms";

// admin
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Banner from "./pages/admin/Banner/Banner";
import Category from "./pages/admin/Category/Category";
import SubCategory from "./pages/admin/SubCategory/SubCategory";
import Product from "./pages/admin/Products/Product";
import Shop from "./pages/admin/Shop/Shop";
import User from "./pages/admin/User/User";
import Settings from "./pages/admin/Settings/Settings";
import Login from "./pages/admin/Auth/Login";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import ProductDetails from "./pages/admin/Products/ProductDetails";
import PaymentRequest from "./pages/admin/Payment-Request/PaymentRequest";
import Profile from "./pages/admin/Settings/components/Profile";
import Charges from "./pages/admin/Settings/components/Charges";
import TermConditions from "./pages/admin/Settings/components/Term&Conditions";
import PrivacyPolicyPage from "./pages/admin/Settings/components/PrivacyPolicyPage";
import RefundPolicy from "./pages/admin/Settings/components/RefundPolicy";
import AboutUs from "./pages/admin/Settings/components/AboutUs";
import Order from "./pages/admin/Order/Order";
import OrderDetailsPage from "./pages/admin/Order/components/OrderDetailsPage";
import Coupon from "./pages/admin/Coupon/Coupon";
import Driver from "./pages/admin/Driver/Driver";
import Sos from "./pages/admin/Sos/Sos";
import SosSettings from "./pages/admin/SosSettings/SosSettings";
import ReportIssues from "./pages/admin/ReportIssues/ReportIssues";
import ProductFlags from "./pages/admin/ProductFlags/ProductFlags";
import Explore from "./pages/admin/Explore/Explore";
import ExploreSection from "./pages/admin/ExploreSection/ExploreSection";
import ExploreSectionTable from "./pages/admin/Explore/components/ExploreSectionTable";
import AddProduct from "./pages/admin/Products/AddProduct";
import EditProduct from "./pages/admin/Products/EditProduct";
import AdminPublicRoute from "./components/AdminPublicRoute";
import PrivacyPolicy from "./pages/web/privacyPolicy/PrivacyPolicyPage";
import Layout from "./layout/Layout";
import ReturnPolicy from "./pages/web/ReturnPolicyPage";
import TermsOfServicePage from "./pages/web/TermsOfServicePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/cms/:page" element={<Cms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/terms-service" element={<TermsOfServicePage />} />
        </Route>

        {/* admin route */}
        <Route
          path="/admin/login"
          element={
            <AdminPublicRoute>
              <Login />
            </AdminPublicRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPrivateRoute>
              <AdminLayout />
            </AdminPrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="banner" element={<Banner />} />
          <Route path="product" element={<Product />} />
          <Route path="product/add" element={<AddProduct />} />
          <Route path="product/edit/:productId" element={<EditProduct />} />
          <Route path="product/:produtSlug" element={<ProductDetails />} />
          <Route path="category" element={<Category />} />
          <Route path="category/:categoryId" element={<SubCategory />} />
          <Route path="subcategory/:categoryId" element={<SubCategory />} />
          <Route path="coupons" element={<Coupon />} />
          <Route path="driver" element={<Driver />} />
          <Route path="sos" element={<Sos />} />
          <Route path="sos-settings" element={<SosSettings />} />
          <Route path="report-issues" element={<ReportIssues />} />
          <Route path="products/:produtSlug" element={<ProductDetails />} />
          <Route path="product-flags" element={<ProductFlags />} />
          <Route path="shop" element={<Shop />} />
          <Route path="order" element={<Order />} />
          <Route path="order/:orderId" element={<OrderDetailsPage />} />
          <Route path="request/:type" element={<PaymentRequest />} />
          {/* <Route path="request/driver" element={<PaymentRequest />} /> */}
          <Route path="explore" element={<Explore />} />
          <Route path="explore/:exploreId" element={<ExploreSectionTable />} />
          <Route path="explore-section" element={<ExploreSection />} />
          <Route path="user" element={<User />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/profile" element={<Profile />} />
          <Route path="settings/charges" element={<Charges />} />
          <Route
            path="terms-and-conditions/:type"
            element={<TermConditions />}
          />
          <Route path="privacy-policy/:type" element={<PrivacyPolicyPage />} />
          <Route path="refund-policy/:type" element={<RefundPolicy />} />
          <Route path="about-us/:type" element={<AboutUs />} />
        </Route>

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default App;
