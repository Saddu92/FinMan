"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; // Assuming lucide-react for icons

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItem = (href, label) => (
    <a
      href={href}
      className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium rounded-md transition-colors duration-200"
      onClick={() => setIsMenuOpen(false)} // Close menu on item click
    >
      {label}
    </a>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 p-4 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span aria-hidden="true">💸</span> FinMan
        </h1>
        <div className="hidden md:flex gap-4">
          {navItem('#landing', 'Home')}
          {navItem('#add', 'Add')}
          {navItem('#list', 'Transactions')}
          {navItem('#dashboard', 'Dashboard')}
          {navItem('#chart', 'Charts')}
        </div>
        <Button
          variant="ghost"
          className="md:hidden text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
          {navItem('#landing', 'Home')}
          {navItem('#add', 'Add')}
          {navItem('#list', 'Transactions')}
          {navItem('#dashboard', 'Dashboard')}
          {navItem('#chart', 'Charts')}
        </div>
      )}
    </nav>
  );
}