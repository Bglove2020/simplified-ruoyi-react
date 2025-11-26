import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import { LoginForm } from './components/Form/login'
import { RegisterForm } from './components/Form/register'
import AppLayout from './layouts/AppLayout'
import UserManage from './pages/system/UserManage'
import DeptManage from './pages/system/deptManage/DeptManage'
import Dashboard from './pages/Dashboard'
import MenuManage from './pages/system/menuManage/MenuManage'


function App() {
  return (
    <div className="App">
      <Routes>
        {/* 登录/注册页面 */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>

        {/* 系统内部页面（带侧边栏布局） */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/Dashboard" replace />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="system/user-manage" element={<UserManage />} />
          <Route path="system/dept-manage" element={<DeptManage />} />
          <Route path="system/menu-manage" element={<MenuManage />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
