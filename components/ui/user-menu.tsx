"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, User, Shield } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 rounded-full bg-tan/20 animate-pulse border border-tan/30" />
    );
  }

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="relative text-base font-medium text-brown/85 hover:text-brown transition-colors cursor-pointer after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-brown after:transition-all after:duration-300 hover:after:w-full"
      >
        Acceder
      </Link>
    );
  }

  const role = user?.publicMetadata?.role as string | undefined;
  const isAdmin = role === "admin";
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName || user?.username || "Usuario";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-olive/40 focus:ring-offset-2 focus:ring-offset-cream transition-transform active:scale-95 duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menú de usuario"
      >
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-tan/50 hover:border-olive/70 transition-colors duration-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-olive/10 border border-olive/30 flex items-center justify-center text-olive" aria-hidden="true">
            <User size={16} />
          </div>
        )}
      </button>


      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-cream border border-tan/30 rounded-2xl shadow-xl py-2 z-[100] animate-in fade-in slide-in-from-top-3 duration-200 origin-top-right">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-tan/20">
            <p className="text-sm font-semibold text-brown truncate">{displayName}</p>
            {userEmail && (
              <p className="text-xs text-brown/50 truncate mt-0.5">{userEmail}</p>
            )}
            
            {/* Role Badge */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase ${
                isAdmin 
                  ? "bg-olive/10 text-olive border border-olive/20" 
                  : "bg-tan/30 text-brown border border-tan/40"
              }`}>
                <Shield size={10} />
                {isAdmin ? "Admin" : "Comprador"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-1 py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-700 hover:bg-red-50/50 rounded-xl transition-colors duration-150 text-left font-medium"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
