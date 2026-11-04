import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ScrollToTop from "@/components/common/ScrollToTop";
import MainLayout from "@/layouts/MainLayout";
// Public Pages
import HomePage from "@/features/home/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";
// Admin
import AdminLayout from "@/features/admin/layouts/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminContactRequestsPage from "@/features/admin/pages/AdminContactRequestsPage";
import AdminLoginPage from "@/features/admin/pages/AdminLoginPage";
import AdminProtectedRoute from "@/features/admin/components/AdminProtectedRoute";
import AdminOnlyRoute from "@/features/admin/components/AdminOnlyRoute";
// Solar Calculator
import SolarCalculatorPage from "@/features/calculator/SolarCalculatorPage";
// Articles
import ArticlesPage from "@/features/articles/pages/ArticlesPage";
import ArticleDetailPage from "@/features/articles/pages/ArticleDetailPage";
import AdminArticlesPage from "@/features/admin/pages/AdminArticlesPage";
// Solutions
import SolutionsPage from "@/features/calculator/pages/SolutionsPage";
import SolarHomePage from "@/features/calculator/pages/SolarHomePage";
import SolarBusinessPage from "@/features/calculator/pages/SolarBusinessPage";
import SolarFarmPage from "@/features/calculator/pages/SolarFarmPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/about"
          element={
            <MainLayout>
              <AboutPage />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          }
        />

        {/* ARTICLES */}
        <Route
          path="/bai-viet"
          element={
            <MainLayout>
              <ArticlesPage />
            </MainLayout>
          }
        />

        <Route
          path="/bai-viet/:slug"
          element={
            <MainLayout>
              <ArticleDetailPage />
            </MainLayout>
          }
        />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/admin/messages"
            element={
              <AdminOnlyRoute>
                <AdminContactRequestsPage />
              </AdminOnlyRoute>
            }
          />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
        </Route>

        {/* SOLAR CALCULATOR — Standalone, no MainLayout */}
        <Route path="/tinh-giai-phap" element={<SolarCalculatorPage />} />

        {/* SOLUTIONS */}
        <Route
          path="/solutions"
          element={
            <MainLayout>
              <SolutionsPage />
            </MainLayout>
          }
        />
        <Route
          path="/solutions/solar-home"
          element={<SolarHomePage />}
        />
        <Route
          path="/solutions/solar-business"
          element={<SolarBusinessPage />}
        />
        <Route
          path="/solutions/solar-farm"
          element={<SolarFarmPage />}
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
