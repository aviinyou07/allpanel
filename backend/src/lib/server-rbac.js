import { query } from './db.js';

export async function isInDownline(actorId, targetId) {
  let currentId = targetId;
  const visited = new Set();
  
  while (currentId) {
    if (visited.has(currentId)) break; // Prevent cycles
    visited.add(currentId);
    
    const rows = await query('SELECT id, parent_id FROM users WHERE id = ? AND deleted_at IS NULL', [currentId]);
    if (rows.length === 0) return false;
    
    const user = rows[0];
    if (user.parent_id === actorId) return true;
    currentId = user.parent_id;
  }
  
  return false;
}
