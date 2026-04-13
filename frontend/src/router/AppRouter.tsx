/* ============================================================
   AgriAgent – App Router
   All application routes defined here
   ============================================================ */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from '../components/common/Loader';

// Lazy-load pages for code splitting
const HomePage          = lazy(() => import('../pages/HomePage'));
const Dashboard         = lazy(() => import('../pages/Dashboard'));
const DailySummary      = lazy(() => import('../pages/DailySummary'));
const CropInsights      = lazy(() => import('../pages/CropInsights'));
const WeatherIrrigation = lazy(() => import('../pages/WeatherIrrigation'));
const MarketIntelligence = lazy(() => import('../pages/MarketIntelligence'));
const Monitoring        = lazy(() => import('../pages/Monitoring'));
const Alerts            = lazy(() => import('../pages/Alerts'));
const Reports           = lazy(() => import('../pages/Reports'));
const Settings          = lazy(() => import('../pages/Settings'));

export const AppRouter: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/"            element={<HomePage />} />
      <Route path="/dashboard"   element={<Dashboard />} />
      <Route path="/daily"       element={<DailySummary />} />
      <Route path="/crops"       element={<CropInsights />} />
      <Route path="/weather"     element={<WeatherIrrigation />} />
      <Route path="/market"      element={<MarketIntelligence />} />
      <Route path="/monitoring"  element={<Monitoring />} />
      <Route path="/alerts"      element={<Alerts />} />
      <Route path="/reports"     element={<Reports />} />
      <Route path="/settings"    element={<Settings />} />
      {/* Catch-all redirect */}
      <Route path="*"            element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);
