import { orders } from '@wix/ecom';
import { products } from '@wix/stores';
import { PRICE_UPDATE_AMOUNT, CHANNEL_PREFIX } from '../../../site/plugins/custom-elements/price-updater/consts';

// Define event type
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

/**
 * Listen to order events and update product prices
 */
export function init() {
  // Listen for order created events
  orders.onOrderCreated(async (event: OrderCreatedEvent) => {
    try {
      console.log('Order created event received:', event.metadata._id);
      
      // Get line items from the order
      const order = event.entity;
      
      if (!order.lineItems || order.lineItems.length === 0) {
        console.log('No line items found in order');
        return;
      }
      
      // Process each product in the order
      for (const lineItem of order.lineItems) {
        if (lineItem.catalogReference?.catalogItemId) {
          const productId = lineItem.catalogReference.catalogItemId;
          
          // Update the product price
          await updateProductPrice(productId);
          
          // Notify users that are viewing the product
          await notifyPriceChange(productId);
        }
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  });
}

/**
 * Update a product's price by adding $1
 */
async function updateProductPrice(productId: string): Promise<void> {
  try {
    console.log(`Updating price for product: ${productId}`);
    
    // Get the current product
    const response = await products.getProduct(productId);
    const product = response.product;
    
    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }
    
    // Get the current price
    const currentPrice = Number(product.price?.price || 0);
    const newPrice = currentPrice + PRICE_UPDATE_AMOUNT;
    
    // Update the product with the new price
    await products.updateProduct({
      product: {
        id: productId,
        price: {
          price: newPrice.toString(),
          formatted: {
            price: `$${newPrice.toFixed(2)}`
          }
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
async function notifyPriceChange(productId: string): Promise<void> {
  try {
    console.log(`Publishing price change notification for product: ${productId}`);
    
    // Use Wix site window pubsub to notify clients
    await orders.publish({
      channel: `${CHANNEL_PREFIX}${productId}`,
      data: {
        type: 'PRICE_CHANGE',
        productId,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log(`Price change notification published for product ${productId}`);
  } catch (error) {
    console.error(`Error publishing price change notification for product ${productId}:`, error);
  }
} 