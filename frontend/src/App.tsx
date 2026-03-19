import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import InboxPage from './pages/InboxPage'
import ComposePage from './pages/ComposePage'
import ReplyPage from './pages/ReplyPage'
import MailDetailPage from './pages/MailDetailPage'
import SentPage from './pages/SentPage'
import DraftsPage from './pages/DraftsPage'
import TrashPage from './pages/TrashPage'
import SpamPage from './pages/SpamPage'
import ContactsPage from './pages/ContactsPage'
import GroupMailPage from './pages/GroupMailPage'
import FileCenter from './pages/FileCenter'
import AttachmentsPage from './pages/AttachmentsPage'
import InvoicePage from './pages/InvoicePage'
import SettingsPage from './pages/SettingsPage'
import FolderPage from './pages/FolderPage'
import StarredPage from './pages/StarredPage'
import ContactsMailPage from './pages/ContactsMailPage'
import MobileAppPage from './pages/MobileAppPage'
import DownloadPage from './pages/DownloadPage'
import HelpPage from './pages/HelpPage'
import AIToolsPage from './pages/AIToolsPage'
import MailLayout from './components/MailLayout'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* 认证页面 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* 邮件主布局 */}
          <Route path="/" element={<MailLayout />}>
            <Route index element={<Navigate to="/inbox" replace />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="starred" element={<StarredPage />} />
            <Route path="contacts-mail" element={<ContactsMailPage />} />
            <Route path="compose" element={<ComposePage />} />
            <Route path="reply" element={<ReplyPage />} />
            <Route path="mail/:mailId" element={<MailDetailPage />} />
            <Route path="folder/:folderName" element={<FolderPage />} />
            <Route path="sent" element={<SentPage />} />
            <Route path="drafts" element={<DraftsPage />} />
            <Route path="trash" element={<TrashPage />} />
            <Route path="spam" element={<SpamPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="group-mail" element={<GroupMailPage />} />
            <Route path="files" element={<FileCenter />} />
            <Route path="attachments" element={<AttachmentsPage />} />
            <Route path="invoice" element={<InvoicePage />} />
            <Route path="mobile" element={<MobileAppPage />} />
            <Route path="download" element={<DownloadPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="ai-tools" element={<AIToolsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
