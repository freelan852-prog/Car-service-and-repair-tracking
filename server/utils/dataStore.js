/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.resolve(process.cwd(), 'server', 'store_data.json');

let store = {
  users: [],
  vehicles: [],
  orders: [],
};

// Load existing data from file if present
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    store = JSON.parse(raw);
  }
} catch (e) {
  console.warn('[DataStore] Failed to read storage file, initializing empty store:', e.message);
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DataStore] Failed to persist storage:', e.message);
  }
}

export const fallbackStore = {
  users: {
    async findOne(query) {
      return store.users.find((u) => {
        for (const k in query) {
          if (query[k] && typeof query[k] === 'object' && query[k].$regex) {
            const re = new RegExp(query[k].$regex, query[k].$options || '');
            if (!re.test(u[k])) return false;
          } else if (u[k] !== query[k]) {
            return false;
          }
        }
        return true;
      }) || null;
    },
    async findById(id) {
      return store.users.find((u) => u.id === id || u._id === id) || null;
    },
    async create(data) {
      const id = crypto.randomUUID();
      const user = {
        _id: id,
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.users.push(user);
      persist();
      return user;
    },
  },

  vehicles: {
    async find(query) {
      return store.vehicles.filter((v) => {
        for (const k in query) {
          const expected = query[k]?.toString?.() || query[k];
          const actual = v[k]?.toString?.() || v[k];
          if (actual !== expected) return false;
        }
        return true;
      });
    },
    async findById(id) {
      return store.vehicles.find((v) => v.id === id || v._id === id) || null;
    },
    async findOne(query) {
      return store.vehicles.find((v) => {
        for (const k in query) {
          const expected = query[k]?.toString?.() || query[k];
          const actual = v[k]?.toString?.() || v[k];
          if (actual !== expected) return false;
        }
        return true;
      }) || null;
    },
    async create(data) {
      const id = crypto.randomUUID();
      const vehicle = {
        _id: id,
        id,
        ...data,
        user: data.user?.toString() || data.user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.vehicles.push(vehicle);
      persist();
      return vehicle;
    },
    async findByIdAndUpdate(id, update) {
      const idx = store.vehicles.findIndex((v) => v.id === id || v._id === id);
      if (idx === -1) return null;
      store.vehicles[idx] = {
        ...store.vehicles[idx],
        ...update,
        updatedAt: new Date().toISOString(),
      };
      persist();
      return store.vehicles[idx];
    },
    async findByIdAndDelete(id) {
      const idx = store.vehicles.findIndex((v) => v.id === id || v._id === id);
      if (idx === -1) return null;
      const [removed] = store.vehicles.splice(idx, 1);
      persist();
      return removed;
    },
  },

  orders: {
    async find(query) {
      return store.orders.filter((o) => {
        for (const k in query) {
          const expected = query[k]?.toString?.() || query[k];
          const actual = o[k]?.toString?.() || o[k];
          if (actual !== expected) return false;
        }
        return true;
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async findById(id) {
      return store.orders.find((o) => o.id === id || o._id === id) || null;
    },
    async create(data) {
      const id = crypto.randomUUID();
      const order = {
        _id: id,
        id,
        ...data,
        user: data.user?.toString() || data.user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.orders.push(order);
      persist();
      return order;
    },
    async save(order) {
      const idx = store.orders.findIndex((o) => o.id === order.id || o._id === order.id);
      if (idx !== -1) {
        store.orders[idx] = {
          ...store.orders[idx],
          ...order,
          updatedAt: new Date().toISOString(),
        };
        persist();
        return store.orders[idx];
      }
      return order;
    },
  },
};
