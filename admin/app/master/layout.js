'use client';

import AdminLayout from '@/components/AdminLayout';
import { ToastProvider } from '@/components/Toast';

export default function MasterLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
