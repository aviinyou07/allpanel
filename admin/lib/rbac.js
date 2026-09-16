export const ROLES = {
  SUPREME: 'SUPREME',
  SUPER_ADMIN: 'SUPER_ADMIN',
  MASTER: 'MASTER',
  USER: 'USER',
};

// Strict hierarchy: who can create whom
const CREATION_MAP = {
  SUPREME: 'SUPER_ADMIN',
  SUPER_ADMIN: 'MASTER',
  MASTER: 'USER',
  USER: null,
};

// Role rank (higher number = higher authority)
const ROLE_RANK = {
  SUPREME: 4,
  SUPER_ADMIN: 3,
  MASTER: 2,
  USER: 1,
};

export function canCreateRole(actorRole) {
  return CREATION_MAP[actorRole] || null;
}

export function canManageRole(actorRole, targetRole) {
  const creatable = CREATION_MAP[actorRole];
  return creatable === targetRole;
}

export function getRoleRank(role) {
  return ROLE_RANK[role] || 0;
}

export function isHigherRole(role1, role2) {
  return getRoleRank(role1) > getRoleRank(role2);
}

export function getPermissions(role) {
  return {
    canManageSuperAdmins: role === ROLES.SUPREME,
    canManageMasters: role === ROLES.SUPER_ADMIN,
    canManageUsers: role === ROLES.MASTER,
    canCreditCoins: [ROLES.SUPREME, ROLES.SUPER_ADMIN, ROLES.MASTER].includes(role),
    canViewOwnBalance: true,
    canViewOwnTransactions: true,
    canViewDownlineTransactions: role !== ROLES.USER,
    canViewReports: true,
    canViewFullReports: role === ROLES.SUPREME,
    canViewDownlineReports: [ROLES.SUPER_ADMIN, ROLES.MASTER].includes(role),
    canManageSettings: role === ROLES.SUPREME,
    canManageGame: role === ROLES.SUPREME,
    canViewAuditLogs: role === ROLES.SUPREME,
    canPlayGame: role === ROLES.USER,
  };
}

export function getSidebarItems(role) {
  const items = [
    { label: 'Dashboard', icon: 'LayoutDashboard', href: `/${role.toLowerCase().replace('_', '-')}/dashboard` },
  ];

  if (role === ROLES.SUPREME) {
    items.push({ label: 'Super Admins', icon: 'UserCog', href: '/supreme/super-admins' });
  }
  if (role === ROLES.SUPER_ADMIN) {
    items.push({ label: 'Masters', icon: 'Users', href: '/super-admin/masters' });
  }
  if (role === ROLES.MASTER) {
    items.push({ label: 'Users', icon: 'Users', href: '/master/users' });
  }

  items.push(
    { label: 'Wallet / Credits', icon: 'Wallet', href: `/${role.toLowerCase().replace('_', '-')}/wallet` },
    { label: 'Transactions', icon: 'ArrowLeftRight', href: `/${role.toLowerCase().replace('_', '-')}/transactions` },
  );

  if (role === ROLES.SUPREME) {
    items.push({ label: 'Dragon Tiger', icon: 'Gamepad2', href: '/supreme/dragon-tiger' });
  }

  items.push(
    { label: 'Reports', icon: 'BarChart3', href: `/${role.toLowerCase().replace('_', '-')}/reports` },
  );

  if (role === ROLES.SUPREME) {
    items.push(
      { label: 'Settings', icon: 'Settings', href: '/supreme/settings' },
      { label: 'Audit Logs', icon: 'FileText', href: '/supreme/audit-logs' },
    );
  }

  return items;
}

export function getRoleRoutePrefix(role) {
  const map = {
    SUPREME: '/supreme',
    SUPER_ADMIN: '/super-admin',
    MASTER: '/master',
    USER: '/user',
  };
  return map[role] || '/';
}
