'use client';
import UserManagementPage from '@/components/UserManagementPage';

export default function SupremeMastersPage() {
  return <UserManagementPage targetRole="MASTER" title="Masters" createLabel="Create Master" />;
}
