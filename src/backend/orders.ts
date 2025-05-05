import { orders } from '@wix/ecom';
import { products } from '@wix/stores';
import { dashboard } from '@wix/dashboard';
import { ecom } from '@wix/ecom';

// Define types for our event handlers
interface OrderCreatedEvent {
  entity: {
    lineItems?: Array<{
      catalogReference?: {
        catalogItemId?: string;
      };
    }>;
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
 * Listen for new orders and update product prices accordingly
 */
export function registerOrderHandlers() {
  // Listen for order creation events
  orders.onOrderCreated((event: OrderCreatedEvent) => {
    try {
      const order = event.entity;
      
      // Get all line items (products) from the order
      const lineItems = order.lineItems || [];
      
      // Process each product in the order
      lineItems.forEach(async (lineItem) => {
        if (lineItem.catalogReference?.catalogItemId) {
          const productId = lineItem.catalogReference.catalogItemId;
          
          // Increase the product price by $1
          await updateProductPrice(productId);
          
          // Notify users viewing the product
          await notifyPriceChange(productId);
        }
      });
    } catch (error) {
      console.error('Error processing order:', error);
    }
  });
}

/**
 * Update the price of a product by adding $1
 */
async function updateProductPrice(productId: string) {
  try {
    // Get the current product
    const response = await products.getProduct(productId);
    
    if (!response.product) {
      console.error(`Product not found: ${productId}`);
      return;
    }
    
    // Get the current price and add $1
    const currentPrice = Number(response.product.price?.price || 0);
    const newPrice = currentPrice + 1;
    
    // Update the product with the new price
    await products.updateProduct(productId, {
      price: {
        price: Number(newPrice),
        formatted: {
          price: `$${newPrice.toFixed(2)}`
        }
      }
    });
    
    console.log(`Price updated for product ${productId} from $${currentPrice.toFixed(2)} to $${newPrice.toFixed(2)}`);
  } catch (error) {
    console.error(`Error updating price for product ${productId}:`, error);
  }
}

/**
 * Notify users viewing a product that its price has changed
 */
async function notifyPriceChange(productId: string) {
  try {
    // Publish a message to the pubsub channel for this product
    await ecom.events.publish({
      channel: `product-price-update-${productId}`,
      data: {
        type: 'PRICE_CHANGE',
        productId,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`Published price change notification for product ${productId}`);
  } catch (error) {
    console.error(`Error notifying price change for product ${productId}:`, error);
  }
} 