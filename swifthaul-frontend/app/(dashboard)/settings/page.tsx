'use client';

import { useState, useMemo } from 'react';
import {
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Arrow,
} from 'lucide-react';
import { toast } from 'sonner';

import { InviteModal } from '@/components/settings/invite-modal';
import { SETTINGS } from '@/constants/settings';
import { ROLE_STYLES, STATUS_STYLES } from '@/constants/settings-mock';
import { useInvite } from '@/hooks/auth/use-invite';
import { useUsers } from '@/hooks/users/use-users';
import { useMe } from '@/hooks/auth/use-me';
import { useUpdateUserStatus } from '@/hooks/users/use-update-user-status';
import { formatDateString } from '@/lib/utils';
import type { TeamMember, UserRole, MemberStatus } from '@/types/settings';
import type { UserListItem } from '@/types/users';

export default function SettingsPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: me } = useMe();
  const { data: usersData, isLoading } = useUsers({
    page,
    limit: SETTINGS.PAGE_SIZE,
  });
  const updateStatus = useUpdateUserStatus();

  const members = useMemo<TeamMember[]>(() => {
    if (!usersData?.data) return [];
    return usersData.data.map((u: UserListItem) => {
      let status: MemberStatus = 'ACTIVE';
      if (!u.inviteAccepted) status = 'INVITED';
      else if (!u.isActive) status = 'DEACTIVATED';

      const initials = (u.name || 'User')
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status,
        joinedDate: formatDateString(u.createdAt),
        title: u.role === 'DRIVER' ? 'Field Agent' : 'Operations',
        avatarInitials: initials,
        isCurrentUser: u.id === me?.id,
      };
    });
  }, [usersData, me]);

  const activeCount = useMemo(
    () => members.filter(m => m.status === 'ACTIVE').length,
    [members]
  );

  // Pagination from API
  const total = usersData?.meta.total ?? 0;
  const totalPages =
    usersData?.meta.totalPages ??
    Math.max(1, Math.ceil(total / SETTINGS.PAGE_SIZE));
  const safePage = page;
  const from = (page - 1) * SETTINGS.PAGE_SIZE + 1;
  const to = Math.min(page * SETTINGS.PAGE_SIZE, total);

  const invite = useInvite();

  function handleInvite(email: string, role: UserRole) {
    invite.mutate(
      { email, role },
      {
        onSuccess: () => {
          setShowInvite(false);
          toast.success(`Invite sent to ${email}`);
        },
      }
    );
  }

  function toggleStatus(id: string, current: MemberStatus) {
    updateStatus.mutate({
      id,
      payload: { isActive: current !== 'ACTIVE' },
    });
    setOpenMenu(null);
  }

  function resendInvite(email: string) {
    setOpenMenu(null);
    handleInvite(email, 'DISPATCHER');
  }

  return (
    <>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-text-muted mb-1">
              {SETTINGS.BREADCRUMB}
            </p>
            <h1 className="text-2xl font-bold text-text-primary">
              {SETTINGS.TEAM_HEADING}
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {SETTINGS.TEAM_SUBHEADING}
            </p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-light hover:bg-primary-hover text-white text-sm font-semibold transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">{SETTINGS.INVITE_BTN}</span>
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="h-12 bg-surface-elevated animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-elevated border-b border-border">
                    {[
                      SETTINGS.COL_NAME_ROLE,
                      SETTINGS.COL_EMAIL,
                      SETTINGS.COL_STATUS,
                      SETTINGS.COL_JOINED,
                      SETTINGS.COL_ACTIONS,
                    ].map(col => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold uppercase tracking-wider text-text-secondary px-5 py-3"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-text-muted"
                      >
                        No team members found
                      </td>
                    </tr>
                  ) : (
                    members.map(member => {
                      const status = STATUS_STYLES[member.status];
                      const isDeactivated = member.status === 'DEACTIVATED';
                      return (
                        <tr
                          key={member.id}
                          className={`transition-colors hover:bg-surface-elevated ${isDeactivated ? 'opacity-50' : ''}`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-white">
                                  {member.avatarInitials}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-text-primary">
                                    {member.name}
                                  </span>
                                  {member.isCurrentUser && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white tracking-wide">
                                      {SETTINGS.YOU_BADGE}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`inline-flex mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${ROLE_STYLES[member.role]}`}
                                >
                                  {member.role}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-text-secondary">
                            {member.email}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${status.dot}`}
                              />
                              <span
                                className={`text-xs font-semibold ${status.text}`}
                              >
                                {status.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-text-secondary">
                            {member.joinedDate}
                          </td>
                          <td className="px-5 py-3.5 relative">
                            {!member.isCurrentUser && (
                              <div className="relative inline-block">
                                <button
                                  onClick={() =>
                                    setOpenMenu(
                                      openMenu === member.id ? null : member.id
                                    )
                                  }
                                  className="icon-btn"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {openMenu === member.id && (
                                  <div
                                    className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                                    onMouseLeave={() => setOpenMenu(null)}
                                  >
                                    {member.status === 'INVITED' ? (
                                      <button
                                        onClick={() =>
                                          resendInvite(member.email)
                                        }
                                        className="w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-surface-elevated transition-colors"
                                      >
                                        {SETTINGS.RESEND_INVITE}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          toggleStatus(member.id, member.status)
                                        }
                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated ${
                                          member.status === 'ACTIVE'
                                            ? 'text-error'
                                            : 'text-success'
                                        }`}
                                      >
                                        {member.status === 'ACTIVE'
                                          ? SETTINGS.DEACTIVATE_ACTION
                                          : SETTINGS.REACTIVATE_ACTION}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Pagination footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
                <p className="text-xs text-text-secondary">
                  {SETTINGS.SHOWING(from, to, total)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    {SETTINGS.PREVIOUS}
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text-secondary hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    {SETTINGS.NEXT}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              {SETTINGS.MOBILE_SUBHEADING}
            </p>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
              {SETTINGS.ACTIVE_COUNT_BADGE(activeCount)}
            </span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-20 bg-surface rounded-xl animate-pulse"
                />
              ))
            ) : members.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-8 text-center text-text-muted text-sm">
                No members found.
              </div>
            ) : (
              members.map(member => {
                const isDeactivated = member.status === 'DEACTIVATED';
                return (
                  <div
                    key={member.id}
                    className={`bg-surface rounded-xl border border-border shadow-sm flex items-center gap-3 px-4 py-4 ${isDeactivated ? 'opacity-50' : ''}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {member.avatarInitials}
                        </span>
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${STATUS_STYLES[member.status].dot}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-text-primary truncate">
                          {member.name}
                        </span>
                        {member.isCurrentUser && (
                          <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-primary text-white tracking-wide shrink-0">
                            {SETTINGS.YOU_BADGE}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {member.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${ROLE_STYLES[member.role]}`}
                      >
                        {member.role}
                      </span>
                      
                      {!member.isCurrentUser && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenu(
                                openMenu === member.id ? null : member.id
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors text-text-muted"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenu === member.id && (
                            <div
                              className="absolute right-0 bottom-full mb-1 w-40 bg-surface border border-border rounded-lg shadow-lg z-20 overflow-hidden"
                              onMouseLeave={() => setOpenMenu(null)}
                            >
                              {member.status === 'INVITED' ? (
                                <button
                                  onClick={() => resendInvite(member.email)}
                                  className="w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-surface-elevated transition-colors"
                                >
                                  {SETTINGS.RESEND_INVITE}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    toggleStatus(member.id, member.status)
                                  }
                                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-elevated ${
                                    member.status === 'ACTIVE'
                                      ? 'text-error'
                                      : 'text-success'
                                  }`}
                                >
                                  {member.status === 'ACTIVE'
                                    ? SETTINGS.DEACTIVATE_ACTION
                                    : SETTINGS.REACTIVATE_ACTION}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mobile pagination */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-text-secondary">
              {SETTINGS.SHOWING(from, to, total)}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="icon-btn disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FAB mobile invite */}
        <button
          onClick={() => setShowInvite(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-primary-light hover:bg-primary-hover text-white shadow-lg flex items-center justify-center transition-colors z-10 lg:hidden"
          aria-label={SETTINGS.INVITE_BTN}
        >
          <UserPlus className="w-6 h-6" />
        </button>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSubmit={handleInvite}
          isSubmitting={invite.isPending}
        />
      )}
    </>
  );
}
