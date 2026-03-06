import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import useThemeStore from "./store/themeStore.js";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Chat from "./pages/text/Chat.jsx";
import ContentGenerator from "./pages/text/ContentGenerator.jsx";
import Summarizer from "./pages/text/Summarizer.jsx";
import Translator from "./pages/text/Translator.jsx";
import GrammarCheck from "./pages/text/GrammarCheck.jsx";
import CodeGenerator from "./pages/code/CodeGenerator.jsx";
import CodeDebugger from "./pages/code/CodeDebugger.jsx";
import CodeReview from "./pages/code/CodeReview.jsx";
import CodeRefactor from "./pages/code/CodeRefactor.jsx";
import CodeConverter from "./pages/code/CodeConverter.jsx";
import CodeDocumentation from "./pages/code/CodeDocumentation.jsx";
import UnitTestGenerator from "./pages/code/UnitTestGenerator.jsx";
import DocumentAnalysis from "./pages/document/DocumentAnalysis.jsx";
import ImageGenerator from "./pages/image/ImageGenerator.jsx";
import ImageToText from "./pages/image/ImageToText.jsx";
import History from "./pages/history/History.jsx";
import Subscription from "./pages/subscription/Subscription.jsx";
import AuthCallback from "./pages/auth/AuthCallback.jsx";

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/generate" element={<ProtectedRoute><ContentGenerator /></ProtectedRoute>} />
        <Route path="/summarize" element={<ProtectedRoute><Summarizer /></ProtectedRoute>} />
        <Route path="/translate" element={<ProtectedRoute><Translator /></ProtectedRoute>} />
        <Route path="/grammar" element={<ProtectedRoute><GrammarCheck /></ProtectedRoute>} />
        <Route path="/code/generate" element={<ProtectedRoute><CodeGenerator /></ProtectedRoute>} />
        <Route path="/code/debug" element={<ProtectedRoute><CodeDebugger /></ProtectedRoute>} />
        <Route path="/code/review" element={<ProtectedRoute><CodeReview /></ProtectedRoute>} />
        <Route path="/code/refactor" element={<ProtectedRoute><CodeRefactor /></ProtectedRoute>} />
        <Route path="/code/convert" element={<ProtectedRoute><CodeConverter /></ProtectedRoute>} />
        <Route path="/code/document" element={<ProtectedRoute><CodeDocumentation /></ProtectedRoute>} />
        <Route path="/code/test" element={<ProtectedRoute><UnitTestGenerator /></ProtectedRoute>} />
        <Route path="/document/extract" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
        <Route path="/document/summarize" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
        <Route path="/document/keypoints" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
        <Route path="/document/qa" element={<ProtectedRoute><DocumentAnalysis /></ProtectedRoute>} />
        <Route path="/image/generate" element={<ProtectedRoute><ImageGenerator /></ProtectedRoute>} />
        <Route path="/image/logo" element={<ProtectedRoute><ImageGenerator /></ProtectedRoute>} />
        <Route path="/image/social" element={<ProtectedRoute><ImageGenerator /></ProtectedRoute>} />
        <Route path="/image-to-text/describe" element={<ProtectedRoute><ImageToText /></ProtectedRoute>} />
        <Route path="/image-to-text/ocr" element={<ProtectedRoute><ImageToText /></ProtectedRoute>} />
        <Route path="/image-to-text/detect" element={<ProtectedRoute><ImageToText /></ProtectedRoute>} />
        <Route path="/image-to-text/handwriting" element={<ProtectedRoute><ImageToText /></ProtectedRoute>} />
        <Route path="/image-to-text/scan" element={<ProtectedRoute><ImageToText /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;