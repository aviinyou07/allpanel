'use client';
import UserManagementPage from '@/components/UserManagementPage';

export default function SuperAdminUsersPage() {
  return <UserManagementPage targetRole="USER" title="Users" createLabel="Create User" />;
}
