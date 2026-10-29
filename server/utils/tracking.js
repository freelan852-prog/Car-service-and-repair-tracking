/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TRACKER_STAGES, PRICING_TABLE, STAGE_INTERVAL_SECONDS } from '../config/pricing.js';

const STAGE_MESSAGES = {
  'Booked': 'Order confirmed and service estimate locked.',
  'Vehicle received': 'Vehicle received and checked in at workshop bay.',
  'Inspection': 'Technician completed digital multipoint inspection.',
  'In progress': 'Scheduled maintenance and service operations underway.',
  'Ready': 'Quality control checks cleared. Vehicle ready for handover.',
  'Delivered': 'Service completed and vehicle delivered to customer.',
};

/**
 * Computes and advances order stage purely on request based on elapsed time.
 * Appends log entries and handles the inspection pause cleanly.
 */
export function updateOrderTracking(order) {
  if (order.status === 'Delivered' || order.status === 'Cancelled') {
    return order;
  }

  const now = Date.now();
  const startedTime = new Date(order.startedAt || order.createdAt).getTime();
  const totalElapsedSec = Math.max(0, (now - startedTime) / 1000);
  const pausedSec = order.pausedDurationSeconds || 0;
  const effectiveElapsedSec = Math.max(0, totalElapsedSec - pausedSec);

  const stageDuration = STAGE_INTERVAL_SECONDS; // e.g. 15s

  // Ensure initial log entry exists
  if (!order.log || order.log.length === 0) {
    order.log = [
      {
        type: 'order_created',
        message: 'Order created with locked rate guarantee.',
        timestamp: new Date(order.startedAt || order.createdAt),
      },
    ];
  }

  // Calculate potential stage index (0 to 5)
  // Stage 0: Booked (< 15s)
  // Stage 1: Vehicle received (>= 15s)
  // Stage 2: Inspection (>= 30s)
  // Stage 3: In progress (>= 45s)
  // Stage 4: Ready (>= 60s)
  // Stage 5: Delivered (>= 75s)
  let targetIndex = Math.min(
    TRACKER_STAGES.length - 1,
    Math.floor(effectiveElapsedSec / stageDuration)
  );

  const currentIndex = TRACKER_STAGES.indexOf(order.status);
  const inspectionIndex = TRACKER_STAGES.indexOf('Inspection'); // 2

  // Check if we have hit or passed Inspection stage
  if (targetIndex >= inspectionIndex) {
    // Generate extra work finding if not already present
    if (!order.extras || order.extras.length === 0) {
      const vType = order.vehicle?.type === 'bike' ? 'bike' : 'car';
      const template = PRICING_TABLE.extraWorkTemplates[vType];

      order.extras = [
        {
          extraId: 'extra-' + Math.random().toString(36).substring(2, 9),
          reason: template.reason,
          component: template.component,
          description: template.description,
          price: template.price,
          status: 'pending',
          photoPlaceholder: template.photoPlaceholder,
          createdAt: new Date(),
        },
      ];
      order.inspectionPromptedAt = new Date();

      order.log.push({
        type: 'extra_work',
        message: `Inspection alert: Additional recommendation flagged (${template.reason}). Awaiting customer authorization.`,
        timestamp: new Date(),
      });
    }

    const hasPendingExtra = order.extras.some((e) => e.status === 'pending');

    if (hasPendingExtra) {
      // Order PAUSES at Inspection until customer approves or declines!
      targetIndex = inspectionIndex;
    }
  }

  // Progressively advance stages from currentIndex up to targetIndex and add logs
  const startIdx = Math.max(0, currentIndex === -1 ? 0 : currentIndex);
  for (let i = startIdx + 1; i <= targetIndex; i++) {
    const stageName = TRACKER_STAGES[i];
    order.status = stageName;
    const stageTimestamp = new Date(startedTime + (i * stageDuration + pausedSec) * 1000);

    const alreadyLogged = order.log.some(
      (l) => l.type === 'status' && l.message === STAGE_MESSAGES[stageName]
    );

    if (!alreadyLogged) {
      order.log.push({
        type: 'status',
        message: STAGE_MESSAGES[stageName],
        timestamp: stageTimestamp > new Date() ? new Date() : stageTimestamp,
      });
    }
  }

  // Recalculate finalTotal: lockedTotal + any approved extras
  const approvedTotal = (order.extras || [])
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + e.price, 0);

  order.finalTotal = order.lockedTotal + approvedTotal;

  return order;
}
