# Orders & Tickets Hub - Usage Examples

## Orders History Page (`/orders`)

### Features:
1. **Status Filter Buttons**
   - Click "ทั้งหมด" to show all orders
   - Click individual statuses to filter (รอชำระเงิน, ชำระแล้ว, etc.)

2. **Order Cards Display**
   - Shows: Order number, items count, status badge, total price
   - Each card is clickable → navigates to order detail

3. **Status Badges**
   ```
   ⏳ รอชำระเงิน (warning - yellow)
   ✓ ชำระแล้ว (info - blue)
   📦 กำลังเตรียม (info - blue)
   🚚 จัดส่งแล้ว (info - blue)
   ✓ ส่งถึงแล้ว (success - green)
   ✕ ยกเลิก (error - red)
   ```

## Order Detail Page (`/orders/[id]`)

### Timeline Section
The timeline shows status progression with animation:
```
① รอชำระเงิน → ② ชำระเงินแล้ว → ③ กำลังเตรียม → ④ จัดส่งแล้ว → ⑤ ส่งถึงแล้ว
```

- Completed steps show checkmarks (✓) with green background
- Current step has pink border and pulse animation
- Future steps are grayed out

### Demo Status Button
- Click "Demo: เปลี่ยนสถานะไปขั้นต่อไป" to advance status
- Updates timeline in real-time
- Button disables when order is "ส่งถึงแล้ว"

### Order Information Displayed:
1. **Timeline** - Status progression with dates
2. **Items** - Product image, name, variants, quantity, price
3. **Shipping Address** - Full delivery address with phone
4. **Payment Summary** - Breakdown of costs
5. **Shipping Info** - Courier and tracking number
6. **Payment Method** - How payment was made

## Tickets Hub (`/tickets`)

### Tab 1: Draw (🎲 สุ่มตั๋ว)

**Process:**
1. Click "🎲 สุ่มตั๋วเลย" button
2. Spinner animation plays (2 seconds)
3. Modal shows the drawn ticket with:
   - Glow effect matching ticket rarity
   - Ticket name and rarity badge
   - Success message
4. Click "เก็บไว้ใน Vault" to close modal
5. Ticket is added to your inventory

**Ticket Rarities & Probabilities:**
```
Common (60%)     - ตั๋วทองแดง (🎫) - Bronze color
Rare (28%)       - ตั๋วเงิน (🎟️) - Silver color
Epic (10%)       - ตั๋วทอง (🏆) - Gold color
Legendary (2%)   - ตั๋วเพชร (💎) - Diamond color
```

### Tab 2: Redeem (✨ แลกสินค้า)

**How to Redeem:**
1. Browse available redeemable products
2. Check "แสดงต้องใช้" section for required tickets
3. See your current vs required quantity:
   - ✅ Green background = You have enough
   - ❌ Red background = Not enough tickets
4. Click "✨ แลกสินค้า" to redeem (if you have enough)
5. Tickets are deducted from inventory automatically

**Requirements Display:**
```
🎫 ตั๋วทองแดง: 15/10  (you have 15, need 10)
🎟️ ตั๋วเงิน: 5/3     (you have 5, need 3)
```

### Tab 3: Vault (💰 Vault)

#### Sub-tab: ตั๋วของฉัน (Your Tickets)
- Shows all tickets you own
- Each ticket card displays:
  - Ticket icon with colored background
  - Ticket name
  - Rarity badge
  - Large quantity number
  - Colored border matching ticket rarity
- Shows redemption history below inventory

#### Sub-tab: ประวัติการแลก (History)
- Lists all tickets you've drawn
- Shows timestamp for each draw
- Displays in reverse chronological order (newest first)

**Example History Entry:**
```
🏆 ตั๋วทอง
22 ธ.ค. 14:30
[Epic badge]
```

## State Management with useTickets

### How to Use in Components:
```tsx
import { useTickets } from '@/contexts/TicketsContext';

export function MyComponent() {
  const { 
    ownedTickets,        // OwnedTicket[]
    drawHistory,         // DrawHistory[]
    redemptionHistory,   // RedemptionHistory[]
    drawNewTicket,       // () => TicketType
    addTicket,           // (ticketId, quantity) => void
    removeTickets,       // (ticketId, quantity) => boolean
    getTicketQuantity,   // (ticketId) => number
    addDrawHistory,      // (ticket) => void
    addRedemptionHistory // (redemption) => void
  } = useTickets();
  
  // Use these functions as needed
}
```

## Initial State

When you first visit the Tickets page:

**Owned Tickets:**
- 15x ตั๋วทองแดง (Common)
- 5x ตั๋วเงิน (Rare)
- 2x ตั๋วทอง (Epic)
- 0x ตั๋วเพชร (Legendary)

**Draw History:** 5 previous draws
**Redemption History:** 2 previous redemptions

## Responsive Design

All pages are fully responsive:
- **Mobile:** Stack layout, full-width cards, adjusted spacing
- **Tablet:** 2-column layouts where appropriate
- **Desktop:** Multi-column grids, side-by-side sections

## Color Theme

**Primary Colors:**
- Hot Pink: #FF4D9D (primary buttons, badges)
- Purple: #B84DFF (gradients, secondary elements)
- Dark Navy: #0B0B0F (background)
- Light Gray: #F5F5F7 (text)

**Status Colors:**
- Success (Green): Delivered, enough tickets
- Warning (Yellow): Pending payment
- Error (Red): Cancelled, not enough tickets
- Info (Blue): In progress statuses
