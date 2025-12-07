// mockData.js
export const USERSv = [
  {
    id: 'u1',
    name: 'Ayoub',
    email: 'ayoub@example.com',
    avatar: 'https://www.gravatar.com/avatar/1f5a6f4b4b7e8f6d4c8d4a8376a1a6f5?s=200&d=identicon',
  },
  {
    id: 'u2',
    name: 'Emna',
    email: 'emna@example.com',
    avatar: 'https://www.gravatar.com/avatar/2a6b8f7d8c9d1e2f3a4b5c6d7e8f9a0b?s=200&d=identicon',
  },
  {
    id: 'u3',
    name: 'Omar',
    email: 'omar@example.com',
    avatar: 'https://www.gravatar.com/avatar/3b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e?s=200&d=identicon',
  },
  {
    id: 'u4',
    name: 'Eya',
    email: 'eya@example.com',
    avatar: 'https://www.gravatar.com/avatar/4c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f?s=200&d=identicon',
  },
];

export const CONVERSATIONSv = {
  // conversation per user id (messages are ordered oldest -> newest)
  u1: [
    { id: 'm1', from: 'u1', text: 'Salut Ayoub!', time: '09:10' },
    { id: 'm2', from: 'me', text: 'Salut, comment ça va ?', time: '09:11' },
    { id: 'm3', from: 'u1', text: "Je vais bien, merci 🙂", time: '09:12' },
  ],
  u2: [
    { id: 'm1', from: 'u2', text: 'Tu as vu le design ?', time: '13:02' },
    { id: 'm2', from: 'me', text: "Pas encore, j'ouvre tout de suite.", time: '13:03' },
  ],
  u3: [
    { id: 'm1', from: 'u3', text: 'On code ce week-end ?', time: '11:12' },
  ],
  u4: [
    { id: 'm1', from: 'u4', text: 'RDV à 16h', time: '08:00' },
    { id: 'm2', from: 'me', text: 'Ok je serai là.', time: '08:01' },
  ],
};
export const USERS = [
  { id: 'u1', name: 'Ayoub', avatar: 'https://www.gravatar.com/avatar/1f5a6f4b4b7e8f6d4c8d4a8376a1a6f5?s=200&d=identicon' },
  { id: 'u2', name: 'Emna', avatar: 'https://www.gravatar.com/avatar/2a6b8f7d8c9d1e2f3a4b5c6d7e8f9a0b?s=200&d=identicon' },
  { id: 'u3', name: 'Omar', avatar: 'https://www.gravatar.com/avatar/3b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e?s=200&d=identicon' },
  { id: 'u4', name: 'Eya', avatar: 'https://www.gravatar.com/avatar/4c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f?s=200&d=identicon' },
];

export const CONVERSATIONS = {
  u1: [
    { id: 'm1', from: 'u1', text: 'Salut Ayoub! 👋', time: '09:10' },
    { id: 'm2', from: 'me', text: 'Salut, comment ça va ?', time: '09:11' },
    { id: 'm3', from: 'u1', text: "Je vais bien, merci 🙂", time: '09:12' },
  ],
  u2: [{ id: 'm1', from: 'u2', text: 'Tu as vu le design ?', time: '13:02' }],
};

export const STORIES = [
  { id: 's1', user: USERS[0], type: 'image', uri: 'https://placekitten.com/400/600' },
  { id: 's2', user: USERS[1], type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 's3', user: USERS[2], type: 'image', uri: 'https://placekitten.com/401/600' },
  { id: 's4', user: USERS[3], type: 'video', uri: 'https://www.w3schools.com/html/movie.mp4' },
];
