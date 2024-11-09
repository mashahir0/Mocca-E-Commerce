import React from 'react'
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ]

  const navLinks = [
    { text: 'Support Center', href: '#' },
    { text: 'Investing', href: '#' },
    { text: 'Contract', href: '#' },
    { text: 'Careers', href: '#' },
    { text: 'Blog', href: '#' },
    { text: 'FAQs', href: '#' }
  ]

  return (
    <header className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex flex-col md:flex-row items-center justify-between py-4">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Logo */}
          <div className="text-2xl font-bold mb-4 md:mb-0">
            MOCCA
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
        </nav>

        {/* Copyright */}
        <div className="text-center py-2 text-xs text-gray-500 border-t">
          Copyright © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </header>
  )
}