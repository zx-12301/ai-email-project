import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import InboxPage from './pages/InboxPage'
import ComposePage from './pages/ComposePage'
import MailDetailPage from './pages/MailDetailPage'
import SentPage from './pages/SentPage'
import DraftsPage from './pages/DraftsPage'
import TrashPage from './pages/TrashPage'
import ContactsPage from './pages/ContactsPage'
import GroupMailPage from './pages/GroupMailPage'
import FileCenter from './pages/FileCenter'
import SettingsPage from './pages/SettingsPage'
import MailLayout from './components/MailLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 邮件主布局 */}
        <Route path="/" element={<MailLayout />}>
          <Route index element={<Navigate to="/inbox" replace />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="compose" element={<ComposePage />} />
          <Route path="mail/:mailId" element={<MailDetailPage />} />
          <Route path="sent" element={<SentPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="group-mail" element={<GroupMailPage />} />
          <Route path="files" element={<FileCenter />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
