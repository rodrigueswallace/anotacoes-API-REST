import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { UserActionHistory, UserAction } from '@/components/ui/user-action-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface HistoricoTab {
  key: string;
  label: string;
  actions: UserAction[];
}

export interface HistoricoModalWithTabsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  tabs: HistoricoTab[];
}

export const HistoricoModalWithTabs = ({ 
  open, 
  onOpenChange, 
  title = "Histórico de Ações",
  tabs 
}: HistoricoModalWithTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="sm:max-w-4xl"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            <UserActionHistory 
              actions={tab.actions}
              className="border-none p-0"
            />
          </TabsContent>
        ))}
      </Tabs>
    </Modal>
  );
};
