export interface MockMessage {
  id: string;
  senderId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface MockConversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  isResolved: boolean;
  messages: MockMessage[];
}

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'conv1',
    listingId: 'l1',
    buyerId: 'u2',
    sellerId: 'u1',
    isResolved: false,
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        content: 'Hi, is this still available?',
        sentAt: '2025-06-02T21:00:00Z',
        read: true,
      },
      {
        id: 'm2',
        senderId: 'u1',
        content: 'Yes it is! When do you want to come collect?',
        sentAt: '2025-06-02T21:03:00Z',
        read: true,
      },
      {
        id: 'm3',
        senderId: 'u2',
        content: 'Can I get it tomorrow after 5pm?',
        sentAt: '2025-06-02T21:05:00Z',
        read: true,
      },
      {
        id: 'm4',
        senderId: 'u1',
        content: 'Perfect, I am in room 302. Just knock.',
        sentAt: '2025-06-02T21:06:00Z',
        read: false,
      },
    ],
  },
  {
    id: 'conv2',
    listingId: 'l2',
    buyerId: 'u1',
    sellerId: 'u2',
    isResolved: true,
    messages: [
      {
        id: 'm5',
        senderId: 'u1',
        content: 'Hey, can I get the 12-piece wings tonight?',
        sentAt: '2025-06-02T19:00:00Z',
        read: true,
      },
      {
        id: 'm6',
        senderId: 'u2',
        content: 'Sure! Come to Jubilee kitchen entrance at 8pm.',
        sentAt: '2025-06-02T19:02:00Z',
        read: true,
      },
      {
        id: 'm7',
        senderId: 'u1',
        content: 'Got them, thanks! Really good.',
        sentAt: '2025-06-02T20:30:00Z',
        read: true,
      },
    ],
  },
  {
    id: 'conv3',
    listingId: 'l4',
    buyerId: 'u4',
    sellerId: 'u1',
    isResolved: false,
    messages: [
      {
        id: 'm8',
        senderId: 'u4',
        content: 'Do you tutor on weekends too?',
        sentAt: '2025-06-03T10:00:00Z',
        read: true,
      },
      {
        id: 'm9',
        senderId: 'u1',
        content: 'Yes, Saturday mornings work. What topics do you need help with?',
        sentAt: '2025-06-03T10:05:00Z',
        read: false,
      },
    ],
  },
];
