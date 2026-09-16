'use client';
import UserManagementPage from '@/components/UserManagementPage';
export default function UsersPage() {
  return <UserManagementPage targetRole="USER" title="Users" createLabel="Create User" />;
}
