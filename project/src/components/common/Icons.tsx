import React from 'react';
import * as LucideIcons from 'lucide-react';

// This component serves as a wrapper for Lucide icons
// It helps prevent ad blockers from blocking specific icon files
// by loading all icons as a bundle instead of individual files

type IconProps = {
  name: keyof typeof LucideIcons;
  size?: number;
  color?: string;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color, className }) => {
  const LucideIcon = LucideIcons[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }
  
  return <LucideIcon size={size} color={color} className={className} />;
};

// Export commonly used icons to avoid using the fingerprint icon directly
export const UserIcon = (props: Omit<IconProps, 'name'>) => <Icon name="User" {...props} />;
export const LockIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Lock" {...props} />;
export const KeyIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Key" {...props} />;
export const ShieldIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Shield" {...props} />;
export const UserCheckIcon = (props: Omit<IconProps, 'name'>) => <Icon name="UserCheck" {...props} />;
export const PhoneIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Phone" {...props} />;
export const MailIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Mail" {...props} />;
export const MapPinIcon = (props: Omit<IconProps, 'name'>) => <Icon name="MapPin" {...props} />;
export const FacebookIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Facebook" {...props} />;
export const InstagramIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Instagram" {...props} />;
export const LinkedinIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Linkedin" {...props} />;
export const ClockIcon = (props: Omit<IconProps, 'name'>) => <Icon name="Clock" {...props} />;

export default Icon;
