'use client';

import AdminLayout from '@/components/AdminLayout';
import { ToastProvider } from '@/components/Toast';

export default function SuperAdminLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
