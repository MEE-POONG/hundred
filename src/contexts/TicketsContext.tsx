'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { OwnedTicket, DrawHistory, RedemptionHistory, TicketType } from '@/data/types';
import { ticketTypes, getTicketById } from '@/data/tickets';

interface TicketsContextType {
  drawChances: number;
  ownedTickets: OwnedTicket[];
  drawHistory: DrawHistory[];
  redemptionHistory: RedemptionHistory[];
  drawNewTicket: () => Promise<TicketType | null>;
  redeemProduct: (productId: string) => Promise<boolean>;
  refreshTickets: () => void;
  isLoading: boolean;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [drawChances, setDrawChances] = useState(0);
  const [ownedTickets, setOwnedTickets] = useState<OwnedTicket[]>([]);
  const [drawHistoryList, setDrawHistoryList] = useState<DrawHistory[]>([]); // Future: History API
  const [redemptionHistoryList, setRedemptionHistoryList] = useState<RedemptionHistory[]>([]); // Future
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    if (!session) return;
    try {
      // 1. Get Draw Chances
      const resChances = await fetch('/api/user/tickets');
      if (resChances.ok) {
        const data = await resChances.json();
        setDrawChances(data.count);
      }

      // 2. Get Inventory (Ticket Cards)
      const resInv = await fetch('/api/inventory');
      if (resInv.ok) {
        const items = await resInv.json();
        // Convert Inventory items (ticket_card) to OwnedTicket format
        const tickets = items
          .filter((i: any) => i.itemType === 'ticket_card')
          .map((i: any) => ({
            ticketId: i.itemId,
            rarity: i.rarity,
            quantity: i.quantity
          }));
        setOwnedTickets(tickets);
      }

      // 3. Get Redemptions
      const resRedemptions = await fetch('/api/user/redemptions');
      if (resRedemptions.ok) {
        const data = await resRedemptions.json();
        // Frontend component expects 'redeemedAt' which our API returns
        // Map any mismatches if necessary, but API aligns.
        setRedemptionHistoryList(data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchTickets();
    } else {
      setDrawChances(0);
      setOwnedTickets([]);
      setIsLoading(false);
    }
  }, [session, fetchTickets]);

  const drawNewTicket = async (): Promise<TicketType | null> => {
    if (drawChances <= 0) {
      alert('ไม่มีตั๋วสุ่มเหลืออยู่!');
      return null;
    }

    try {
      const res = await fetch('/api/user/tickets', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await fetchTickets(); // Refresh

        // Find ticket type definition
        const ticketType = ticketTypes.find(t => t.id === data.result.id);

        // Add to history (local mock for now, API later)
        if (ticketType) {
          const newEntry: DrawHistory = {
            id: `dh-${Date.now()}`,
            ticketRarity: ticketType.rarity,
            ticketName: ticketType.name,
            drawnAt: new Date().toISOString(),
          };
          setDrawHistoryList(prev => [newEntry, ...prev]);
        }

        return ticketType || null;
      } else {
        const err = await res.json();
        alert(err.error || 'การสุ่มล้มเหลว');
        return null;
      }
    } catch (err) {
      console.error('Draw failed:', err);
      return null;
    }
  };

  const redeemProduct = async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/inventory/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        await fetchTickets(); // Refresh inventory
        return true;
      }
      const err = await res.json();
      alert(err.error || 'แลกสินค้าล้มเหลว');
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <TicketsContext.Provider
      value={{
        drawChances,
        ownedTickets,
        drawHistory: drawHistoryList,
        redemptionHistory: redemptionHistoryList,
        drawNewTicket,
        redeemProduct,
        refreshTickets: fetchTickets,
        isLoading
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (!context) throw new Error('useTickets must be used within TicketsProvider');
  return context;
}
