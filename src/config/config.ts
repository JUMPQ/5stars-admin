// src/config/config.ts
export type Role = 'admin' | 'team';

export const NAV_ITEMS: Record<Role, { id: string; label: string; href: string }[]> = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', href: '/admin' },
    { id: 'add-competition', label: 'Add Competition', href: '/admin/competitions/add' },
    { id: 'competitions', label: 'Competitions', href: '/admin/competitions' },
    { id: 'team-profile', label: 'Team Profile', href: '/admin/team-profile' },
    { id: 'teams', label: 'Teams', href: '/admin/teams' },
  ],
  team: [
    { id: 'dashboard', label: 'Dashboard', href: '/team' },
    { id: 'teams', label: 'Teams', href: '/team/teams' },
    { id: 'team-management', label: 'Team Management', href: '/team/management' },
    { id: 'competitions', label: 'Competitions', href: '/team/competitions' },
    { id: 'team-profile', label: 'Team Profile', href: '/team/profile' },
  ],
};

export const DASHBOARD_TEXT = {
  admin: { title: 'League Dashboard', subtitle: 'Manage the whole league' },
  team:  { title: 'Team Dashboard', subtitle: 'View your team and fixtures' },
};
