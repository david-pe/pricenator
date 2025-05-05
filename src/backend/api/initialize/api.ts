import { init as initOrderEvents } from '../../events/orders/event';

/**
 * Initialization endpoint for the app
 * This is called when the app is first installed or when the dashboard is loaded
 */
export async function POST(req: Request) {
  try {
    console.log('Initializing Pricenator app...');
    
    // Initialize event handlers
    initOrderEvents();
    
    // Register event subscriptions with Wix
    // Note: This part is typically handled by the Wix CLI app framework
    // based on the event.json files and wix.config.json
    
    console.log('Pricenator app initialized successfully');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'App initialized successfully'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error initializing app:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Error initializing app',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 