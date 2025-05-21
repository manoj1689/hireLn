'use client';

import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiInfo,
} from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="w-full h-16 px-6 lg:px-12 bg-white shadow flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <Image src="/images/logo/company-logo.png" alt="HireLn Logo" width={100} height={32} />
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <FiBell className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="end"
              sideOffset={8}
              className="w-64 bg-gray-100 p-4 rounded-lg shadow-xl  z-50"
            >
              <p className="font-semibold mb-2 flex items-center gap-1">
                <FiBell /> Notifications
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <FiInfo className="text-blue-500" />
                  No new notifications
                </li>
              </ul>
              <Popover.Arrow className="fill-white h-2 w-4" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Profile */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <FiUser className="w-8 h-8 text-gray-700 cursor-pointer" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="end"
              sideOffset={8}
              className="w-56 bg-gray-100 p-4 rounded-lg shadow-xl z-50"
            >
              <p className="font-semibold mb-2 flex items-center gap-1">
                <FiUser /> My Account
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <FiUser />
                  <Link href="/profile">Profile</Link>
                </li>
                <li className="flex items-center gap-2">
                  <FiSettings />
                  <Link href="/settings">Settings</Link>
                </li>
                <li className="flex items-center gap-2">
                  <FiLogOut className="text-red-500" />
                  <button className="text-red-500">Logout</button>
                </li>
              </ul>
              <Popover.Arrow className="fill-white h-2 w-4" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </nav>
  );
}
