// Import event handlers
import { init as initOrderEvents } from './events/orders/event';

// Initialize all event handlers
export function init() {
  try {
    console.log('Initializing Pricenator event handlers...');
    
    // Initialize order event handlers
    initOrderEvents();
    
    console.log('Pricenator event handlers initialized successfully');
  } catch (error) {
    console.error('Error initializing Pricenator event handlers:', error);
  }
}

// Call init function immediately
init(); 