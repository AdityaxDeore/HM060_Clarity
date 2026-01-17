'use client';

import { useAuth } from '@/context/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { userProfile, signOut } = useAuth();

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences</p>
      </motion.div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div><Label>Name</Label><p className="text-muted-foreground">{userProfile?.displayName}</p></div>
          <div><Label>Email</Label><p className="text-muted-foreground">{userProfile?.email}</p></div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between"><Label>Notifications</Label><Switch defaultChecked={userProfile?.notificationsEnabled} /></div>
          <div className="flex items-center justify-between"><Label>Dark Mode</Label><Switch defaultChecked /></div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <Button variant="destructive" onClick={() => signOut()}>Sign Out</Button>
      </Card>
    </div>
  );
}
