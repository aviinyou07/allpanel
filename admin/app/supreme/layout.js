'use client';

import AdminLayout from '@/components/AdminLayout';
import { ToastProvider } from '@/components/Toast';

export default function SupremeLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
