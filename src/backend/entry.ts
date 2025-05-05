// Import event handlers
import { init as initOrderEventHandlers } from './events/orders/event';
import { registerOrderHandlers } from './orders';

console.log(`🚀 Initializing Pricenator backend services`);

// Initialize all event handlers for production
try {
  console.log(`📋 Initializing order event handlers`);
  initOrderEventHandlers();
  registerOrderHandlers();
  
  console.log(`✅ Event handlers registered successfully`);
} catch (error) {
  console.error(`❌ Error initializing event handlers:`, error);
}

// Export an init function for the platform to call
export function init() {
  console.log(`✅ Pricenator backend initialization complete`);
  return {
    status: 'ready'
  };
}

// Call init function immediately
init(); 