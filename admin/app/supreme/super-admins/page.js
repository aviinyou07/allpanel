'use client';
import UserManagementPage from '@/components/UserManagementPage';
export default function SuperAdminsPage() {
  return <UserManagementPage targetRole="SUPER_ADMIN" title="Super Admins" createLabel="Create Super Admin" />;
}
