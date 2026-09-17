'use client';
import UserManagementPage from '@/components/UserManagementPage';

export default function SupremeUsersPage() {
  return <UserManagementPage targetRole="USER" title="Users" createLabel="Create User" />;
}
