// mockData.js
export const USERS = [
  { id: 'u1', name: 'Ayoub', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'u2', name: 'Emna', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 'u3', name: 'Omar', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'u4', name: 'Eya', avatar: 'https://i.pravatar.cc/150?img=4' },
];

export const STORIES = [
  { id: 's1', user: USERS[0], type: 'image', uri: 'https://picsum.photos/400/700?random=1' },
  { id: 's2', user: USERS[1], type: 'video', uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 's3', user: USERS[2], type: 'image', uri: 'https://picsum.photos/400/700?random=2' },
  { id: 's4', user: USERS[3], type: 'video', uri: 'https://www.w3schools.com/html/movie.mp4' },
];

export const CONVERSATIONS = {
  u1: [
    { id: 'm1', from: 'u1', text: 'Salut Ayoub!', time: '09:10' },
    { id: 'm2', from: 'me', text: 'Salut, comment ça va ?', time: '09:11' },
    { id: 'm3', from: 'u1', text: "Je vais bien 🙂", time: '09:12' },
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
