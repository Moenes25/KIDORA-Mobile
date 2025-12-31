// services/clientService.js
import api from './api';

export const clientService = {
  // Login - only for PARENT role
  login: async (email, password) => {
    try {
      const response = await api.post('/client/login', {
        email,
        password
      });
      return response.data; // Returns { token, type, user }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get all clients
  getAllClients: async () => {
    const response = await api.get('/client/all');
    return response.data;
  },

  // Get all parents
  getAllParents: async () => {
    const response = await api.get('/client/parents');
    return response.data;
  },

  // Get all educateurs
  getAllEducateurs: async () => {
    const response = await api.get('/client/educateurs');
    return response.data;
  },

  // Update client profile
  updateClient: async (id, clientData, imageFile) => {
    const formData = new FormData();
    
    // Add all fields
    if (clientData.nom) formData.append('nom', clientData.nom);
    if (clientData.prenom) formData.append('prenom', clientData.prenom);
    if (clientData.numTel) formData.append('numTel', clientData.numTel);
    if (clientData.adresse) formData.append('adresse', clientData.adresse);
    if (clientData.profession) formData.append('profession', clientData.profession);
    if (clientData.relation) formData.append('relation', clientData.relation);
    if (clientData.specialisation) formData.append('specialisation', clientData.specialisation);
    if (clientData.experience) formData.append('experience', clientData.experience);
    if (clientData.disponibilite) formData.append('disponibilite', clientData.disponibilite);
    if (clientData.classe) formData.append('classe', clientData.classe);
    if (clientData.statutClient) formData.append('statutClient', clientData.statutClient);
    
    // Add image if provided
    if (imageFile) {
      formData.append('imageFile', {
        uri: imageFile.uri,
        type: imageFile.type || 'image/jpeg',
        name: imageFile.fileName || 'profile.jpg'
      });
    }
    
    const response = await api.put(`/client/update-client/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  },

  // Delete client
  deleteClient: async (clientId) => {
    const response = await api.delete(`/client/delete-client/${clientId}`);
    return response.data;
  },
};