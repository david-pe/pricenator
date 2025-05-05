import { orders } from '@wix/ecom';
import { products } from '@wix/stores';
import { PRICE_UPDATE_AMOUNT } from '../site/plugins/custom-elements/price-updater/consts';

// Define types for our event handlers
interface OrderCreatedEvent {
  entity: {
    lineItems?: Array<{
      catalogReference?: {
        catalogItemId?: string;
      };
    }>;
  };
  metadata: {
    _id: string;
  };
}

interface Product {
  id: string;
  price?: {
    price?: string;
    formatted?: {
      price?: string;
    };
  };
}

/**
 * Register order handlers for the app
 */
export function registerOrderHandlers() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 Registering order handlers`);
  
  try {
    // Listen for order creation events - using generic handler to avoid type issues
    orders.onOrderCreated(event => {
      const eventTimestamp = new Date().toISOString();
      console.log(`[${eventTimestamp}] 📥 Order event received`);
      
      handleOrder(event)
        .then(result => console.log(`[${eventTimestamp}] ✅ Order handling complete`))
        .catch(error => console.error(`[${eventTimestamp}] ❌ Order handling error:`, error));
    });
    
    console.log(`[${timestamp}] ✅ Order handlers registered successfully`);
  } catch (error) {
    console.error(`[${timestamp}] ❌ Failed to register order handlers:`, error);
  }
}

/**
 * Handle an order by updating prices and notifying users
 */
async function handleOrder(event: any): Promise<void> {
  const timestamp = new Date().toISOString();
  
  try {
    if (!event || !event.entity) {
      console.log(`[${timestamp}] ⚠️ Invalid order event received`);
      return;
    }
    
    const order = event.entity;
    
    if (!order.lineItems || order.lineItems.length === 0) {
      console.log(`[${timestamp}] ℹ️ No line items found in order`);
      return;
    }
    
    console.log(`[${timestamp}] 📦 Processing ${order.lineItems.length} line items`);
    
    // Process each product in the order
    for (const lineItem of order.lineItems) {
      if (!lineItem.catalogReference?.catalogItemId) {
        console.log(`[${timestamp}] ⚠️ Line item has no catalog reference or product ID`);
        continue;
      }
      
      const productId = lineItem.catalogReference.catalogItemId;
      console.log(`[${timestamp}] 🔍 Processing product: ${productId}`);
      
      try {
        // Update product price
        await updateProductPrice(productId);
        
        // Notify users viewing the product
        await notifyPriceChange(productId);
      } catch (error) {
        console.error(`[${timestamp}] ❌ Error processing product ${productId}:`, error);
      }
    }
    
    console.log(`[${timestamp}] ✅ Order processing complete`);
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error handling order:`, error);
    throw error;
  }
}

/**
 * Update the price of a product by adding $1
 */
async function updateProductPrice(productId: string) {
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`[${timestamp}] 💰 Updating price for product: ${productId}`);
    
    // Get the current product
    const response = await products.getProduct(productId);
    
    if (!response.product) {
      console.error(`[${timestamp}] ❌ Product not found: ${productId}`);
      return;
    }
    
    // Get the current price and add $1
    const currentPrice = Number(response.product.price?.price || 0);
    const newPrice = currentPrice + PRICE_UPDATE_AMOUNT;
    
    console.log(`[${timestamp}] 💲 Current price: ${currentPrice.toFixed(2)}, New price: ${newPrice.toFixed(2)}`);
    
    // Update the product with the new price
    await products.updateProduct(productId, {
      priceData: {
        price: newPrice
      }
    });
    
    console.log(`[${timestamp}] ✅ Price updated for product ${productId} from ${currentPrice.toFixed(2)} to ${newPrice.toFixed(2)}`);
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error updating price for product ${productId}:`, error);
    throw error;
  }
}

/**
 * Notify users viewing a product that its price has changed
 * Note: In a production environment, this would use a proper messaging system
 * but for development we'll just log it
 */
async function notifyPriceChange(productId: string) {
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`[${timestamp}] 📢 Notifying price change for product ${productId}`);
    
    // In a real implementation, we would use a messaging system
    // For now, we'll just log that a notification would be sent
    console.log(`[${timestamp}] ✅ Price change notification would be sent for product ${productId}`);
    
    // The frontend component will poll for price changes or
    // use the SSE endpoint to receive real-time notifications
  } catch (error) {
    console.error(`[${timestamp}] ❌ Error notifying price change for product ${productId}:`, error);
  }
} 