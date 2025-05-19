import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroContainer from "./containers/HeroContainer";
import { Dashboard } from "./components/pageComponents/dashboard/Dashboard";
import { ProtectedRoute } from "./components/customComponents/ProtectedRoute/ProtectedRoute";
import Manager from "./pages/Manager";
import AppLayout from "./components/layout/AppLayout";
import { NewOrder } from "./components/pageComponents/orders/NewOrder";

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HeroContainer />} />

          {/* Protected routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <Dashboard role="ADMIN" userName={""} />
            </ProtectedRoute>
          } />

          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <Manager />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard role="MANAGER" userName={""} />} />
            <Route path="orders/new" element={<NewOrder role={"MANAGER"} userName={""} />} />
          </Route>


          <Route path="/kitchen/dashboard" element={
            <ProtectedRoute allowedRoles={["KITCHEN"]}>
              <Dashboard role="KITCHEN" userName={""} />
            </ProtectedRoute>
          } />

          <Route path="/delivery/dashboard" element={
            <ProtectedRoute allowedRoles={["DELIVERY"]}>
              <Dashboard role="DELIVERY" userName={""} />
            </ProtectedRoute>
          } />

          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Dashboard role="CUSTOMER" userName={""} />
            </ProtectedRoute>
          } />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;