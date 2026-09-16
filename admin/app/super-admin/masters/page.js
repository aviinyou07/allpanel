'use client';
import UserManagementPage from '@/components/UserManagementPage';
export default function MastersPage() {
  return <UserManagementPage targetRole="MASTER" title="Masters" createLabel="Create Master" />;
}
