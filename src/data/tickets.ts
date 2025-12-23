import { TicketType, OwnedTicket, DrawHistory, RedemptionHistory } from './types';

export const ticketTypes: TicketType[] = [
  {
    id: 't1',
    rarity: 'Common',
    name: 'ตั๋วทองแดง',
    color: '#CD7F32',
    glowColor: 'rgba(205, 127, 50, 0.5)',
    probability: 0.60, // 60%
    icon: '🎫',
  },
  {
    id: 't2',
    rarity: 'Rare',
    name: 'ตั๋วเงิน',
    color: '#C0C0C0',
    glowColor: 'rgba(192, 192, 192, 0.5)',
    probability: 0.28, // 28%
    icon: '🎟️',
  },
  {
    id: 't3',
    rarity: 'Epic',
    name: 'ตั๋วทอง',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.6)',
    probability: 0.10, // 10%
    icon: '🏆',
  },
  {
    id: 't4',
    rarity: 'Legendary',
    name: 'ตั๋วเพชร',
    color: '#B9F2FF',
    glowColor: 'rgba(185, 242, 255, 0.8)',
    probability: 0.02, // 2%
    icon: '💎',
  },
];

// Mock owned tickets (starting balance)
export const initialOwnedTickets: OwnedTicket[] = [
  { ticketId: 't1', rarity: 'Common', quantity: 15 },
  { ticketId: 't2', rarity: 'Rare', quantity: 5 },
  { ticketId: 't3', rarity: 'Epic', quantity: 2 },
  { ticketId: 't4', rarity: 'Legendary', quantity: 0 },
];

// Mock draw history
export const mockDrawHistory: DrawHistory[] = [
  {
    id: 'dh1',
    ticketRarity: 'Common',
    ticketName: 'ตั๋วทองแดง',
    drawnAt: '2025-12-22T14:30:00Z',
  },
  {
    id: 'dh2',
    ticketRarity: 'Rare',
    ticketName: 'ตั๋วเงิน',
    drawnAt: '2025-12-22T10:15:00Z',
  },
  {
    id: 'dh3',
    ticketRarity: 'Epic',
    ticketName: 'ตั๋วทอง',
    drawnAt: '2025-12-21T18:45:00Z',
  },
  {
    id: 'dh4',
    ticketRarity: 'Common',
    ticketName: 'ตั๋วทองแดง',
    drawnAt: '2025-12-21T09:20:00Z',
  },
  {
    id: 'dh5',
    ticketRarity: 'Common',
    ticketName: 'ตั๋วทองแดง',
    drawnAt: '2025-12-20T16:00:00Z',
  },
];

// Mock redemption history
export const mockRedemptionHistory: RedemptionHistory[] = [
  {
    id: 'rd1',
    productId: 'p5',
    productName: 'Detox Fiber Plus',
    productImage: 'https://placehold.co/600x600/1A1A2A/16A34A?text=Detox',
    ticketsUsed: [{ rarity: 'Rare', quantity: 3 }],
    redeemedAt: '2025-12-20T12:30:00Z',
    status: 'completed',
  },
  {
    id: 'rd2',
    productId: 'p9',
    productName: 'Green Coffee Bean Extract',
    productImage: 'https://placehold.co/600x600/1A1A2A/15803D?text=Green+Coffee',
    ticketsUsed: [{ rarity: 'Common', quantity: 10 }],
    redeemedAt: '2025-12-18T15:45:00Z',
    status: 'shipped',
  },
];

// Draw ticket function (client-side probability)
export function drawTicket(): TicketType {
  const random = Math.random();
  let cumulative = 0;

  for (const ticket of ticketTypes) {
    cumulative += ticket.probability;
    if (random <= cumulative) {
      return ticket;
    }
  }

  // Fallback (should never reach)
  return ticketTypes[0];
}

// Get ticket by ID
export function getTicketById(id: string): TicketType | undefined {
  return ticketTypes.find(t => t.id === id);
}

// Get ticket by rarity
export function getTicketByRarity(rarity: string): TicketType | undefined {
  return ticketTypes.find(t => t.rarity === rarity);
}
