'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { OwnedTicket, DrawHistory, RedemptionHistory, TicketType } from '@/data/types';
import {
  initialOwnedTickets,
  mockDrawHistory,
  mockRedemptionHistory,
  drawTicket,
  getTicketById
} from '@/data/tickets';

interface TicketsContextType {
  ownedTickets: OwnedTicket[];
  drawHistory: DrawHistory[];
  redemptionHistory: RedemptionHistory[];
  drawNewTicket: () => TicketType;
  addTicket: (ticketId: string, quantity: number) => void;
  removeTickets: (ticketId: string, quantity: number) => boolean;
  getTicketQuantity: (ticketId: string) => number;
  addDrawHistory: (ticket: TicketType) => void;
  addRedemptionHistory: (redemption: RedemptionHistory) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [ownedTickets, setOwnedTickets] = useState<OwnedTicket[]>(initialOwnedTickets);
  const [drawHistoryList, setDrawHistoryList] = useState<DrawHistory[]>(mockDrawHistory);
  const [redemptionHistoryList, setRedemptionHistoryList] = useState<RedemptionHistory[]>(mockRedemptionHistory);

  const getTicketQuantity = useCallback((ticketId: string) => {
    const ticket = ownedTickets.find(t => t.ticketId === ticketId);
    return ticket ? ticket.quantity : 0;
  }, [ownedTickets]);

  const addTicket = useCallback((ticketId: string, quantity: number) => {
    setOwnedTickets(prev => {
      const existing = prev.find(t => t.ticketId === ticketId);
      if (existing) {
        return prev.map(t =>
          t.ticketId === ticketId
            ? { ...t, quantity: t.quantity + quantity }
            : t
        );
      }

      const ticketType = getTicketById(ticketId);
      if (!ticketType) return prev;

      return [
        ...prev,
        {
          ticketId,
          rarity: ticketType.rarity,
          quantity,
        },
      ];
    });
  }, []);

  const removeTickets = useCallback((ticketId: string, quantity: number) => {
    let success = false;
    setOwnedTickets(prev => {
      const existing = prev.find(t => t.ticketId === ticketId);
      if (!existing || existing.quantity < quantity) {
        return prev;
      }
      success = true;

      if (existing.quantity === quantity) {
        return prev.filter(t => t.ticketId !== ticketId);
      }

      return prev.map(t =>
        t.ticketId === ticketId
          ? { ...t, quantity: t.quantity - quantity }
          : t
      );
    });
    return success;
  }, []);

  const drawNewTicket = useCallback(() => {
    return drawTicket();
  }, []);

  const addDrawHistory = useCallback((ticket: TicketType) => {
    const newEntry: DrawHistory = {
      id: `dh${Date.now()}`,
      ticketRarity: ticket.rarity,
      ticketName: ticket.name,
      drawnAt: new Date().toISOString(),
    };
    setDrawHistoryList(prev => [newEntry, ...prev]);
    addTicket(ticket.id, 1);
  }, [addTicket]);

  const addRedemptionHistory = useCallback((redemption: RedemptionHistory) => {
    setRedemptionHistoryList(prev => [redemption, ...prev]);
  }, []);

  return (
    <TicketsContext.Provider
      value={{
        ownedTickets,
        drawHistory: drawHistoryList,
        redemptionHistory: redemptionHistoryList,
        drawNewTicket,
        addTicket,
        removeTickets,
        getTicketQuantity,
        addDrawHistory,
        addRedemptionHistory,
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
