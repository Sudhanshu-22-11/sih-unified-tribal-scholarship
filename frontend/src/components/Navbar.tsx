// ============================================================
// GOVERNMENT NAVBAR & HEADER
// Ministry of Tribal Affairs (MoTA) Design Standard
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';
import { useDemo } from '../context/DemoContext';
import { api } from '../services/api';
import { NotificationItem } from '../types';
import {
  GraduationCap, Bell, Globe, User, LogOut, Menu, X,
  Shield, CheckCheck, FileText, CheckCircle2, CreditCard,
  MessageSquareQuote, HelpCircle, Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { refreshKey } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(res => {
          if (res.success && res.data) setNotifications(res.data);
        })
        .catch(() => {});
    }
  }, [user, refreshKey]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const navLinks = [
    { to: '/dashboard', label: t.home, icon: Layers },
    { to: '/schemes', label: t.scholarships, icon: GraduationCap },
    { to: '/applications', label: t.applications, icon: FileText },
    { to: '/documents', label: t.documents, icon: FileText },
    { to: '/verification', label: t.verification, icon: CheckCircle2 },
    { to: '/payments', label: t.payments, icon: CreditCard },
    { to: '/grievance', label: t.help, icon: HelpCircle },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: t.admin, icon: Shield });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Gov Info Bar */}
      <div className="bg-[#064E3B] text-white text-[11px] py-1 px-4 border-b border-[#F8E7C9]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">भारत सरकार | GOVERNMENT OF INDIA</span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-[#F8E7C9]">Ministry of Tribal Affairs</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#04382A] px-2 py-0.5 rounded text-[11px]">
              <Globe className="w-3 h-3 text-[#F8E7C9]" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-1 rounded ${language === 'en' ? 'font-bold text-[#F8E7C9]' : 'text-gray-300 hover:text-white'}`}
              >
                EN
              </button>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-1 rounded ${language === 'hi' ? 'font-bold text-[#F8E7C9]' : 'text-gray-300 hover:text-white'}`}
              >
                हिं
              </button>
              <span className="text-gray-500">|</span>
              <button
                onClick={() => setLanguage('kn')}
                className={`px-1 rounded ${language === 'kn' ? 'font-bold text-[#F8E7C9]' : 'text-gray-300 hover:text-white'}`}
              >
                ಕನ್ನ
              </button>
            </div>

            {user?.role === 'admin' ? (
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                Admin View
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-[#064E3B] tracking-tight">AAKANKSHA</span>
              <span className="text-xs bg-[#F8E7C9] text-[#064E3B] px-1.5 py-0.5 rounded font-bold">
                आकांक्षा
              </span>
              <span className="text-xs bg-emerald-100 text-[#064E3B] px-1.5 py-0.5 rounded font-semibold hidden sm:inline">
                MoTA
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
              {t.portalTitle}
            </h1>
            <p className="text-[10px] text-gray-500 hidden sm:block">
              Unified Orchestration & Integration Layer for Tribal Scholarships
            </p>
          </div>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-gray-600 hover:text-[#064E3B] hover:bg-gray-100 rounded-full relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 bg-[#064E3B] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#F8E7C9]" />
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="bg-[#F8E7C9] text-[#064E3B] text-xs px-1.5 py-0.2 rounded-full font-bold">
                          {unreadCount} new
                        </span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-[#F8E7C9] hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                          No notifications right now
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 text-xs hover:bg-gray-50 transition cursor-pointer ${
                              !notif.read ? 'bg-emerald-50/50 font-medium' : 'text-gray-600'
                            }`}
                            onClick={() => {
                              api.markNotificationRead(notif.id);
                              if (notif.actionUrl) {
                                navigate(notif.actionUrl);
                                setNotificationsOpen(false);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900">{notif.title}</span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-gray-600 line-clamp-2">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 bg-gray-50 hover:bg-[#F8E7C9]/40 border border-gray-200 rounded-full text-xs font-medium text-gray-700 transition"
              >
                <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#064E3B] text-white hover:bg-[#053d2e] px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              {t.login}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Secondary Menu Bar */}
      {user && (
        <nav className="hidden md:block bg-[#064E3B] text-white text-xs border-t border-[#F8E7C9]/15 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-[#F8E7C9] text-[#064E3B] font-semibold shadow-sm'
                      : 'text-gray-100 hover:bg-[#04382A] hover:text-[#F8E7C9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-2 shadow-lg">
          {user ? (
            <>
              <div className="p-3 bg-gray-50 rounded-lg mb-2">
                <p className="font-semibold text-xs text-gray-900">{user.name}</p>
                <p className="text-[11px] text-gray-500 capitalize">{user.role} Account</p>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      active ? 'bg-[#064E3B] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#064E3B]"
                >
                  <User className="w-4 h-4" />
                  <span>{t.profile}</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-1 text-xs text-rose-600 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-[#064E3B] text-white py-2 rounded-lg text-xs font-semibold"
            >
              {t.login}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
