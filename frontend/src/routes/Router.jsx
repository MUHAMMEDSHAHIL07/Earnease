import { Routes, Route, Navigate } from "react-router-dom";

{/* ---------- PUBLIC ROUTES ---------- */ }
import HomePage from "../pages/Publicpages/Home";
import Login from "../pages/Publicpages/Login";
import ForgotPassword from "../pages/Publicpages/ForgotPassword";
import ResetPassword from "../pages/Publicpages/ResetPassword";
import NotFound from "../pages/Publicpages/Notfound";
import Register from "../pages/Publicpages/Register"
{/* ---------- STUDENT ROUTES ---------- */ }
import JobListUI from "../pages/Student/StudentJob";
import { useAuth } from "../context/authContext"

{/* ---------- EMPLOYER ROUTES ---------- */ }
import EmployerDashboard from "../pages/Employer/EmployerDashboard";
import VerificationPending from "../pages/Employer/VerificationPending";
import PostJob from "../pages/Employer/PostJob";
import ViewJob from "../pages/Employer/ViewJob";
import EditJob from "../pages/Employer/EditJob";
import EmployerApplications from "../pages/Employer/EmployerApplications";
import EmployerEditProfile from "../pages/Employer/EmployerEditProfile";

{/* ---------- ADMIN ROUTES ---------- */ }
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import PendingEmployers from "../pages/Admin/PendingEmployers";
import EmployerDetail from "../pages/Admin/EmployerDetail";
import SingleViewEmployer from "../pages/Admin/SingleViewEmp";
import StudentManagement from "../pages/Admin/StudentManagement";
import EmployerManagement from "../pages/Admin/EmployerManagement";
import ProtectedRoute from "./ProtectedRoute";
import ProtectHomeRoute from "./ProtectHomeRoute";
import Subscription from "../pages/Employer/Subscription";
import PaymentHistoryDashboard from "../pages/Employer/paymentHistory";
import StudentProfile from "../pages/Student/StudentProfile";
import SavedJobs from "../pages/Student/SavedJobs";
import JobDetail from "../pages/Student/jobDetail";
import ChatUI from "../pages/Publicpages/ChatUI";
import EmployerChatUI from "../pages/Employer/EmployerChatUI";
import CandidateApplications from "../pages/Employer/CandidateApplications";
import EmployerMessagingDashboard from "../pages/Employer/EmployerMessageDashboard";
import EmployerChatRoom from "../pages/Employer/EmployerChatRoom";
import StudentMessagingDashboard from "../pages/Student/StudentMessageDashboard";
import StudentChatRoom from "../pages/Student/StudentChatRoom";
import EditStudentProfile from "../pages/Student/EditProfile";
import VerifyEmployer from "../pages/Employer/VerifyEmployer";
import AboutUs from "../pages/Publicpages/AboutUs";
import MyApplications from "../pages/Student/MyApplication";
import UserSettings from "../pages/Student/StudentSettings";

const Router = () => {
  const { user } = useAuth();
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/" element={<ProtectHomeRoute>
        <HomePage />
      </ProtectHomeRoute>} />
      <Route path="/register/student" element={<Register />} />
      <Route path="/register/employer" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/adminlog" element={<AdminLogin />} />
      <Route path="/jobdetail/:id" element={<JobDetail />} />
      <Route path="/job" element={<JobListUI />} />
      <Route path="/aboutus" element={<AboutUs />} />

      {/* ---------- STUDENT ROUTES ---------- */}
      <Route path="/chat/:chatRoomId"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ChatUI currentUser={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/savedjobs"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <UserSettings />
          </ProtectedRoute>
        }
      />
       <Route
        path="/myapplications"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyApplications />
          </ProtectedRoute>
        }
      />
            <Route
        path="/editProfile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <EditStudentProfile />
          </ProtectedRoute>
        }
      />
       <Route
        path="/student/inbox"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentMessagingDashboard />
          </ProtectedRoute>
        }
      >
        <Route
          path=":chatRoomId"
          element={<StudentChatRoom currentUser={user} />}
        />
      </Route>

      {/* ---------- EMPLOYER ONLY ---------- */}
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/candidates"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <CandidateApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/chat/:chatRoomId"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <EmployerChatUI currentUser={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/inbox"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <EmployerMessagingDashboard />
          </ProtectedRoute>
        }
      >
        <Route
          path=":chatRoomId"
          element={<EmployerChatRoom currentUser={user} />}
        />
      </Route>

      <Route
        path="/employer/paymenthistroy"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <PaymentHistoryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify/employer"
        element={
          <VerifyEmployer />
        }
      />
      <Route
        path="/employer/verification-pending"
        element={
          <VerificationPending />
        }
      />
      <Route
        path="/employer/post-job"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/editjob/:id"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <EditJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/viewJob"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <ViewJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/getApplication"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <EmployerApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/editProfile"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <EmployerEditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/subscription"
        element={
          <ProtectedRoute allowedRoles={["employer"]}>
            <Subscription />
          </ProtectedRoute>
        }
      />

      {/* ---------- ADMIN ONLY ---------- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employers/pending"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PendingEmployers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employers/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employerview/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <SingleViewEmployer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studentmanagement"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/studentmanagement"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employermanagement"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmployerManagement />
          </ProtectedRoute>
        }
      />

      {/* ---------- 404 ---------- */}
      <Route path="/notfound" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/notfound" replace />} />
    </Routes>
  );
};

export default Router;